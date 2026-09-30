#include "bot_use/bot_use_manager.h"

#include "bot_use/bot_use_adapter.h"
#include "bot_use/bot_use_client.h"
#include "storage/localimageloader.h"
#include "storage/storage_domain.h"

#include <QtCore/QDataStream>

namespace BotUse {
namespace {

constexpr auto kStoreVersion = quint32(1);
constexpr auto kMaximumStoreSize = 64 * 1024 * 1024;

} // namespace

Manager::Manager(not_null<Storage::Domain*> storage) : _storage(storage) {
}

Manager::~Manager() = default;

void Manager::start() {
	Expects(!_started);
	_started = true;
	const auto bytes = _storage->readBotUseData();
	if (!bytes) {
		_readOnly = true;
		_storageError = { u"BOT_STORE_UNREADABLE"_q };
		return;
	} else if (bytes->isEmpty()) {
		return;
	}
	auto stream = QDataStream(*bytes);
	stream.setVersion(QDataStream::Qt_5_1);
	auto version = quint32();
	auto count = quint32();
	stream >> version;
	if (version != kStoreVersion || bytes->size() > kMaximumStoreSize) {
		_readOnly = true;
		_storageError = { u"BOT_STORE_VERSION_OR_SIZE"_q };
		return;
	}
	stream >> _credentials.apiId >> _credentials.apiHash >> _generation
		>> _nextBot >> count;
	auto records = std::vector<Record>();
	auto ids = std::set<BotId>();
	auto identities = std::set<std::pair<int, uint64>>();
	auto valid = count <= 10000 && _nextBot > 0;
	for (auto i = quint32(); valid && i != count; ++i) {
		auto record = Record();
		auto user = quint64();
		auto environment = quint8();
		auto keys = quint32();
		stream >> record.info.id >> user >> record.info.name
			>> record.info.username >> record.token >> environment
			>> record.mainDcId >> keys;
		record.info.userId = UserId(user);
		record.environment = MTP::Environment(environment);
		record.info.state = _credentials.apiId
			? State::Disconnected
			: State::Unconfigured;
		valid = keys <= 100
			&& environment <= quint8(MTP::Environment::Test)
			&& record.info.id > 0 && record.info.id < _nextBot
			&& ids.emplace(record.info.id).second
			&& (!user || identities.emplace(environment, user).second);
		for (auto k = quint32(); valid && k != keys; ++k) {
			auto dc = qint32();
			auto data = QByteArray();
			stream >> dc >> data;
			valid = data.size() == MTP::AuthKey::kSize && dc > 0;
			if (valid) {
				auto key = MTP::AuthKey::Data();
				memcpy(key.data(), data.constData(), key.size());
				record.keys.push_back(std::make_shared<MTP::AuthKey>(
					MTP::AuthKey::Type::ReadFromFile, dc, key));
			}
		}
		auto sent = quint32();
		stream >> sent;
		valid = valid && sent <= quint32(bytes->size() / 16);
		for (auto m = quint32(); valid && m != sent; ++m) {
			auto peer = quint64();
			auto msg = qint64();
			stream >> peer >> msg;
			const auto id = FullMsgId(PeerId(peer), MsgId(msg));
			valid = !ValidateTarget(id.peer) && IsServerMsgId(id.msg);
			record.sent.emplace(id);
		}
		valid = valid && stream.status() == QDataStream::Ok;
		records.push_back(std::move(record));
	}
	if (!valid || !stream.atEnd() || stream.status() != QDataStream::Ok) {
		_readOnly = true;
		_storageError = { u"BOT_STORE_CORRUPT"_q };
		return;
	}
	for (auto &record : records) {
		const auto id = record.info.id;
		_clients.emplace(id, std::make_unique<Client>(this, std::move(record)));
	}
}

void Manager::finish() {
	for (const auto &[id, client] : _pending) {
		client->stop();
	}
	_pending.clear();
	for (const auto &[id, client] : _clients) {
		client->stop();
	}
	if (_started && !_readOnly) {
		if (!save()) {
			changed();
		}
	}
	_clients.clear();
	_retired.clear();
	_started = false;
}

void Manager::reset() {
	_pending.clear();
	_clients.clear();
	_retired.clear();
	_storage->clearBotUseData();
	_credentials = {};
	_configurationError = {};
	_storageError = {};
	_readOnly = false;
	_nextBot = 1;
	++_generation;
	changed();
}

bool Manager::hasCredentials() const {
	return !_clients.empty() || !_credentials.apiHash.isEmpty() || _readOnly;
}

bool Manager::busy() const {
	if (!_pending.empty()) {
		return true;
	}
	for (const auto &[id, client] : _clients) {
		if (client->busy()) {
			return true;
		}
	}
	return false;
}

Error Manager::storageError() const {
	return _storageError;
}

int Manager::apiId() const {
	return _credentials.apiId;
}

ApiCredentials Manager::apiCredentials() const {
	return _credentials;
}

Error Manager::setApiCredentials(ApiCredentials credentials) {
	if (!_started || _readOnly) {
		return { u"BOT_STORE_UNAVAILABLE"_q };
	} else if (const auto error = ValidateCredentials(credentials)) {
		return error;
	} else if (busy()) {
		return { u"BOT_MANAGER_BUSY"_q };
	} else if (credentials == _credentials) {
		return {};
	}
	for (auto &[id, client] : _clients) {
		client->stop();
		auto record = client->record();
		auto old = std::move(client);
		record.keys.clear();
		record.info.state = State::Disconnected;
		record.info.error = {};
		client = std::make_unique<Client>(this, std::move(record));
		retire(std::move(old));
	}
	_credentials = std::move(credentials);
	_configurationError = {};
	++_generation;
	const auto saved = save();
	changed();
	return saved ? Error() : _storageError;
}

BotId Manager::addBot(QString token, MTP::Environment environment) {
	if (!_started || _readOnly || token.trimmed().isEmpty()) {
		return 0;
	}
	for (const auto &[id, client] : _clients) {
		const auto &record = client->record();
		if (record.token == token.trimmed() && record.environment == environment) {
			return id;
		}
	}
	auto record = Record();
	record.info.id = _nextBot++;
	record.info.state = _credentials.apiId ? State::Disconnected : State::Unconfigured;
	record.token = token.trimmed();
	record.environment = environment;
	const auto id = record.info.id;
	_clients.emplace(id, std::make_unique<Client>(this, std::move(record)));
	if (!save()) {
		_clients.erase(id);
		return 0;
	}
	changed();
	return id;
}

OperationId Manager::addAuthenticatedBot(
		QString token,
		Completion done,
		MTP::Environment environment) {
	const auto fail = [&](Error error) {
		auto operation = makeOperation(0, std::move(done));
		operation->result.state = OperationState::Failed;
		operation->result.error = std::move(error);
		crl::on_main(this, [=] {
			publish(operation->result);
			if (operation->done) {
				operation->done(operation->result);
			}
		});
		return operation->result.operation;
	};
	if (!_started || _readOnly || _storageError) {
		return fail(_storageError
			? _storageError
			: Error{ u"BOT_STORE_UNAVAILABLE"_q });
	} else if (const auto error = ValidateCredentials(_credentials)) {
		return fail(error);
	}
	token = token.trimmed();
	if (token.isEmpty()) {
		return fail({ u"BOT_TOKEN_INVALID"_q });
	}
	for (const auto *clients : { &_clients, &_pending }) {
		for (const auto &[id, client] : *clients) {
			const auto &record = client->record();
			if (record.token == token && record.environment == environment) {
				return fail({ u"BOT_ALREADY_ADDED"_q });
			}
		}
	}
	auto record = Record();
	record.info.id = _nextBot++;
	record.info.state = State::Disconnected;
	record.token = std::move(token);
	record.environment = environment;
	const auto id = record.info.id;
	_pending.emplace(id, std::make_unique<Client>(this, std::move(record)));
	return authenticate(id, [=, done = std::move(done)](const Result &result) {
		auto final = result;
		const auto i = _pending.find(id);
		if (i == _pending.end()) {
			return;
		}
		auto client = std::move(i->second);
		_pending.erase(i);
		if (result.state == OperationState::Completed) {
			const auto duplicate = ranges::any_of(_clients, [&](const auto &entry) {
				return entry.second->info().userId == client->info().userId
					&& entry.second->record().environment
						== client->record().environment;
			});
			if (duplicate) {
				retire(std::move(client));
				final.state = OperationState::Failed;
				final.error = { u"BOT_ALREADY_ADDED"_q };
			} else {
				_clients.emplace(id, std::move(client));
			}
			if (!duplicate && !save()) {
				client = std::move(_clients.at(id));
				_clients.erase(id);
				retire(std::move(client));
				final.state = OperationState::Failed;
				final.error = _storageError;
				const auto restored = save();
				if (!restored) {
					_storageError = final.error;
				}
			} else if (!duplicate) {
				changed();
			}
		} else {
			client->stop();
		}
		if (done) {
			done(final);
		}
	});
}

Error Manager::removeBot(BotId bot) {
	if (_readOnly) {
		return _storageError;
	}
	const auto i = _clients.find(bot);
	if (i == _clients.end()) {
		return { u"BOT_NOT_FOUND"_q };
	}
	auto old = std::move(i->second);
	_clients.erase(i);
	old->stop();
	retire(std::move(old));
	const auto saved = save();
	changed();
	return saved ? Error() : _storageError;
}

void Manager::retire(std::unique_ptr<Client> client) {
	client->logout();
	const auto raw = client.get();
	_retired.push_back(std::move(client));
	base::call_delayed(30000, this, [=] {
		std::erase_if(_retired, [=](const auto &item) { return item.get() == raw; });
	});
}

std::vector<BotInfo> Manager::bots() const {
	auto result = std::vector<BotInfo>();
	for (const auto &[id, client] : _clients) {
		result.push_back(client->info());
	}
	return result;
}

rpl::producer<> Manager::changes() const { return _changes.events(); }
rpl::producer<Result> Manager::results() const { return _results.events(); }

std::shared_ptr<const ResourceContext> Manager::resources(BotId bot) {
	const auto found = client(bot);
	return found ? found->resources() : nullptr;
}

Client *Manager::client(BotId id) {
	const auto i = _clients.find(id);
	if (i != _clients.end()) {
		return i->second.get();
	}
	const auto pending = _pending.find(id);
	return pending == _pending.end() ? nullptr : pending->second.get();
}

OperationId Manager::nextOperation() { return _nextOperation++; }

std::shared_ptr<Operation> Manager::makeOperation(
		BotId bot,
		Completion done,
		UploadCallback progress) {
	auto op = std::make_shared<Operation>();
	op->result.operation = nextOperation();
	op->result.bot = bot;
	op->done = std::move(done);
	op->progress = std::move(progress);
	return op;
}

OperationId Manager::submit(std::shared_ptr<Operation> op) {
	const auto found = client(op->result.bot);
	if (!found || _readOnly || !_started || _configurationError) {
		op->result.state = OperationState::Failed;
		op->result.error = _readOnly
			? _storageError
			: _configurationError
			? _configurationError
			: Error{ u"BOT_NOT_AVAILABLE"_q };
		crl::on_main(this, [=] {
			publish(op->result);
			if (op->done) {
				op->done(op->result);
			}
		});
	} else {
		found->enqueue(op);
	}
	return op->result.operation;
}

OperationId Manager::reject(BotId bot, Error error, Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->validation = std::move(error);
	return submit(std::move(op));
}

OperationId Manager::authenticate(BotId bot, Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->kind = Kind::Authenticate;
	return submit(std::move(op));
}

OperationId Manager::replaceBotToken(BotId bot, QString token, Completion done) {
	const auto found = client(bot);
	if (!found || found->busy() || token.trimmed().isEmpty()) {
		return reject(bot, { u"BOT_BUSY_OR_INVALID_TOKEN"_q }, std::move(done));
	}
	auto op = makeOperation(bot, std::move(done));
	op->kind = Kind::ReplaceToken;
	op->token = token.trimmed();
	return submit(std::move(op));
}

OperationId Manager::setTyping(
		BotId bot,
		PeerId peer,
		MsgId topMsgId,
		MTPsendMessageAction action,
		Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->kind = Kind::Typing;
	op->action.peer = peer;
	op->topMsgId = topMsgId;
	op->typingAction = std::move(action);
	return submit(std::move(op));
}

OperationId Manager::toggleReaction(
		BotId bot,
		FullMsgId message,
		Data::ReactionId reaction,
		bool remove,
		bool addToRecent,
		Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->kind = Kind::Reaction;
	op->action.peer = message.peer;
	op->targets = { message };
	op->reaction = std::move(reaction);
	op->reactionRemove = remove;
	op->reactionAddToRecent = addToRecent;
	if (op->reaction.empty() || op->reaction.paid() || op->reaction.custom()) {
		op->validation = { u"UNSUPPORTED_REACTION"_q };
	}
	return submit(std::move(op));
}

OperationId Manager::sendText(
		BotId bot, const Api::MessageToSend &message, Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->validation = SnapshotAction(message.action, op->action);
	op->text = SnapshotText(message.textWithTags);
	op->webPage = message.webPage;
	return submit(std::move(op));
}

OperationId Manager::sendMedia(
		BotId bot,
		const Api::MessageToSend &message,
		const std::shared_ptr<FilePrepareResult> &file,
		Completion done,
		UploadCallback progress) {
	auto op = makeOperation(bot, std::move(done), std::move(progress));
	op->kind = Kind::Media;
	op->validation = SnapshotAction(message.action, op->action);
	op->media.emplace_back();
	const auto error = file
		? SnapshotMedia(*file, op->media.back())
		: Error{ u"MEDIA_SOURCE_MISSING"_q };
	if (!op->validation) {
		op->validation = error;
	}
	op->media.back().caption = SnapshotText(message.textWithTags);
	return submit(std::move(op));
}

OperationId Manager::uploadMedia(
		BotId bot,
		PeerId peer,
		const std::shared_ptr<FilePrepareResult> &file,
		Completion done,
		UploadCallback progress) {
	auto op = makeOperation(bot, std::move(done), std::move(progress));
	op->kind = Kind::Upload;
	op->action.peer = peer;
	op->media.emplace_back();
	op->validation = file
		? SnapshotMedia(*file, op->media.back())
		: Error{ u"MEDIA_SOURCE_MISSING"_q };
	return submit(std::move(op));
}

OperationId Manager::sendAlbum(
		BotId bot,
		const Api::SendAction &action,
		const std::vector<std::shared_ptr<FilePrepareResult>> &files,
		Completion done,
		UploadCallback progress) {
	auto op = makeOperation(bot, std::move(done), std::move(progress));
	op->kind = Kind::Album;
	op->validation = SnapshotAction(action, op->action);
	if (files.empty() || files.size() > 10) {
		op->validation = { u"ALBUM_SIZE_INVALID"_q };
	}
	for (const auto &file : files) {
		op->media.emplace_back();
		const auto error = file
			? SnapshotMedia(*file, op->media.back())
			: Error{ u"MEDIA_SOURCE_MISSING"_q };
		if (!op->validation) {
			op->validation = error;
		}
	}
	return submit(std::move(op));
}

OperationId Manager::sendRichMessage(
		BotId bot,
		std::shared_ptr<const Iv::RichPage> page,
		const Api::SendAction &action,
		Completion done,
		const std::vector<RichMediaSource> &sources,
		UploadCallback progress) {
	auto op = makeOperation(bot, std::move(done), std::move(progress));
	op->kind = Kind::Rich;
	op->validation = SnapshotAction(action, op->action);
	if (!op->validation) {
		op->validation = page
			? SnapshotRich(*page, sources, *op)
			: Error{ u"RICH_MESSAGE_EMPTY"_q };
	}
	return submit(std::move(op));
}

OperationId Manager::sendRichMessage(
		BotId bot,
		const MTPInputRichMessage &message,
		const Api::SendAction &action,
		std::shared_ptr<const ResourceContext> resources,
		Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->kind = Kind::Rich;
	op->validation = SnapshotAction(action, op->action);
	op->rich = message;
	op->resources = std::move(resources);
	return submit(std::move(op));
}

OperationId Manager::editMessage(
		BotId bot,
		const Edit &edit,
		Completion done,
		UploadCallback progress) {
	auto op = makeOperation(bot, std::move(done), std::move(progress));
	op->kind = Kind::Edit;
	op->action.peer = edit.message.peer;
	op->action.options = edit.options;
	op->targets = { edit.message };
	op->text = edit.text;
	op->webPage = edit.webPage;
	if (edit.media) {
		op->media.emplace_back();
		op->validation = SnapshotMedia(*edit.media, op->media.back());
	} else if (edit.inputMedia) {
		op->prepared.push_back(*edit.inputMedia);
	}
	return submit(std::move(op));
}

OperationId Manager::editRichMessage(
		BotId bot,
		FullMsgId message,
		std::shared_ptr<const Iv::RichPage> page,
		Api::SendOptions options,
		Completion done,
		const std::vector<RichMediaSource> &sources,
		UploadCallback progress) {
	auto op = makeOperation(bot, std::move(done), std::move(progress));
	op->kind = Kind::EditRich;
	op->action.peer = message.peer;
	op->action.options = options;
	op->targets = { message };
	op->validation = page
		? SnapshotRich(*page, sources, *op)
		: Error{ u"RICH_MESSAGE_EMPTY"_q };
	for (auto &source : op->media) {
		if (!source.origin) {
			source.origin = message;
		}
	}
	return submit(std::move(op));
}

OperationId Manager::editRichMessage(
		BotId bot,
		FullMsgId message,
		const MTPInputRichMessage &content,
		std::shared_ptr<const ResourceContext> resources,
		Api::SendOptions options,
		Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->kind = Kind::EditRich;
	op->action.peer = message.peer;
	op->action.options = options;
	op->targets = { message };
	op->rich = content;
	op->resources = std::move(resources);
	return submit(std::move(op));
}

OperationId Manager::deleteMessages(
		BotId bot, std::vector<FullMsgId> messages, Completion done) {
	auto op = makeOperation(bot, std::move(done));
	op->kind = Kind::Delete;
	op->action.peer = messages.empty() ? PeerId() : messages.front().peer;
	op->targets = std::move(messages);
	return submit(std::move(op));
}

void Manager::cancel(OperationId operation) {
	for (const auto &[id, client] : _clients) {
		client->cancel(operation);
	}
	for (const auto &[id, client] : _pending) {
		client->cancel(operation);
	}
}

bool Manager::save() {
	if (!_started || _readOnly) {
		return false;
	}
	auto data = QByteArray();
	auto stream = QDataStream(&data, QIODevice::WriteOnly);
	stream.setVersion(QDataStream::Qt_5_1);
	stream << kStoreVersion << _credentials.apiId << _credentials.apiHash
		<< _generation << _nextBot << quint32(_clients.size());
	for (const auto &[id, client] : _clients) {
		const auto &record = client->record();
		stream << id << quint64(record.info.userId.bare)
			<< record.info.name << record.info.username << record.token
			<< quint8(record.environment) << record.mainDcId
			<< quint32(record.keys.size());
		for (const auto &key : record.keys) {
			const auto bytes = key->data();
			stream << qint32(key->dcId()) << QByteArray(
				reinterpret_cast<const char*>(bytes.data()), bytes.size());
		}
		stream << quint32(record.sent.size());
		for (const auto &message : record.sent) {
			stream << quint64(message.peer.value) << qint64(message.msg.bare);
		}
	}
	if (data.size() > kMaximumStoreSize || !_storage->writeBotUseData(data)) {
		_storageError = { u"BOT_STORE_WRITE_FAILED"_q };
		return false;
	}
	_storageError = {};
	return true;
}

void Manager::changed() {
	crl::on_main(this, [=] { _changes.fire({}); });
}

void Manager::publish(const Result &result) {
	crl::on_main(this, [=] { _results.fire_copy(result); });
}

Error Manager::identify(BotId bot, UserId user) {
	const auto found = client(bot);
	if (!found) {
		return { u"BOT_NOT_FOUND"_q };
	}
	for (const auto &[id, item] : _clients) {
		if (id != bot && item->info().userId == user
			&& item->record().environment == found->record().environment) {
			return { u"BOT_ALREADY_ADDED"_q };
		}
	}
	for (const auto &[id, item] : _pending) {
		if (id != bot && item->info().userId == user
			&& item->record().environment == found->record().environment) {
			return { u"BOT_ALREADY_ADDED"_q };
		}
	}
	return {};
}

void Manager::configurationFailed(Error error) {
	_configurationError = std::move(error);
	changed();
}

} // namespace BotUse
