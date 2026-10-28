/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "tray_accounts_menu.h"

#include "base/weak_ptr.h"
#include "core/application.h"
#include "data/data_peer.h"
#include "data/data_user.h"
#include "info/profile/info_profile_values.h"
#include "lang/lang_keys.h"
#include "main/main_account.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "ui/text/text_utilities.h"

namespace Core::TrayAccountsMenu {

void SetupChangesSubscription(Fn<void()> callback, rpl::lifetime &lifetime) {
	const auto accountSessionsLifetime = lifetime.make_state<rpl::lifetime>();
	const auto watchAccountSessions = [=] {
		accountSessionsLifetime->destroy();
		for (const auto &[index, account] : Core::App().domain().accounts()) {
			account->sessionChanges(
			) | rpl::on_next([=](Main::Session*) {
				callback();
			}, *accountSessionsLifetime);
		}
	};
	Core::App().domain().accountsChanges() | rpl::on_next([=] {
		watchAccountSessions();
		callback();
	}, lifetime);
	watchAccountSessions();
}

void Fill(Platform::Tray &tray) {
	if (Core::App().passcodeLocked()) {
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
	auto actions = std::vector<Platform::TrayMenuAction>();
	actions.reserve(accounts.size());
	for (const auto &account : accounts) {
		const auto user = account->session().user();
		const auto weak = base::make_weak(account);
		actions.push_back({
			.text = Info::Profile::NameValue(
				user
			) | rpl::map(Ui::Text::FixAmpersandInAction),
			.callback = [weak] {
				const auto strong = weak.get();
				if (!strong
					|| !strong->sessionExists()
					|| Core::App().passcodeLocked()) {
					return;
				}
				Core::App().ensureSeparateWindowFor({ strong });
			},
		});
	}
	tray.addSubmenu(tr::lng_choose_account_from_tray(), std::move(actions));
	tray.addSeparator();
}

} // namespace Core::TrayAccountsMenu
