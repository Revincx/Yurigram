#pragma once

#include <memory>

class PeerData;

namespace ChatHelpers {
class Show;
} // namespace ChatHelpers

namespace Ui {

class ChooseBotUseButton;

[[nodiscard]] bool CanChooseBotUse(not_null<PeerData*> peer);
void ShowChooseBotUse(
	not_null<PeerData*> peer,
	std::shared_ptr<ChatHelpers::Show> show);
void SetupChooseBotUseButton(
	not_null<ChooseBotUseButton*> button,
	not_null<PeerData*> peer,
	std::shared_ptr<ChatHelpers::Show> show);

} // namespace Ui
