#pragma once

#include "bot_use/bot_use_types.h"

class History;
class HistoryItem;
class DocumentData;
class PhotoData;
namespace Main { class Session; }

namespace BotUse {

[[nodiscard]] BotId Selected(not_null<History*> history);
[[nodiscard]] bool AllowReplyAndRepeat(
	not_null<History*> history,
	not_null<HistoryItem*> item);
[[nodiscard]] bool CanRepeat(
	not_null<History*> history,
	not_null<HistoryItem*> item,
	bool asForward);
[[nodiscard]] bool RepeatMessage(
	not_null<History*> history,
	FullMsgId message,
	bool asForward,
	bool replyToOriginal);
[[nodiscard]] BotId EditBot(not_null<HistoryItem*> item);
[[nodiscard]] BotId DeleteBot(not_null<HistoryItem*> item);
[[nodiscard]] bool CanEditAs(not_null<HistoryItem*> item, BotId bot);
[[nodiscard]] bool CanDeleteAs(not_null<HistoryItem*> item, BotId bot);
[[nodiscard]] BotId RichEditBot(not_null<HistoryItem*> item);
[[nodiscard]] std::optional<MTPInputMedia> ExistingEditMedia(
	not_null<HistoryItem*> item,
	bool spoilered,
	const Api::VideoCoverEdit &videoCover);
[[nodiscard]] OperationId SubmitEdit(
	not_null<HistoryItem*> item,
	BotId bot,
	const Edit &edit,
	Completion done = {},
	const std::shared_ptr<FilePrepareResult> &preview = {});
[[nodiscard]] bool EditPrepared(
	BotId bot,
	not_null<Main::Session*> session,
	const std::shared_ptr<FilePrepareResult> &file);
[[nodiscard]] BotId RichDraftBot(
	not_null<History*> history,
	const FullReplyTo &reply);
[[nodiscard]] Completion RichDraftCompletion(
	const Api::SendAction &action,
	std::shared_ptr<const Iv::RichPage> expected = {});
[[nodiscard]] Error ValidateSend(BotId bot, const Api::SendAction &action);
void ShowSendError(not_null<History*> history, const Error &error);
void PrepareLocalMediaPreview(
	not_null<Main::Session*> session,
	const std::shared_ptr<FilePrepareResult> &file);
void ApplyLocalMediaUploadProgress(
	not_null<Main::Session*> session,
	const UploadProgress &progress);
void FailLocalMediaUpload(
	not_null<Main::Session*> session,
	uint64 id,
	bool photo);
[[nodiscard]] bool SendText(
	BotId bot,
	Api::MessageToSend message,
	std::optional<MsgId> localId = std::nullopt);
[[nodiscard]] bool SendRich(
	BotId bot,
	std::shared_ptr<const Iv::RichPage> page,
	Api::SendAction action,
	const std::vector<RichMediaSource> &sources = {},
	Completion done = {});
[[nodiscard]] bool SendPrepared(
	BotId bot,
	not_null<Main::Session*> session,
	const std::shared_ptr<FilePrepareResult> &file,
	std::optional<MsgId> localId = std::nullopt);
[[nodiscard]] bool SendExisting(
	BotId bot,
	Api::MessageToSend message,
	PhotoData *photo,
	DocumentData *document,
	std::optional<MsgId> localId = std::nullopt);

} // namespace BotUse
