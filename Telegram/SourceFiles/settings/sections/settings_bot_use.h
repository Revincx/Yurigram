#pragma once

#include "settings/settings_common_session.h"
#include "settings/settings_type.h"

#include "bot_use/bot_use_settings.h"
#include "bot_use/bot_use_types.h"

#include <QPointer>
#include <rpl/variable.h>

#include <map>
#include <memory>
#include <vector>

namespace Ui {
class RpWidget;
class VerticalLayout;
} // namespace Ui

namespace Settings {

[[nodiscard]] Type BotUseSettingsId();
[[nodiscard]] QString BotUseSettingsPath();

class BotUseSettings final : public Section<BotUseSettings> {
public:
	BotUseSettings(
		QWidget *parent,
		not_null<Window::SessionController*> controller);
	[[nodiscard]] rpl::producer<QString> title() override;
	void showFinished() override;

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
	void addToggleOption(
		not_null<Ui::VerticalLayout*> content,
		BotUse::Settings::Key<bool> key);
	void registerOption(
		BotUse::Settings::OptionId id,
		not_null<Ui::RpWidget*> widget);

	Ui::VerticalLayout *_bots = nullptr;
	std::map<BotUse::BotId, BotRow> _botRows;
	std::map<BotUse::BotId, std::pair<UserId, QString>> _avatarRequested;
	std::vector<std::pair<QString, QPointer<QWidget>>> _highlightControls;

};

} // namespace Settings
