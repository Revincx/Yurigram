#pragma once

#include "base/weak_ptr.h"
#include "bot_use/bot_use_settings.h"
#include "bot_use/bot_use_types.h"

namespace Storage {
class Domain;
} // namespace Storage

namespace BotUse {

struct Operation;

class Manager final : public base::has_weak_ptr {
public:
	explicit Manager(not_null<Storage::Domain*> storage);
	~Manager();

	void start();
	void finish();
	void reset();
	[[nodiscard]] bool hasCredentials() const;
	[[nodiscard]] bool busy() const;
	[[nodiscard]] Error storageError() const;
	[[nodiscard]] Error setApiCredentials(ApiCredentials credentials);
	[[nodiscard]] ApiCredentials apiCredentials() const;
	[[nodiscard]] int apiId() const;
	[[nodiscard]] bool autoAuth(BotId bot) const;
	[[nodiscard]] Error setAutoAuth(BotId bot, bool enabled);
	[[nodiscard]] const Settings::StoredValue &optionValue(
		Settings::OptionId id) const;
	[[nodiscard]] Error setOptionValue(
		Settings::OptionId id,
		Settings::StoredValue value);
	[[nodiscard]] rpl::producer<> optionChanges(
		Settings::OptionId id) const;

	template <typename Value>
	[[nodiscard]] const Value &option(Settings::Key<Value> key) const {
		return std::get<Value>(optionValue(key.id));
	}

	template <typename Value>
	[[nodiscard]] Error setOption(Settings::Key<Value> key, Value value) {
		return setOptionValue(key.id, Settings::StoredValue(std::move(value)));
	}

	template <typename Value>
	[[nodiscard]] rpl::producer<> optionChanges(
			Settings::Key<Value> key) const {
		return optionChanges(key.id);
	}
	[[nodiscard]] OperationId addAuthenticatedBot(
		QString token,
		Completion done,
		MTP::Environment environment = MTP::Environment::Production);
	[[nodiscard]] BotId addBot(
		QString token,
		MTP::Environment environment = MTP::Environment::Production);
	[[nodiscard]] OperationId authenticate(BotId bot, Completion done = {});
	[[nodiscard]] OperationId replaceBotToken(
		BotId bot,
		QString token,
		Completion done = {});
	[[nodiscard]] Error removeBot(BotId bot);
	[[nodiscard]] std::vector<BotInfo> bots() const;
	[[nodiscard]] rpl::producer<> changes() const;
	[[nodiscard]] rpl::producer<Result> results() const;
	[[nodiscard]] std::shared_ptr<const ResourceContext> resources(BotId bot);

	[[nodiscard]] OperationId setTyping(
		BotId bot,
		PeerId peer,
		MsgId topMsgId,
		MTPsendMessageAction action,
		Completion done = {});
	[[nodiscard]] OperationId toggleReaction(
		BotId bot,
		FullMsgId message,
		Data::ReactionId reaction,
		bool remove,
		bool addToRecent,
		Completion done = {});
	[[nodiscard]] OperationId sendText(
		BotId bot,
		const Api::MessageToSend &message,
		Completion done = {});
	[[nodiscard]] OperationId sendMedia(
		BotId bot,
		const Api::MessageToSend &message,
		const std::shared_ptr<FilePrepareResult> &file,
		Completion done = {},
		UploadCallback progress = {});
	[[nodiscard]] OperationId sendSticker(
		BotId bot,
		const Api::MessageToSend &message,
		const MTPInputDocument &document,
		Completion done = {});
	[[nodiscard]] OperationId uploadMedia(
		BotId bot,
		PeerId peer,
		const std::shared_ptr<FilePrepareResult> &file,
		Completion done = {},
		UploadCallback progress = {});
	[[nodiscard]] OperationId sendAlbum(
		BotId bot,
		const Api::SendAction &action,
		const std::vector<std::shared_ptr<FilePrepareResult>> &files,
		Completion done = {},
		UploadCallback progress = {});
	[[nodiscard]] OperationId sendRichMessage(
		BotId bot,
		std::shared_ptr<const Iv::RichPage> page,
		const Api::SendAction &action,
		Completion done = {},
		const std::vector<RichMediaSource> &sources = {},
		UploadCallback progress = {});
	[[nodiscard]] OperationId sendRichMessage(
		BotId bot,
		const MTPInputRichMessage &message,
		const Api::SendAction &action,
		std::shared_ptr<const ResourceContext> resources,
		Completion done = {});
	[[nodiscard]] OperationId editMessage(
		BotId bot,
		const Edit &edit,
		Completion done = {},
		UploadCallback progress = {});
	[[nodiscard]] OperationId editRichMessage(
		BotId bot,
		FullMsgId message,
		std::shared_ptr<const Iv::RichPage> page,
		Api::SendOptions options = {},
		Completion done = {},
		const std::vector<RichMediaSource> &sources = {},
		UploadCallback progress = {});
	[[nodiscard]] OperationId editRichMessage(
		BotId bot,
		FullMsgId message,
		const MTPInputRichMessage &content,
		std::shared_ptr<const ResourceContext> resources,
		Api::SendOptions options = {},
		Completion done = {});
	[[nodiscard]] OperationId deleteMessages(
		BotId bot,
		std::vector<FullMsgId> messages,
		Completion done = {});
	void cancel(OperationId operation);

private:
	friend class Client;
	[[nodiscard]] Client *client(BotId id);
	[[nodiscard]] OperationId nextOperation();
	[[nodiscard]] std::shared_ptr<Operation> makeOperation(
		BotId bot,
		Completion done,
		UploadCallback progress = {});
	[[nodiscard]] OperationId submit(std::shared_ptr<Operation> operation);
	[[nodiscard]] OperationId reject(BotId bot, Error error, Completion done);
	[[nodiscard]] bool save();
	void changed();
	void publish(const Result &result);
	[[nodiscard]] Error identify(BotId bot, UserId user);
	void configurationFailed(Error error);
	void retire(std::unique_ptr<Client> client);

	const not_null<Storage::Domain*> _storage;
	ApiCredentials _credentials;
	Settings::Registry _settings;
	std::map<BotId, std::unique_ptr<Client>> _clients;
	std::map<BotId, std::unique_ptr<Client>> _pending;
	std::vector<std::unique_ptr<Client>> _retired;
	BotId _nextBot = 1;
	OperationId _nextOperation = 1;
	uint64 _generation = 1;
	bool _started = false;
	bool _readOnly = false;
	Error _storageError;
	Error _configurationError;
	rpl::event_stream<> _changes;
	rpl::event_stream<Result> _results;
	rpl::lifetime _lifetime;

};

} // namespace BotUse
