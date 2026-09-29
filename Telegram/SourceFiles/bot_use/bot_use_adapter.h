#pragma once

#include "bot_use/bot_use_types.h"
#include "core/file_location.h"

namespace BotUse {

struct Action {
	PeerId peer;
	FullReplyTo reply;
	Api::SendOptions options;
};

struct MediaSource {
	uint64 id = 0;
	bool photo = false;
	bool audio = false;
	bool spoiler = false;
	bool forceFile = false;
	Core::FileLocation location;
	QByteArray bytes;
	QByteArray thumbnail;
	QString name;
	QString mime;
	QVector<MTPDocumentAttribute> attributes;
	TextWithEntities caption;
	FullMsgId origin;
	std::optional<MTPInputPhoto> uploadedPhoto;
	std::optional<MTPInputDocument> uploadedDocument;
};

enum class Kind { Authenticate, ReplaceToken, Text, Media, Album, Rich, Edit, EditRich, Delete, Upload };

struct Operation {
	Result result;
	Kind kind = Kind::Text;
	Action action;
	Completion done;
	Error validation;
	std::optional<TextWithEntities> text;
	std::optional<Data::WebPageDraft> webPage;
	std::vector<MediaSource> media;
	std::shared_ptr<Iv::RichPage> page;
	std::optional<MTPInputRichMessage> rich;
	std::shared_ptr<const ResourceContext> resources;
	std::vector<FullMsgId> targets;
	std::vector<uint64> randomIds;
	std::vector<MTPInputMedia> prepared;
	std::set<mtpRequestId> requests;
	QString token;
	int authAttempts = 0;
	int retries = 0;
	int refreshes = 0;
	bool submitted = false;
	bool channel = false;
	bool finishing = false;
};

[[nodiscard]] Error SnapshotAction(const Api::SendAction &from, Action &to);
[[nodiscard]] Error SnapshotMedia(const FilePrepareResult &from, MediaSource &to);
[[nodiscard]] Error SnapshotRich(
	const Iv::RichPage &page,
	const std::vector<RichMediaSource> &sources,
	Operation &operation);
[[nodiscard]] TextWithEntities SnapshotText(const TextWithTags &text);
[[nodiscard]] Error ValidateTarget(PeerId peer);
[[nodiscard]] MTPInputReplyTo ReplyToMTP(const Action &action, UserId bot);
[[nodiscard]] MTPVector<MTPMessageEntity> EntitiesToMTP(
	const EntitiesInText &entities,
	UserId bot);
[[nodiscard]] MTPInputMedia WebPageToMTP(const Data::WebPageDraft &page);

} // namespace BotUse
