#pragma once

#include "bot_use/bot_use_types.h"

class History;
class HistoryItem;
class DocumentData;
class PhotoData;
namespace Main { class Session; }

namespace BotUse {

[[nodiscard]] BotId Selected(not_null<History*> history);
[[nodiscard]] BotId RichEditBot(not_null<HistoryItem*> item);
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
