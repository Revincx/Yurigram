#pragma once

#include "bot_use/bot_use_types.h"

#include <memory>

class ChannelData;
class PeerData;

namespace ChatHelpers {
class Show;
} // namespace ChatHelpers

namespace Ui {

class ChooseBotUseButton;

[[nodiscard]] bool CanChooseBotUse(not_null<PeerData*> peer);
void FindFirstReadyBotInChannel(
	not_null<ChannelData*> channel,
	Fn<void(BotUse::BotId)> done);
void ShowChooseBotUse(
	not_null<PeerData*> peer,
	std::shared_ptr<ChatHelpers::Show> show);
void SetupChooseBotUseButton(
	not_null<ChooseBotUseButton*> button,
	not_null<PeerData*> peer,
	std::shared_ptr<ChatHelpers::Show> show);

} // namespace Ui
