#pragma once

#include "settings/settings_common_session.h"
#include "settings/settings_type.h"

#include "bot_use/bot_use_types.h"

#include <rpl/variable.h>

#include <map>
#include <memory>

namespace Ui {
class VerticalLayout;
} // namespace Ui

namespace Settings {

[[nodiscard]] Type BotUseSettingsId();

class BotUseSettings final : public Section<BotUseSettings> {
public:
	BotUseSettings(
		QWidget *parent,
		not_null<Window::SessionController*> controller);
	[[nodiscard]] rpl::producer<QString> title() override;

private:
	struct BotRow {
		UserId userId;
		QString username;
		std::shared_ptr<rpl::variable<QString>> title;
		std::shared_ptr<rpl::variable<QString>> status;
	};

	void setupContent();
	void refreshBots();
	void resolveAvatar(const BotUse::BotInfo &info);
	void showApiSettings();
	void showBot(const BotUse::BotInfo &info);
	void addBot();

	Ui::VerticalLayout *_bots = nullptr;
	std::map<BotUse::BotId, BotRow> _botRows;
	std::map<BotUse::BotId, std::pair<UserId, QString>> _avatarRequested;

};

} // namespace Settings
