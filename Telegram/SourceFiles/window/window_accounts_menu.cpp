/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "window/window_accounts_menu.h"

#include "base/unique_qptr.h"
#include "base/weak_ptr.h"
#include "core/application.h"
#include "data/data_user.h"
#include "info/profile/info_profile_values.h"
#include "main/main_account.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "ui/text/text_utilities.h"
#include "window/window_controller.h"

#include <QtWidgets/QMenu>

namespace Window {
namespace {

class AccountsMenu final : public QObject {
public:
	AccountsMenu(not_null<QMenu*> menu, Fn<Controller*()> window);

private:
	void watchAccounts();
	void rebuild();

	const not_null<QMenu*> _menu;
	const Fn<Controller*()> _window;
	std::vector<base::unique_qptr<QAction>> _actions;
	rpl::lifetime _actionsLifetime;
	rpl::lifetime _accountSessionsLifetime;
	rpl::lifetime _lifetime;

};

[[nodiscard]] Main::Account *AvailableAccount(
		base::weak_ptr<Main::Account> account) {
	const auto strong = account.get();
	return (strong
		&& strong->sessionExists()
		&& Core::IsAppLaunched()
		&& !Core::Quitting()
		&& !Core::App().passcodeLocked())
		? strong
		: nullptr;
}

[[nodiscard]] Controller *SwitchWindow(Controller *preferred) {
	if (preferred
		&& preferred->isPrimary()
		&& !preferred->widget()->isHidden()) {
		return preferred;
	}
	for (const auto &window : ranges::views::reverse(Core::App().windowStack())) {
		if (window->isPrimary() && !window->widget()->isHidden()) {
			return window;
		}
	}
	return nullptr;
}

void SwitchAccount(
		base::weak_ptr<Main::Account> account,
		Controller *window) {
	const auto strong = AvailableAccount(account);
	if (!strong) {
		return;
	}
	auto &app = Core::App();
	if (const auto existing = app.separateWindowFor(not_null(strong))) {
		existing->activate();
	} else if (!window || window->widget()->isHidden()) {
		app.ensureSeparateWindowFor(not_null(strong));
	} else {
		window->showAccount(strong);
		app.setActivePrimaryWindow(window);
		app.domain().activate(strong);
	}
}

void ChooseAccount(
		base::weak_ptr<Main::Account> account,
		const Fn<Controller*()> &resolveWindow) {
	const auto strong = AvailableAccount(account);
	if (!strong) {
		return;
	}
	if (Core::App().separateWindowFor(not_null(strong))) {
		SwitchAccount(account, nullptr);
		return;
	}
	const auto window = SwitchWindow(resolveWindow());
	if (window) {
		window->preventOrInvoke(crl::guard(window, [=] {
			SwitchAccount(account, window);
		}));
	} else {
		SwitchAccount(account, nullptr);
	}
}

AccountsMenu::AccountsMenu(not_null<QMenu*> menu, Fn<Controller*()> window)
: QObject(menu)
, _menu(menu)
, _window(std::move(window)) {
	Core::App().domain().accountsChanges(
	) | rpl::on_next([=] {
		watchAccounts();
		rebuild();
	}, _lifetime);
	Core::App().passcodeLockChanges(
	) | rpl::on_next([=] {
		rebuild();
	}, _lifetime);
	QObject::connect(menu.get(), &QMenu::aboutToShow, this, [=] {
		rebuild();
	});
	watchAccounts();
	rebuild();
}

void AccountsMenu::watchAccounts() {
	_accountSessionsLifetime.destroy();
	for (const auto &[index, account] : Core::App().domain().accounts()) {
		account->sessionChanges(
		) | rpl::on_next([=](Main::Session*) {
			rebuild();
		}, _accountSessionsLifetime);
	}
}

void AccountsMenu::rebuild() {
	_actionsLifetime.destroy();
	_actions.clear();
	if (!Core::IsAppLaunched()
		|| Core::Quitting()
		|| Core::App().passcodeLocked()) {
		return;
	}
	auto accounts = std::vector<not_null<Main::Account*>>();
	for (const auto &account : Core::App().domain().orderedAccounts()) {
		if (account->sessionExists()) {
			accounts.push_back(account);
		}
	}
	if (accounts.size() <= 1) {
		return;
	}
	const auto existing = _menu->actions();
	const auto before = existing.empty() ? nullptr : existing.front();
	for (const auto &account : accounts) {
		auto action = base::make_unique_q<QAction>(_menu.get());
		action->setMenuRole(QAction::NoRole);
		const auto raw = action.get();
		Info::Profile::NameValue(
			account->session().user()
		) | rpl::map(
			Ui::Text::FixAmpersandInAction
		) | rpl::on_next([=](const QString &text) {
			raw->setText(text);
		}, _actionsLifetime);
		QObject::connect(
			raw,
			&QAction::triggered,
			this,
			[=, weak = base::make_weak(account), resolve = _window] {
				crl::on_main(this, [=] {
					ChooseAccount(weak, resolve);
				});
			});
		_menu->insertAction(before, raw);
		_actions.push_back(std::move(action));
	}
	auto separator = base::make_unique_q<QAction>(_menu.get());
	separator->setSeparator(true);
	_menu->insertAction(before, separator.get());
	_actions.push_back(std::move(separator));
}

} // namespace

void SetupAccountsMenu(not_null<QMenu*> menu, Fn<Controller*()> window) {
	new AccountsMenu(menu, std::move(window));
}

} // namespace Window
