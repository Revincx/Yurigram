#include "bot_use/bot_use_client.h"

#include "base/random.h"
#include "bot_use/bot_use_manager.h"
#include "bot_use/bot_use_uploader.h"
#include "mtproto/mtproto_config.h"
#include "ui/text/text_utilities.h"

namespace BotUse {
namespace {

constexpr auto kIdleTimeout = crl::time(5 * 60 * 1000);

[[nodiscard]] bool Editing(Kind kind) {
	return kind == Kind::Edit || kind == Kind::EditRich;
}

[[nodiscard]] MTPInputMedia PhotoMedia(const MTPInputPhoto &photo, bool spoiler) {
	using Flag = MTPDinputMediaPhoto::Flag;
	return MTP_inputMediaPhoto(
		MTP_flags(spoiler ? Flag::f_spoiler : Flag()),
		photo, MTPint(), MTPInputDocument());
}

[[nodiscard]] MTPInputMedia DocumentMedia(
		const MTPInputDocument &document,
		bool spoiler) {
	using Flag = MTPDinputMediaDocument::Flag;
	return MTP_inputMediaDocument(
		MTP_flags(spoiler ? Flag::f_spoiler : Flag()),
		document, MTPInputPhoto(), MTPint(), MTPint(), MTPstring());
}

} // namespace

Client::Client(not_null<Manager*> manager, Record record)
: _manager(manager)
, _record(std::move(record))
, _resourceGeneration(base::RandomValue<uint64>())
, _idleTimer([=] { idle(); }) {
	_record.info.environment = _record.environment;
}

Client::~Client() {
	_connectionLifetime.destroy();
	_uploader.reset();
	_sender.reset();
	_instance.reset();
}

const Record &Client::record() const { return _rollback ? *_rollback : _record; }
const BotInfo &Client::info() const { return _record.info; }
bool Client::busy() const { return _active || !_queue.empty(); }

std::shared_ptr<const ResourceContext> Client::resources() const {
	auto result = std::make_shared<ResourceContext>();
	result->_bot = _record.info.id;
	result->_generation = _resourceGeneration;
	result->_photos = _photos;
	result->_documents = _documents;
	return result;
}

bool Client::active(const Op &operation) const {
	return _active == operation && !operation->finishing;
}

void Client::enqueue(Op operation) {
	_queue.push_back(std::move(operation));
	_idleTimer.cancel();
	crl::on_main(this, [=] { pump(); });
}

void Client::cancel(OperationId id) {
	if (_active && _active->result.operation == id) {
		finish(_active, _active->submitted
			? OperationState::Unconfirmed
			: OperationState::Cancelled,
			{ u"OPERATION_CANCELLED"_q });
		return;
	}
	for (auto i = _queue.begin(); i != _queue.end(); ++i) {
		if ((*i)->result.operation == id) {
			const auto operation = *i;
			_queue.erase(i);
			operation->result.state = OperationState::Cancelled;
			operation->result.error = { u"OPERATION_CANCELLED"_q };
			notify(operation);
			return;
		}
	}
}

void Client::stop() {
	while (!_queue.empty()) {
		cancel(_queue.front()->result.operation);
	}
	if (_active) {
		cancel(_active->result.operation);
	}
	saveKeys();
	_connectionLifetime.destroy();
	_uploader.reset();
	_sender.reset();
	_instance.reset();
	_ready = false;
	_idleTimer.cancel();
}

void Client::idle() {
	if (!busy()) {
		stop();
		_record.info.state = State::Disconnected;
		_manager->changed();
	}
}

void Client::resetAuthorization() {
	stop();
	_record.keys.clear();
	_record.info.state = State::Disconnected;
	_photos.clear();
	_documents.clear();
	_photoOrigins.clear();
	_documentOrigins.clear();
	_peers.clear();
	_audio.clear();
	_resourceGeneration = base::RandomValue<uint64>();
}

void Client::connect() {
	if (_instance) {
		return;
	}
	auto fields = MTP::Instance::Fields();
	fields.config = std::make_unique<MTP::Config>(_record.environment);
	fields.mainDcId = _record.mainDcId;
	fields.keys = _record.keys;
	fields.apiId = _manager->_credentials.apiId;
	fields.clientProfile = MTP::Instance::ClientProfile::BotUse;
	fields.deviceModel = u"BotUse"_q;
	fields.systemVersion = u"Desktop"_q;
	_instance = std::make_unique<MTP::Instance>(MTP::Instance::Mode::Normal, std::move(fields));
	_sender = std::make_unique<MTP::Sender>(_instance.get());
	_uploader = std::make_unique<Uploader>(this);
	_instance->writeKeysRequests() | rpl::on_next([=] {
		saveKeys();
	}, _connectionLifetime);
	_instance->mainDcIdValue() | rpl::on_next([=](MTP::DcId dc) {
		_record.mainDcId = dc;
	}, _connectionLifetime);
}

void Client::logout() {
	if (_record.keys.empty() || !_manager->_credentials.apiId) {
		return;
	}
	connect();
	_instance->logout([=] {
		crl::on_main(this, [=] {
			stop();
			_record.keys.clear();
		});
	});
}

void Client::saveKeys() {
	if (_instance) {
		_record.keys = _instance->getKeysForWrite();
		_record.mainDcId = _instance->mainDcId();
		if (!_manager->save()) {
			_manager->changed();
		}
	}
}

void Client::pump() {
	if (_active || _queue.empty()) {
		return;
	}
	_active = _queue.front();
	_queue.pop_front();
	const auto operation = _active;
	operation->result.peer = operation->action.peer;
	if (operation->validation) {
		finish(operation, OperationState::Failed, operation->validation);
		return;
	} else if (!_manager->_credentials.apiId || _manager->_configurationError) {
		finish(operation, OperationState::Failed, { u"API_CREDENTIALS_REQUIRED"_q });
		return;
	}
	if (operation->kind == Kind::ReplaceToken) {
		saveKeys();
		_rollback = _record;
		_connectionLifetime.destroy();
		_uploader.reset();
		_sender.reset();
		_instance.reset();
		_record.keys.clear();
		_record.token = operation->token;
		_ready = false;
	}
	operation->result.state = OperationState::Running;
	notify(operation);
	connect();
	authenticate(operation, [=] { begin(operation); });
}

void Client::authenticate(const Op &operation, Fn<void()> done, bool force) {
	if (_ready && !force) {
		done();
		return;
	}
	_record.info.state = State::Authenticating;
	_manager->changed();
	if (!force && _record.info.userId && !_record.keys.empty()) {
		rpc(operation, MTPusers_GetUsers(MTP_vector<MTPInputUser>(1, MTP_inputUserSelf())),
			Fn<void(const MTPVector<MTPUser> &)>([=](const MTPVector<MTPUser> &users) {
				if (users.v.size() != 1) {
					finish(operation, OperationState::Failed, { u"BOT_IDENTITY_INVALID"_q });
				} else {
					authorized(operation, users.v.front(), done);
				}
			}));
		return;
	}
	rpc(operation, MTPauth_ImportBotAuthorization(
		MTP_int(0),
		MTP_int(_manager->_credentials.apiId),
		MTP_string(_manager->_credentials.apiHash),
		MTP_string(_record.token)),
		Fn<void(const MTPauth_Authorization &)>([=](const MTPauth_Authorization &result) {
			if (result.type() != mtpc_auth_authorization) {
				finish(operation, OperationState::Failed, { u"BOT_AUTHORIZATION_INVALID"_q });
				return;
			}
			authorized(operation, result.c_auth_authorization().vuser(), done);
		}), 0, false);
}

void Client::authorized(const Op &operation, const MTPUser &user, Fn<void()> done) {
	if (user.type() != mtpc_user || !user.c_user().is_bot()
		|| !user.c_user().is_self()) {
		finish(operation, OperationState::Failed, { u"BOT_IDENTITY_INVALID"_q });
		return;
	}
	const auto &data = user.c_user();
	const auto id = UserId(data.vid().v);
	if (_record.info.userId && _record.info.userId != id) {
		finish(operation, OperationState::Failed, { u"BOT_IDENTITY_MISMATCH"_q });
		return;
	} else if (const auto error = _manager->identify(_record.info.id, id)) {
		finish(operation, OperationState::Failed, error);
		return;
	}
	_record.info.userId = id;
	_record.info.name = qs(data.vfirst_name().value_or_empty());
	_record.info.username = qs(data.vusername().value_or_empty());
	_record.info.state = State::Ready;
	_record.info.error = {};
	_ready = true;
	saveKeys();
	_manager->changed();
	done();
}

void Client::begin(const Op &operation) {
	if (operation->kind == Kind::Authenticate || operation->kind == Kind::ReplaceToken) {
		finish(operation);
		return;
	} else if (const auto error = ValidateTarget(operation->action.peer)) {
		finish(operation, OperationState::Failed, error);
		return;
	} else if (const auto error = ValidateOptions(operation->action.options)) {
		finish(operation, OperationState::Failed, error);
		return;
	}
	if (operation->kind == Kind::Delete || Editing(operation->kind)) {
		if (operation->targets.empty()) {
			finish(operation, OperationState::Failed, { u"MESSAGE_IDS_EMPTY"_q });
			return;
		}
		for (const auto &target : operation->targets) {
			if (target.peer != operation->action.peer || !IsServerMsgId(target.msg)
				|| target.msg.bare > std::numeric_limits<int>::max()) {
				finish(operation, OperationState::Failed, { u"MESSAGE_ID_INVALID"_q });
				return;
			}
		}
	}
	checkPeer(operation);
}

void Client::checkPeer(const Op &operation) {
	rpc(operation, MTPchannels_GetChannels(
		MTP_vector<MTPInputChannel>(1, channel(operation->action.peer))),
		Fn<void(const MTPmessages_Chats &)>([=](const MTPmessages_Chats &result) {
			auto found = false;
			result.match([&](const auto &data) {
				for (const auto &chat : data.vchats().v) {
					if (chat.type() != mtpc_channel) {
						continue;
					}
					const auto &channel = chat.c_channel();
					if (peerFromChannel(ChannelId(channel.vid().v)) != operation->action.peer
						|| channel.is_monoforum()) {
						continue;
					}
					found = true;
					operation->channel = channel.is_broadcast();
					if (!channel.is_min()) {
						_peers[operation->action.peer] = channel.vaccess_hash().value_or_empty();
					}
				}
			});
			if (!found) {
				finish(operation, OperationState::Failed, { u"CHANNEL_UNAVAILABLE"_q });
			} else if (operation->kind == Kind::Typing && operation->channel) {
				finish(operation, OperationState::Failed, { u"UNSUPPORTED_PEER"_q });
			} else if (operation->kind == Kind::Delete
				|| (Editing(operation->kind) && !operation->channel)) {
				checkOwnership(operation, [=] { prepare(operation); });
			} else {
				prepare(operation);
			}
		}));
}

void Client::checkOwnership(const Op &operation, Fn<void()> done) {
	auto unknown = QVector<MTPInputMessage>();
	for (const auto &id : operation->targets) {
		if (!_record.sent.contains(id)) {
			unknown.push_back(MTP_inputMessageID(MTP_int(id.msg.bare)));
			if (unknown.size() == 100) {
				break;
			}
		}
	}
	if (unknown.isEmpty()) {
		done();
		return;
	}
	rpc(operation, MTPchannels_GetMessages(
		channel(operation->action.peer), MTP_vector<MTPInputMessage>(unknown)),
		Fn<void(const MTPmessages_Messages &)>([=](const MTPmessages_Messages &result) {
			for (const auto &message : messages(result)) {
				ingest(message);
			}
			for (const auto &id : unknown) {
				const auto full = FullMsgId(operation->action.peer,
					MsgId(id.c_inputMessageID().vid().v));
				if (!_record.sent.contains(full)) {
					finish(operation, OperationState::Failed, { u"OWNERSHIP_UNKNOWN"_q });
					return;
				}
			}
			checkOwnership(operation, done);
		}));
}

MTPInputPeer Client::peer(PeerId id) const {
	const auto i = _peers.find(id);
	return MTP_inputPeerChannel(MTP_long(peerToChannel(id).bare),
		MTP_long(i == _peers.end() ? 0 : i->second));
}

MTPInputChannel Client::channel(PeerId id) const {
	const auto i = _peers.find(id);
	return MTP_inputChannel(MTP_long(peerToChannel(id).bare),
		MTP_long(i == _peers.end() ? 0 : i->second));
}

void Client::prepare(const Op &operation) {
	if (operation->kind == Kind::Typing) {
		send(operation);
		return;
	}
	if (operation->randomIds.empty()) {
		const auto count = operation->kind == Kind::Album ? operation->media.size() : size_t(1);
		for (auto i = size_t(); i != count; ++i) {
			operation->randomIds.push_back(base::RandomValue<uint64>());
		}
	}
	if (operation->media.empty()) {
		send(operation);
	} else {
		operation->prepared.clear();
		prepareMedia(operation);
	}
}

void Client::prepareMedia(const Op &operation, size_t index) {
	if (index == operation->media.size()) {
		send(operation);
		return;
	}
	resolveMedia(operation, index, [=] { prepareMedia(operation, index + 1); });
}

void Client::resolveMedia(const Op &operation, size_t index, Fn<void()> done) {
	const auto source = operation->media[index];
	if (source.uploadedPhoto || source.uploadedDocument) {
		if (source.uploadedPhoto) {
			_photos[source.id] = *source.uploadedPhoto;
		} else {
			_documents[source.id] = *source.uploadedDocument;
			if (source.audio) {
				_audio.emplace(source.id);
			}
		}
		operation->prepared.push_back(source.photo
			? PhotoMedia(_photos.at(source.id), source.spoiler)
			: DocumentMedia(_documents.at(source.id), source.spoiler));
		done();
		return;
	}
	const auto append = [=] {
		if (source.photo) {
			const auto i = _photos.find(source.id);
			if (i != _photos.end()) {
				operation->prepared.push_back(PhotoMedia(i->second, source.spoiler));
				return true;
			}
		} else {
			const auto i = _documents.find(source.id);
			if (i != _documents.end()) {
				operation->prepared.push_back(DocumentMedia(i->second, source.spoiler));
				return true;
			}
		}
		return false;
	};
	if (operation->page && append()) {
		done();
		return;
	}
	const auto upload = [=] {
		if (source.bytes.isEmpty() && source.location.isEmpty()) {
			finish(operation, OperationState::Failed, { u"MEDIA_SOURCE_MISSING"_q });
			return;
		}
		_uploader->upload(operation, source, [=](MTPInputMedia uploaded) {
			rpc(operation, MTPmessages_UploadMedia(
				MTP_flags(0), MTPstring(), peer(operation->action.peer), uploaded),
				Fn<void(const MTPMessageMedia &)>([=](const MTPMessageMedia &media) {
					if (operation->kind == Kind::Upload) {
						operation->result.media = media;
					}
					ingest(media);
					auto valid = false;
					if (source.photo && media.type() == mtpc_messageMediaPhoto) {
						const auto photo = media.c_messageMediaPhoto().vphoto();
						if (photo && photo->type() == mtpc_photo) {
							_photos[source.id] = _photos.at(photo->c_photo().vid().v);
							valid = true;
						}
					} else if (!source.photo && media.type() == mtpc_messageMediaDocument) {
						const auto document = media.c_messageMediaDocument().vdocument();
						if (document && document->type() == mtpc_document) {
							_documents[source.id] = _documents.at(document->c_document().vid().v);
							if (source.audio) { _audio.emplace(source.id); }
							valid = true;
						}
					}
					if (!valid || !append()) {
						finish(operation, OperationState::Failed, { u"MEDIA_UPLOAD_INVALID"_q });
					} else {
						done();
					}
				}));
		});
	};
	if (source.origin && !ValidateTarget(source.origin.peer)) {
		rpc(operation, MTPmessages_GetRichMessage(peer(source.origin.peer), MTP_int(source.origin.msg.bare)),
			Fn<void(const MTPmessages_Messages &)>([=](const MTPmessages_Messages &result) {
				ingest(result);
				if (append()) { done(); } else { upload(); }
			}));
	} else {
		upload();
	}
}

Iv::RichMessageResources Client::richResources() const {
	return {
		.photo = [=](uint64 id) -> std::optional<MTPInputPhoto> {
			const auto i = _photos.find(id);
			return i == _photos.end() ? std::nullopt : std::make_optional(i->second);
		},
		.document = [=](uint64 id) -> std::optional<MTPInputDocument> {
			const auto i = _documents.find(id);
			return i == _documents.end() ? std::nullopt : std::make_optional(i->second);
		},
		.user = [=](uint64 id) -> std::optional<MTPInputUser> {
			return id == _record.info.userId.bare
				? MTPInputUser(MTP_inputUserSelf())
				: MTPInputUser(MTP_inputUser(MTP_long(id), MTP_long(0)));
		},
		.mentionUser = [](const QString &data) -> std::optional<uint64> {
			const auto id = TextUtilities::MentionNameDataToFields(data).userId;
			return id ? std::make_optional(id) : std::nullopt;
		},
		.documentIsAudio = [=](uint64 id) { return _audio.contains(id); },
	};
}

Error Client::prepareRich(const Op &operation) {
	if (!operation->page) {
		return validateNativeRich(operation);
	}
	if (Iv::ValidateRichMessage(*operation->page, _richLimits)) {
		return { u"RICH_MESSAGE_LIMIT"_q };
	}
	for (const auto &source : operation->media) {
		if (source.photo ? !_photos.contains(source.id) : !_documents.contains(source.id)) {
			return { u"RICH_MEDIA_UNAVAILABLE"_q };
		}
	}
	const auto serialized = Iv::SerializeInputRichMessage(
		richResources(), *operation->page, Iv::SerializeInputRichMessageMode::FinalSubmit);
	if (serialized.status != Iv::SerializeInputRichMessageStatus::Success || !serialized.value) {
		return { serialized.status == Iv::SerializeInputRichMessageStatus::EmptyContent
			? u"RICH_MESSAGE_EMPTY"_q : u"RICH_MESSAGE_INVALID"_q };
	}
	operation->rich = *serialized.value;
	return {};
}

Error Client::validateNativeRich(const Op &operation) {
	if (!operation->rich) { return { u"RICH_MESSAGE_EMPTY"_q }; }
	const auto context = operation->resources;
	if (context && (context->_bot != _record.info.id || context->_generation != _resourceGeneration)) {
		return { u"RESOURCE_OWNER_MISMATCH"_q };
	}
	auto valid = true;
	const auto photo = [&](const MTPInputPhoto &input) {
		if (!context || input.type() != mtpc_inputPhoto) { valid = false; return; }
		const auto &data = input.c_inputPhoto();
		const auto i = context->_photos.find(data.vid().v);
		valid &= i != context->_photos.end()
			&& i->second.c_inputPhoto().vaccess_hash().v == data.vaccess_hash().v
			&& i->second.c_inputPhoto().vfile_reference().v == data.vfile_reference().v;
	};
	const auto document = [&](const MTPInputDocument &input) {
		if (!context || input.type() != mtpc_inputDocument) { valid = false; return; }
		const auto &data = input.c_inputDocument();
		const auto i = context->_documents.find(data.vid().v);
		valid &= i != context->_documents.end()
			&& i->second.c_inputDocument().vaccess_hash().v == data.vaccess_hash().v
			&& i->second.c_inputDocument().vfile_reference().v == data.vfile_reference().v;
	};
	operation->rich->match([&](const MTPDinputRichMessage &data) {
		for (const auto &item : data.vphotos().value_or_empty()) { photo(item); }
		for (const auto &item : data.vdocuments().value_or_empty()) { document(item); }
		for (const auto &item : data.vusers().value_or_empty()) {
			valid &= item.type() == mtpc_inputUserSelf
				|| (item.type() == mtpc_inputUser && !item.c_inputUser().vaccess_hash().v);
		}
	}, [&](const auto &data) {
		for (const auto &item : data.vfiles().value_or_empty()) {
			item.match([&](const MTPDinputRichFilePhoto &file) { photo(file.vphoto()); },
				[&](const MTPDinputRichFileDocument &file) { document(file.vdocument()); });
		}
	});
	return valid ? Error() : Error{ u"RESOURCE_OWNER_MISMATCH"_q };
}

void Client::send(const Op &operation) {
	if (operation->kind == Kind::Typing) {
		setTyping(operation);
		return;
	} else if (operation->kind == Kind::Upload) {
		finish(operation);
		return;
	}
	if (operation->kind == Kind::Rich || operation->kind == Kind::EditRich) {
		if (const auto error = prepareRich(operation)) {
			finish(operation, OperationState::Failed, error);
			return;
		}
	}
	if (operation->kind == Kind::Delete) {
		remove(operation);
	} else if (Editing(operation->kind)) {
		edit(operation);
	} else if (operation->kind == Kind::Media || operation->kind == Kind::Album
		|| (operation->webPage && !operation->webPage->removed && !operation->webPage->url.isEmpty())) {
		sendMedia(operation);
	} else {
		sendText(operation);
	}
}

void Client::setTyping(const Op &operation) {
	using Flag = MTPmessages_SetTyping::Flag;
	const auto topMsgId = operation->topMsgId;
	rpc(operation, MTPmessages_SetTyping(
		MTP_flags(topMsgId ? Flag::f_top_msg_id : Flag()),
		peer(operation->action.peer),
		MTP_int(topMsgId.bare),
		operation->typingAction),
		Fn<void(const MTPBool &)>([=](const MTPBool &) {
			finish(operation);
		}));
}

void Client::sendText(const Op &operation) {
	using Flag = MTPmessages_SendMessage::Flag;
	const auto &action = operation->action;
	const auto text = operation->text.value_or(TextWithEntities());
	const auto entities = EntitiesToMTP(text.entities, _record.info.userId);
	const auto flags = (operation->rich ? Flag::f_rich_message : Flag())
		| (action.options.silent ? Flag::f_silent : Flag())
		| ((action.reply || action.reply.topicRootId) ? Flag::f_reply_to : Flag())
		| (!entities.v.isEmpty() ? Flag::f_entities : Flag())
		| (operation->webPage && operation->webPage->removed ? Flag::f_no_webpage : Flag())
		| (operation->webPage && operation->webPage->invert ? Flag::f_invert_media : Flag());
	operation->submitted = true;
	rpc(operation, MTPmessages_SendMessage(
		MTP_flags(flags), peer(action.peer), ReplyToMTP(action, _record.info.userId),
		MTP_string(text.text), MTP_long(operation->randomIds.front()), MTPReplyMarkup(), entities,
		MTPint(), MTPint(), MTPInputPeer(), MTPInputQuickReplyShortcut(), MTPlong(), MTPlong(),
		MTPSuggestedPost(), operation->rich.value_or(MTPInputRichMessage())),
		Fn<void(const MTPUpdates &)>([=](const MTPUpdates &result) { received(operation, result); }));
}

void Client::sendMedia(const Op &operation) {
	const auto &action = operation->action;
	const auto reply = bool(action.reply) || bool(action.reply.topicRootId);
	if (operation->kind == Kind::Album) {
		using Flag = MTPmessages_SendMultiMedia::Flag;
		auto media = QVector<MTPInputSingleMedia>();
		for (auto i = size_t(); i != operation->prepared.size(); ++i) {
			const auto &caption = operation->media[i].caption;
			const auto entities = EntitiesToMTP(caption.entities, _record.info.userId);
			using ItemFlag = MTPDinputSingleMedia::Flag;
			media.push_back(MTP_inputSingleMedia(
				MTP_flags(entities.v.isEmpty() ? ItemFlag() : ItemFlag::f_entities),
				operation->prepared[i], MTP_long(operation->randomIds[i]),
				MTP_string(caption.text), entities));
		}
		operation->submitted = true;
		rpc(operation, MTPmessages_SendMultiMedia(
			MTP_flags((action.options.silent ? Flag::f_silent : Flag())
				| (reply ? Flag::f_reply_to : Flag())
				| (action.options.invertCaption ? Flag::f_invert_media : Flag())),
			peer(action.peer), ReplyToMTP(action, _record.info.userId),
			MTP_vector<MTPInputSingleMedia>(media), MTPint(), MTPInputPeer(),
			MTPInputQuickReplyShortcut(), MTPlong(), MTPlong()),
			Fn<void(const MTPUpdates &)>([=](const MTPUpdates &result) { received(operation, result); }));
		return;
	}
	using Flag = MTPmessages_SendMedia::Flag;
	const auto webpage = operation->kind == Kind::Text;
	const auto caption = webpage ? operation->text.value_or(TextWithEntities()) : operation->media.front().caption;
	const auto entities = EntitiesToMTP(caption.entities, _record.info.userId);
	operation->submitted = true;
	rpc(operation, MTPmessages_SendMedia(
		MTP_flags((action.options.silent ? Flag::f_silent : Flag())
			| (reply ? Flag::f_reply_to : Flag())
			| (!entities.v.isEmpty() ? Flag::f_entities : Flag())
			| ((action.options.invertCaption || (operation->webPage && operation->webPage->invert))
				? Flag::f_invert_media : Flag())),
		peer(action.peer), ReplyToMTP(action, _record.info.userId),
		webpage ? WebPageToMTP(*operation->webPage) : operation->prepared.front(),
		MTP_string(caption.text), MTP_long(operation->randomIds.front()), MTPReplyMarkup(), entities,
		MTPint(), MTPint(), MTPInputPeer(), MTPInputQuickReplyShortcut(), MTPlong(), MTPlong(), MTPSuggestedPost()),
		Fn<void(const MTPUpdates &)>([=](const MTPUpdates &result) { received(operation, result); }));
}

void Client::edit(const Op &operation) {
	using Flag = MTPmessages_EditMessage::Flag;
	const auto text = operation->text.value_or(TextWithEntities());
	const auto entities = EntitiesToMTP(text.entities, _record.info.userId);
	const auto web = operation->webPage && !operation->webPage->removed && !operation->webPage->url.isEmpty();
	const auto media = !operation->prepared.empty() || web;
	operation->submitted = true;
	rpc(operation, MTPmessages_EditMessage(
		MTP_flags((operation->text ? Flag::f_message | Flag::f_entities : Flag())
			| (operation->rich ? Flag::f_rich_message : Flag())
			| (media ? Flag::f_media : Flag())
			| (operation->webPage && operation->webPage->removed ? Flag::f_no_webpage : Flag())
			| ((operation->action.options.invertCaption || (operation->webPage && operation->webPage->invert))
				? Flag::f_invert_media : Flag())),
		peer(operation->action.peer), MTP_int(operation->targets.front().msg.bare),
		MTP_string(text.text), web ? WebPageToMTP(*operation->webPage)
			: media ? operation->prepared.front() : MTPInputMedia(),
		MTPReplyMarkup(), entities, MTPint(), MTPint(), MTPint(),
		operation->rich.value_or(MTPInputRichMessage())),
		Fn<void(const MTPUpdates &)>([=](const MTPUpdates &result) { received(operation, result); }));
}

void Client::remove(const Op &operation, size_t offset) {
	if (offset == operation->targets.size()) {
		finish(operation);
		return;
	}
	const auto end = std::min(offset + 100, operation->targets.size());
	auto ids = QVector<MTPint>();
	for (auto i = offset; i != end; ++i) { ids.push_back(MTP_int(operation->targets[i].msg.bare)); }
	operation->submitted = true;
	rpc(operation, MTPchannels_DeleteMessages(channel(operation->action.peer), MTP_vector<MTPint>(ids)),
		Fn<void(const MTPmessages_AffectedMessages &)>([=](const MTPmessages_AffectedMessages &) {
			for (auto i = offset; i != end; ++i) {
				operation->result.messages.push_back(operation->targets[i]);
				_record.sent.erase(operation->targets[i]);
			}
			remove(operation, end);
		}));
}

void Client::received(const Op &operation, const MTPUpdates &updates) {
	operation->result.updates = updates;
	auto ids = std::map<uint64, MsgId>();
	auto data = std::vector<MTPMessage>();
	const auto update = [&](const MTPUpdate &item) {
		item.match([&](const MTPDupdateMessageID &item) {
			ids.emplace(item.vrandom_id().v, MsgId(item.vid().v));
		}, [&](const MTPDupdateNewChannelMessage &item) { data.push_back(item.vmessage()); },
		[&](const MTPDupdateEditChannelMessage &item) { data.push_back(item.vmessage()); },
		[&](const auto &) {});
	};
	updates.match([&](const MTPDupdates &value) {
		for (const auto &item : value.vupdates().v) { update(item); }
	}, [&](const MTPDupdatesCombined &value) {
		for (const auto &item : value.vupdates().v) { update(item); }
	}, [&](const MTPDupdateShort &value) { update(value.vupdate()); },
	[&](const MTPDupdateShortSentMessage &value) {
		ids.emplace(operation->randomIds.front(), MsgId(value.vid().v));
	}, [&](const auto &) {});
	for (const auto &message : data) {
		ingest(message);
		operation->result.data.push_back(message);
	}
	if (Editing(operation->kind)) {
		operation->result.messages = operation->targets;
	} else {
		for (const auto random : operation->randomIds) {
			if (const auto i = ids.find(random); i != ids.end()) {
				const auto full = FullMsgId(operation->action.peer, i->second);
				operation->result.messages.push_back(full);
				_record.sent.emplace(full);
			}
		}
		if (operation->result.messages.size() != operation->randomIds.size()) {
			finish(operation, OperationState::Unconfirmed, { u"MESSAGE_RESULT_INCOMPLETE"_q });
			return;
		}
	}
	if (Editing(operation->kind) || operation->kind == Kind::Delete) {
		finish(operation);
		return;
	}
	auto missing = QVector<MTPInputMessage>();
	for (const auto &id : operation->result.messages) {
		if (!ranges::contains(operation->result.data, id.msg.bare, [](const MTPMessage &message) {
			return message.type() == mtpc_message
				? message.c_message().vid().v : 0;
		})) {
			missing.push_back(MTP_inputMessageID(MTP_int(id.msg.bare)));
		}
	}
	if (missing.isEmpty()) {
		finish(operation);
		return;
	}
	rpc(operation, MTPchannels_GetMessages(
		channel(operation->action.peer),
		MTP_vector<MTPInputMessage>(missing)),
		Fn<void(const MTPmessages_Messages &)>([=](const MTPmessages_Messages &result) {
			for (const auto &message : messages(result)) {
				ingest(message);
				operation->result.data.push_back(message);
			}
			const auto complete = ranges::all_of(operation->result.messages, [&](FullMsgId id) {
				return ranges::contains(operation->result.data, id.msg.bare, [](const MTPMessage &message) {
					return message.type() == mtpc_message
						? message.c_message().vid().v : 0;
				});
			});
			finish(operation,
				complete ? OperationState::Completed : OperationState::Unconfirmed,
				complete ? Error() : Error{ u"MESSAGE_RESULT_INCOMPLETE"_q });
		}));
}

std::vector<MTPMessage> Client::messages(const MTPmessages_Messages &result) const {
	auto values = std::vector<MTPMessage>();
	result.match([&](const MTPDmessages_messagesNotModified &) {}, [&](const auto &data) {
		values.assign(data.vmessages().v.begin(), data.vmessages().v.end());
	});
	return values;
}

void Client::ingest(const MTPmessages_Messages &result) {
	for (const auto &message : messages(result)) { ingest(message); }
}

void Client::ingest(const MTPMessage &message) {
	if (message.type() != mtpc_message) { return; }
	const auto &data = message.c_message();
	const auto id = FullMsgId(peerFromMTP(data.vpeer_id()), MsgId(data.vid().v));
	if (const auto from = data.vfrom_id()) {
		if (peerFromMTP(*from) == peerFromUser(_record.info.userId)) { _record.sent.emplace(id); }
	}
	if (const auto media = data.vmedia()) {
		ingest(*media);
		media->match([&](const MTPDmessageMediaPhoto &value) {
			if (const auto photo = value.vphoto(); photo && photo->type() == mtpc_photo) {
				_photoOrigins[photo->c_photo().vid().v] = id;
			}
		}, [&](const MTPDmessageMediaDocument &value) {
			if (const auto document = value.vdocument(); document && document->type() == mtpc_document) {
				_documentOrigins[document->c_document().vid().v] = id;
			}
		}, [&](const auto &) {});
	}
	if (const auto rich = data.vrich_message()) {
		const auto &value = rich->data();
		for (const auto &photo : value.vphotos().v) {
			ingest(photo);
			if (photo.type() == mtpc_photo) { _photoOrigins[photo.c_photo().vid().v] = id; }
		}
		for (const auto &document : value.vdocuments().v) {
			ingest(document);
			if (document.type() == mtpc_document) { _documentOrigins[document.c_document().vid().v] = id; }
		}
	}
}

void Client::ingest(const MTPMessageMedia &media) {
	media.match([&](const MTPDmessageMediaPhoto &data) {
		if (const auto photo = data.vphoto()) { ingest(*photo); }
	}, [&](const MTPDmessageMediaDocument &data) {
		if (const auto document = data.vdocument()) { ingest(*document); }
	}, [&](const auto &) {});
}

void Client::ingest(const MTPPhoto &photo) {
	if (photo.type() == mtpc_photo) {
		const auto &data = photo.c_photo();
		_photos[data.vid().v] = MTP_inputPhoto(data.vid(), data.vaccess_hash(), data.vfile_reference());
	}
}

void Client::ingest(const MTPDocument &document) {
	if (document.type() == mtpc_document) {
		const auto &data = document.c_document();
		_documents[data.vid().v] = MTP_inputDocument(data.vid(), data.vaccess_hash(), data.vfile_reference());
		for (const auto &attribute : data.vattributes().v) {
			if (attribute.type() == mtpc_documentAttributeAudio) { _audio.emplace(data.vid().v); }
		}
	}
}

void Client::refresh(const Op &operation, Fn<void()> retry) {
	if (++operation->refreshes > 1) {
		finish(operation, OperationState::Failed, { u"FILE_REFERENCE_EXPIRED"_q });
		return;
	}
	auto origins = std::set<FullMsgId>();
	for (auto &source : operation->media) {
		if (source.origin) { origins.emplace(source.origin); }
		const auto &map = source.photo ? _photoOrigins : _documentOrigins;
		if (const auto i = map.find(source.id); i != map.end()) { origins.emplace(i->second); }
	}
	if (!operation->targets.empty()) { origins.emplace(operation->targets.front()); }
	if (origins.empty()) {
		if (!operation->media.empty()) {
			for (const auto &source : operation->media) {
				if (source.photo) { _photos.erase(source.id); } else { _documents.erase(source.id); }
			}
			prepare(operation);
		} else {
			finish(operation, OperationState::Failed, { u"FILE_REFERENCE_SOURCE_MISSING"_q });
		}
		return;
	}
	const auto pending = std::make_shared<int>(int(origins.size()));
	for (const auto &origin : origins) {
		rpc(operation, MTPmessages_GetRichMessage(peer(origin.peer), MTP_int(origin.msg.bare)),
			Fn<void(const MTPmessages_Messages &)>([=](const MTPmessages_Messages &result) {
				ingest(result);
				if (!--*pending) { prepare(operation); }
			}));
	}
}

void Client::failed(
		const Op &operation,
		const MTP::Error &error,
		Fn<void()> retry,
		bool allowReauth) {
	const auto type = error.type();
	if (type.startsWith(u"API_ID_"_q) || type == u"API_HASH_INVALID"_q) {
		_manager->configurationFailed({ type, error.code() });
		_record.info.state = State::ConfigurationError;
	} else if (error.code() == 401 && allowReauth && operation->authAttempts++ == 0) {
		_ready = false;
		authenticate(operation, retry, true);
		return;
	} else if (type.startsWith(u"ACCESS_TOKEN_"_q) || error.code() == 401) {
		_record.info.state = State::NeedsAuthentication;
		_record.info.error = { type, error.code() };
		_ready = false;
	} else if (type == u"MESSAGE_NOT_MODIFIED"_q && Editing(operation->kind)) {
		operation->result.messages = operation->targets;
		finish(operation);
		return;
	} else if (type.startsWith(u"FILE_REFERENCE_"_q)) {
		refresh(operation, retry);
		return;
	} else {
		auto wait = 0;
		for (const auto &prefix : { u"FLOOD_WAIT_"_q, u"FLOOD_PREMIUM_WAIT_"_q, u"SLOWMODE_WAIT_"_q }) {
			if (type.startsWith(prefix)) { wait = type.mid(prefix.size()).toInt(); }
		}
		if (wait > 0 || ((error.code() < 0 || error.code() >= 500) && ++operation->retries <= 3)) {
			wait = wait > 0 ? wait : (1 << operation->retries);
			operation->result.state = OperationState::Waiting;
			operation->result.error = { type, error.code(), wait };
			notify(operation);
			base::call_delayed(crl::time(wait) * 1000, this, [=] {
				if (active(operation)) {
					operation->result.state = OperationState::Running;
					operation->result.error = {};
					retry();
				}
			});
			return;
		}
	}
	finish(operation, operation->submitted && (error.code() < 0 || error.code() >= 500)
		? OperationState::Unconfirmed : OperationState::Failed, { type, error.code() });
}

void Client::finish(const Op &operation, OperationState state, Error error) {
	if (!active(operation)) { return; }
	operation->finishing = true;
	for (const auto id : base::take(operation->requests)) { _sender->request(id).cancel(); }
	operation->result.state = state;
	operation->result.error = std::move(error);
	crl::on_main(this, [=] {
		if (_rollback) {
			if (state == OperationState::Completed) {
				auto old = std::make_unique<Client>(_manager, std::move(*_rollback));
				_rollback.reset();
				_manager->retire(std::move(old));
				_resourceGeneration = base::RandomValue<uint64>();
				_photos.clear();
				_documents.clear();
			} else {
				_connectionLifetime.destroy();
				_uploader.reset();
				_sender.reset();
				_instance.reset();
				_record = std::move(*_rollback);
				_rollback.reset();
				_ready = false;
			}
		}
		_active.reset();
		if (!_manager->save()) { _manager->changed(); }
		notify(operation);
		_manager->changed();
		_idleTimer.callOnce(kIdleTimeout);
		pump();
	});
}

void Client::notify(const Op &operation) {
	_manager->publish(operation->result);
	if (operation->result.terminal() && operation->done) {
		const auto done = base::take(operation->done);
		const auto result = operation->result;
		crl::on_main(_manager, [=] { done(result); });
	}
}

} // namespace BotUse
