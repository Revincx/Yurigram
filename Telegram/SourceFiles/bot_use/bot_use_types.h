#pragma once

#include "api/api_common.h"
#include "data/data_message_reaction_id.h"
#include "iv/iv_rich_page.h"
#include "mtproto/mtproto_auth_key.h"
#include "mtproto/mtproto_dc_options.h"

#include <map>
#include <set>

struct FilePrepareResult;

namespace BotUse {

using BotId = uint64;
using OperationId = uint64;

struct ApiCredentials {
	int apiId = 0;
	QString apiHash;
	friend bool operator==(const ApiCredentials &, const ApiCredentials &) = default;
};

struct Error {
	QString type;
	int code = 0;
	int retryAfter = 0;
	[[nodiscard]] explicit operator bool() const { return !type.isEmpty(); }
	[[nodiscard]] bool silent() const { return code == 406; }
};

enum class State {
	Unconfigured,
	Disconnected,
	Authenticating,
	Ready,
	NeedsAuthentication,
	ConfigurationError,
};

enum class OperationState {
	Queued,
	Running,
	Waiting,
	Completed,
	Failed,
	Cancelled,
	Unconfirmed,
};

struct BotInfo {
	BotId id = 0;
	UserId userId;
	MTP::Environment environment = MTP::Environment::Production;
	QString name;
	QString username;
	State state = State::Unconfigured;
	Error error;
};

struct Result {
	OperationId operation = 0;
	BotId bot = 0;
	PeerId peer;
	OperationState state = OperationState::Queued;
	std::vector<FullMsgId> messages;
	std::vector<MTPMessage> data;
	std::optional<MTPMessageMedia> media;
	std::optional<MTPUpdates> updates;
	std::vector<Data::ReactionId> chosenReactions;
	Error error;
	int64 uploaded = 0;
	int64 total = 0;
	[[nodiscard]] bool terminal() const;
};

using Completion = Fn<void(const Result &)>;

struct UploadProgress {
	uint64 id = 0;
	bool photo = false;
	int64 offset = 0;
	int64 size = 0;
};

using UploadCallback = Fn<void(const UploadProgress &)>;

struct RichMediaSource {
	uint64 id = 0;
	bool photo = false;
	FullMsgId origin;
	std::shared_ptr<FilePrepareResult> file;
	std::optional<MTPInputPhoto> uploadedPhoto;
	std::optional<MTPInputDocument> uploadedDocument;
};

class Client;
class Manager;

class ResourceContext final {
public:
	[[nodiscard]] BotId bot() const { return _bot; }

private:
	friend class Client;
	BotId _bot = 0;
	uint64 _generation = 0;
	std::map<uint64, MTPInputPhoto> _photos;
	std::map<uint64, MTPInputDocument> _documents;

};

struct Edit {
	FullMsgId message;
	std::optional<TextWithEntities> text;
	std::shared_ptr<FilePrepareResult> media;
	std::optional<MTPInputMedia> inputMedia;
	std::optional<Data::WebPageDraft> webPage;
	Api::SendOptions options;
};

struct Record {
	BotInfo info;
	QString token;
	MTP::Environment environment = MTP::Environment::Production;
	MTP::DcId mainDcId = 2;
	MTP::AuthKeysList keys;
	std::set<FullMsgId> sent;
};

[[nodiscard]] Error ValidateCredentials(const ApiCredentials &credentials);
[[nodiscard]] Error ValidateOptions(const Api::SendOptions &options);

} // namespace BotUse
