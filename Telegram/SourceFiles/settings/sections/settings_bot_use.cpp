#include "settings/sections/settings_bot_use.h"

#include "bot_use/bot_use_manager.h"
#include "apiwrap.h"
#include "data/data_session.h"
#include "data/data_user.h"
#include "info/channel_statistics/boosts/giveaway/boost_badge.h"
#include "lang/lang_keys.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "settings/settings_builder.h"
#include "settings/settings_common.h"
#include "settings/sections/settings_main.h"
#include "ui/boxes/confirm_box.h"
#include "ui/controls/userpic_button.h"
#include "ui/layers/generic_box.h"
#include "ui/toast/toast.h"
#include "ui/vertical_list.h"
#include "ui/rp_widget.h"
#include "ui/widgets/buttons.h"
#include "ui/widgets/fields/input_field.h"
#include "ui/widgets/fields/password_input.h"
#include "ui/widgets/labels.h"
#include "ui/wrap/slide_wrap.h"
#include "ui/wrap/vertical_layout.h"
#include "window/window_session_controller.h"
#include "styles/style_chat_helpers.h"
#include "styles/style_menu_icons.h"
#include "styles/style_layers.h"
#include "styles/style_settings.h"

#include <QtCore/QPointer>

namespace Settings {
namespace {

[[nodiscard]] not_null<Ui::VerticalLayout*> AddGroup(
		not_null<Ui::VerticalLayout*> page,
		rpl::producer<QString> title) {
	AddDivider(page);
	AddSkip(page);
	AddSubsectionTitle(page, std::move(title));
	const auto wrap = page->add(
		object_ptr<Ui::SlideWrap<Ui::VerticalLayout>>(
			page,
			object_ptr<Ui::VerticalLayout>(page)));
	return wrap->entity();
}

[[nodiscard]] QString StateText(BotUse::State state) {
	switch (state) {
	case BotUse::State::Unconfigured:
		return tr::lng_bot_use_state_unconfigured(tr::now);
	case BotUse::State::Disconnected:
		return tr::lng_bot_use_state_disconnected(tr::now);
	case BotUse::State::Authenticating:
		return tr::lng_bot_use_state_authenticating(tr::now);
	case BotUse::State::Ready:
		return tr::lng_bot_use_state_ready(tr::now);
	case BotUse::State::NeedsAuthentication:
		return tr::lng_bot_use_state_needs_auth(tr::now);
	case BotUse::State::ConfigurationError:
		return tr::lng_bot_use_state_config_error(tr::now);
	}
	Unexpected("BotUse state.");
}

[[nodiscard]] QString ErrorText(const BotUse::Error &error) {
	const auto &type = error.type;
	if (type == u"API_CREDENTIALS_INVALID"_q) {
		return tr::lng_bot_use_invalid_api(tr::now);
	} else if (type == u"BOT_ALREADY_ADDED"_q) {
		return tr::lng_bot_use_duplicate(tr::now);
	} else if (type == u"BOT_TOKEN_INVALID"_q
		|| type == u"ACCESS_TOKEN_INVALID"_q
		|| type == u"ACCESS_TOKEN_EXPIRED"_q) {
		return tr::lng_bot_use_invalid_token(tr::now);
	} else if (type == u"BOT_MANAGER_BUSY"_q) {
		return tr::lng_bot_use_busy(tr::now);
	} else if (type == u"BOT_BUSY_OR_INVALID_TOKEN"_q) {
		return tr::lng_bot_use_busy(tr::now);
	} else if (type == u"API_CREDENTIALS_REQUIRED"_q) {
		return tr::lng_bot_use_state_unconfigured(tr::now);
	} else if (type.startsWith(u"BOT_STORE_"_q)) {
		return tr::lng_bot_use_store_error(tr::now);
	}
	return tr::lng_bot_use_error(tr::now, lt_error, type);
}

void ShowError(
		not_null<Window::SessionController*> controller,
		const BotUse::Error &error) {
	controller->show(Ui::MakeInformBox(rpl::single(ErrorText(error))));
}

[[nodiscard]] bool TokenRejected(const BotUse::Error &error) {
	return error.type == u"BOT_TOKEN_INVALID"_q
		|| error.type == u"ACCESS_TOKEN_INVALID"_q
		|| error.type == u"ACCESS_TOKEN_EXPIRED"_q
		|| error.type == u"BOT_ALREADY_ADDED"_q
		|| error.type == u"BOT_IDENTITY_INVALID"_q
		|| error.type == u"BOT_IDENTITY_MISMATCH"_q;
}

void MarkTokenInvalid(not_null<Ui::PasswordInput*> token) {
	token->showErrorNoFocus();
	token->setFocusFast();
}

[[nodiscard]] not_null<Ui::PasswordInput*> AddTokenField(
		not_null<Ui::GenericBox*> box) {
	auto wrap = object_ptr<Ui::RpWidget>(box);
	const auto field = Ui::CreateChild<Ui::PasswordInput>(
		wrap.data(),
		st::defaultInputField,
		tr::lng_bot_use_token());
	wrap->resize(box->width(), field->height());
	wrap->widthValue(
	) | rpl::on_next([=](int width) {
		field->resize(width, field->height());
	}, field->lifetime());
	QObject::connect(field, &Ui::MaskedInputField::changed, field, [=] {
		field->hideError();
	});
	box->addRow(std::move(wrap));
	return field;
}

void AddAnimatedButton(
		not_null<Ui::GenericBox*> box,
		rpl::producer<QString> title,
		not_null<rpl::variable<bool>*> busy,
		Fn<void()> submit) {
	const auto button = box->addButton(rpl::conditional(
		busy->value(),
		rpl::single(QString()),
		std::move(title)), [=] {
		if (!busy->current()) {
			submit();
		}
	});
	button->setFullWidth(button->width());
	using namespace Info::Statistics;
	const auto animation = InfiniteRadialAnimationWidget(
		button.data(),
		button->height() / 2,
		&st::editStickerSetNameLoading);
	AddChildToWidgetCenter(button.data(), animation);
	animation->showOn(busy->value());
}

void AddBotStatus(
		not_null<Button*> button,
		rpl::producer<QString> text) {
	const auto label = Ui::CreateChild<Ui::FlatLabel>(
		button.get(),
		st::settingsBotUseRow.rightLabel);
	label->setAttribute(Qt::WA_TransparentForMouseEvents);
	label->show();
	rpl::combine(
		button->widthValue(),
		std::move(text)
	) | rpl::on_next([=](int width, const QString &value) {
		const auto &style = st::settingsBotUseRow;
		label->setText(value);
		label->resizeToNaturalWidth(label->textMaxWidth());
		label->moveToRight(
			st::settingsButtonRightSkip,
			style.padding.top());
		auto padding = style.padding;
		padding.setRight(st::settingsButtonRightSkip
			+ label->width()
			+ st::defaultVerticalListSkip);
		button->setPaddingOverride(padding);
	}, label->lifetime());
}

[[maybe_unused]] const auto kBotUseMeta = Builder::BuildHelper({
	.id = BotUseSettings::Id(),
	.parentId = MainId(),
	.title = &tr::lng_bot_use_settings,
	.icon = &st::menuIconBot,
}, [](Builder::SectionBuilder &) {
});

} // namespace

Type BotUseSettingsId() {
	return BotUseSettings::Id();
}

BotUseSettings::BotUseSettings(
		QWidget *parent,
		not_null<Window::SessionController*> controller)
: Section(parent, controller) {
	setupContent();
}

rpl::producer<QString> BotUseSettings::title() {
	return tr::lng_bot_use_settings();
}

void BotUseSettings::setupContent() {
	const auto page = Ui::CreateChild<Ui::VerticalLayout>(this);
	const auto api = AddGroup(page, tr::lng_bot_use_api_settings());
	const auto configure = AddButtonWithIcon(
		api,
		tr::lng_bot_use_api_credentials(),
		st::settingsButtonNoIcon);
	configure->addClickHandler([=] { showApiSettings(); });

	const auto manage = AddGroup(page, tr::lng_bot_use_manage());
	_bots = manage->add(object_ptr<Ui::VerticalLayout>(manage));
	const auto add = AddButtonWithIcon(
		manage,
		tr::lng_bot_use_add(),
		st::settingsBotUseRow,
		{ &st::menuIconAdd });
	add->addClickHandler([=] { addBot(); });

	refreshBots();
	controller()->session().domain().botUse().changes(
	) | rpl::on_next([=] { refreshBots(); }, lifetime());
	Ui::ResizeFitChild(this, page);
}

void BotUseSettings::showApiSettings() {
	const auto controller = this->controller();
	const auto manager = &controller->session().domain().botUse();
	controller->show(Box([=](not_null<Ui::GenericBox*> box) {
		box->setTitle(tr::lng_bot_use_api_settings());
		const auto credentials = manager->apiCredentials();
		const auto apiId = box->addRow(object_ptr<Ui::InputField>(
			box,
			st::defaultInputField,
			tr::lng_bot_use_api_id(),
			credentials.apiId ? QString::number(credentials.apiId) : QString()));
		apiId->setMaxLength(10);
		apiId->setInputMethodHints(Qt::ImhDigitsOnly);
		apiId->changes() | rpl::on_next([=] {
			apiId->hideError();
		}, apiId->lifetime());
		const auto apiHash = box->addRow(object_ptr<Ui::InputField>(
			box,
			st::defaultInputField,
			tr::lng_bot_use_api_hash(),
			credentials.apiHash));
		apiHash->setMaxLength(32);
		apiHash->setInputMethodHints(Qt::ImhLatinOnly
			| Qt::ImhNoAutoUppercase
			| Qt::ImhNoPredictiveText);
		apiHash->changes() | rpl::on_next([=] {
			apiHash->hideError();
		}, apiHash->lifetime());
		box->setFocusCallback([=] { apiId->setFocusFast(); });
		const auto dialog = QPointer<Ui::GenericBox>(box.get());
		box->addButton(tr::lng_settings_save(), [=] {
			const auto idText = apiId->getLastText().trimmed();
			const auto id = idText.toInt();
			const auto updated = BotUse::ApiCredentials{
				id,
				apiHash->getLastText().trimmed(),
			};
			const auto validId = id > 0 && idText == QString::number(id);
			const auto validHash = !BotUse::ValidateCredentials({
				1,
				updated.apiHash,
			});
			if (!validId) {
				apiId->showErrorNoFocus();
			}
			if (!validHash) {
				apiHash->showErrorNoFocus();
			}
			if (!validId || !validHash) {
				(validId ? apiHash : apiId)->setFocusFast();
				return;
			}
			const auto apply = [=] {
				if (!dialog) {
					return;
				}
				if (const auto error = manager->setApiCredentials(updated)) {
					if (error.type == u"API_CREDENTIALS_INVALID"_q) {
						apiId->showErrorNoFocus();
						apiHash->showErrorNoFocus();
						apiId->setFocusFast();
					} else {
						ShowError(controller, error);
					}
				} else {
					controller->showToast(tr::lng_bot_use_saved(tr::now));
					dialog->closeBox();
				}
			};
			if (updated != manager->apiCredentials()
				&& !manager->bots().empty()) {
				controller->show(Ui::MakeConfirmBox({
					.text = tr::lng_bot_use_api_change_confirm(),
					.confirmed = [=](Fn<void()> closeConfirm) {
						closeConfirm();
						apply();
					},
					.confirmText = tr::lng_settings_save(),
				}));
			} else {
				apply();
			}
		});
		box->addButton(tr::lng_cancel(), [=] { box->closeBox(); });
	}));
}

void BotUseSettings::refreshBots() {
	const auto &session = controller()->session();
	const auto infos = session.domain().botUse().bots();
	const auto rebuild = [&] {
		if (infos.size() != _botRows.size()) {
			return true;
		}
		for (const auto &info : infos) {
			const auto row = _botRows.find(info.id);
			if (row == _botRows.end()
				|| row->second.userId != info.userId
				|| row->second.username != info.username) {
				return true;
			}
		}
		return false;
	}();
	if (rebuild) {
		_bots->clear();
		_botRows.clear();
	}
	for (const auto &info : infos) {
		const auto name = info.name.isEmpty()
			? (info.username.isEmpty()
				? tr::lng_bot_use_unknown(tr::now)
				: u"@"_q + info.username)
			: info.name;
		const auto title = info.username.isEmpty() || info.name.isEmpty()
			? name
			: name + u" (@"_q + info.username + u")"_q;
		const auto status = StateText(info.state);
		if (!rebuild) {
			const auto &row = _botRows.at(info.id);
			if (row.title->current() != title) {
				*row.title = title;
			}
			if (row.status->current() != status) {
				*row.status = status;
			}
			continue;
		}
		auto state = BotRow{
			.userId = info.userId,
			.username = info.username,
			.title = std::make_shared<rpl::variable<QString>>(title),
			.status = std::make_shared<rpl::variable<QString>>(status),
		};
		const auto row = AddButtonWithIcon(
			_bots,
			state.title->value(),
			st::settingsBotUseRow,
			{ .icon = info.userId ? nullptr : &st::menuIconBot });
		AddBotStatus(row, state.status->value());
		_botRows.emplace(info.id, std::move(state));
		if (info.userId) {
			const auto user = session.data().user(info.userId);
			const auto avatar = Ui::CreateChild<Ui::UserpicButton>(
				row.get(),
				not_null<PeerData*>(user.get()),
				st::settingsBotUseUserpic);
			avatar->setAttribute(Qt::WA_TransparentForMouseEvents);
			row->heightValue(
			) | rpl::on_next([=](int height) {
				avatar->moveToLeft(
					st::settingsBotUseAvatarLeft,
					(height - avatar->height()) / 2);
			}, avatar->lifetime());
			avatar->show();
			resolveAvatar(info);
		}
		row->addClickHandler([=] {
			for (const auto &current : controller()->session()
				.domain().botUse().bots()) {
				if (current.id == info.id) {
					showBot(current);
					break;
				}
			}
		});
	}
}

void BotUseSettings::resolveAvatar(const BotUse::BotInfo &info) {
	if (!info.userId || info.username.isEmpty()
		|| _avatarRequested[info.id]
			== std::make_pair(info.userId, info.username)) {
		return;
	}
	_avatarRequested[info.id] = { info.userId, info.username };
	const auto session = &controller()->session();
	session->api().request(MTPcontacts_ResolveUsername(
		MTP_flags(0),
		MTP_string(info.username),
		MTP_string()
	)).done(crl::guard(this, [=](const MTPcontacts_ResolvedPeer &result) {
		const auto &data = result.data();
		if (peerFromMTP(data.vpeer()) == peerFromUser(info.userId)) {
			session->data().processUsers(data.vusers());
		}
	})).send();
}

void BotUseSettings::showBot(const BotUse::BotInfo &info) {
	const auto controller = this->controller();
	controller->show(Box([=](not_null<Ui::GenericBox*> box) {
		const auto details = QPointer<Ui::GenericBox>(box.get());
		box->setTitle(rpl::single(info.name.isEmpty()
			? (info.username.isEmpty()
				? tr::lng_bot_use_unknown(tr::now)
				: u"@"_q + info.username)
			: info.name));
		const auto content = box->verticalLayout();
		AddSubsectionTitle(content, rpl::single(StateText(info.state)));
		const auto active = box->lifetime().make_state<BotUse::OperationId>(0);
		box->boxClosing() | rpl::on_next([=] {
			if (*active) {
				controller->session().domain().botUse().cancel(*active);
			}
		}, box->lifetime());
		const auto authenticate = AddButtonWithIcon(
			content,
			tr::lng_bot_use_reauthenticate(),
			st::settingsButtonNoIcon);
		authenticate->addClickHandler([=] {
			if (*active) {
				return;
			}
			auto &manager = controller->session().domain().botUse();
			*active = manager.authenticate(info.id, crl::guard(box, [=](const BotUse::Result &result) {
				*active = 0;
				if (result.state == BotUse::OperationState::Completed) {
					box->closeBox();
				} else {
					ShowError(controller, result.error);
				}
			}));
			if (!*active) {
				ShowError(controller, { u"BOT_NOT_AVAILABLE"_q });
			}
		});
		const auto replace = AddButtonWithIcon(
			content,
			tr::lng_bot_use_replace_token(),
			st::settingsButtonNoIcon);
		replace->addClickHandler([=] {
			controller->show(Box([=](not_null<Ui::GenericBox*> edit) {
				edit->setTitle(tr::lng_bot_use_replace_token());
				const auto token = AddTokenField(edit);
				const auto busy = edit->lifetime().make_state<rpl::variable<bool>>(false);
				const auto active = edit->lifetime().make_state<BotUse::OperationId>(0);
				edit->boxClosing() | rpl::on_next([=] {
					if (*active) {
						controller->session().domain().botUse().cancel(*active);
					}
				}, edit->lifetime());
				AddAnimatedButton(edit, tr::lng_settings_save(), busy, [=] {
					const auto value = token->getLastText().trimmed();
					if (value.isEmpty()) {
						MarkTokenInvalid(token);
						return;
					}
					*busy = true;
					auto &manager = controller->session().domain().botUse();
					*active = manager.replaceBotToken(info.id, value,
						crl::guard(edit, [=](const BotUse::Result &result) {
							*active = 0;
							*busy = false;
							if (result.state == BotUse::OperationState::Completed) {
								edit->closeBox();
								if (details) {
									details->closeBox();
								}
							} else {
								if (TokenRejected(result.error)) {
									MarkTokenInvalid(token);
								} else {
									ShowError(controller, result.error);
								}
							}
						}));
					if (!*active) {
						*busy = false;
						ShowError(controller, { u"BOT_NOT_AVAILABLE"_q });
					}
				});
				edit->addButton(tr::lng_cancel(), [=] { edit->closeBox(); });
			}));
		});
		const auto remove = AddButtonWithIcon(
			content,
			tr::lng_box_remove(),
			st::settingsAttentionButton);
		remove->addClickHandler([=] {
			controller->show(Ui::MakeConfirmBox({
				.text = tr::lng_bot_use_remove_confirm(),
				.confirmed = [=](Fn<void()> closeConfirm) {
					if (!details) {
						closeConfirm();
						return;
					}
					const auto error = controller->session()
						.domain().botUse().removeBot(info.id);
					closeConfirm();
					if (error) {
						ShowError(controller, error);
					} else {
						details->closeBox();
					}
				},
				.confirmText = tr::lng_box_remove(),
			}));
		});
		box->addButton(tr::lng_close(), [=] { box->closeBox(); });
	}));
}

void BotUseSettings::addBot() {
	const auto controller = this->controller();
	controller->show(Box([=](not_null<Ui::GenericBox*> box) {
		box->setTitle(tr::lng_bot_use_add());
		const auto token = AddTokenField(box);
		const auto busy = box->lifetime().make_state<rpl::variable<bool>>(false);
		const auto active = box->lifetime().make_state<BotUse::OperationId>(0);
		box->boxClosing() | rpl::on_next([=] {
			if (*active) {
				controller->session().domain().botUse().cancel(*active);
			}
		}, box->lifetime());
		AddAnimatedButton(box, tr::lng_bot_use_add(), busy, [=] {
			const auto value = token->getLastText().trimmed();
			if (value.isEmpty()) {
				MarkTokenInvalid(token);
				return;
			}
			*busy = true;
			*active = controller->session().domain().botUse().addAuthenticatedBot(
				value,
				crl::guard(box, [=](const BotUse::Result &result) {
					*active = 0;
					*busy = false;
					if (result.state == BotUse::OperationState::Completed) {
						box->closeBox();
						controller->showToast({
							.text = { tr::lng_bot_use_added(tr::now) },
							.iconLottie = u"toast/contact_check"_q,
							.iconLottieSize = st::toastLottieIconSize,
						});
					} else {
						if (TokenRejected(result.error)) {
							MarkTokenInvalid(token);
						} else {
							ShowError(controller, result.error);
						}
					}
				}));
			if (!*active) {
				*busy = false;
				ShowError(controller, { u"BOT_NOT_AVAILABLE"_q });
			}
		});
		box->addButton(tr::lng_cancel(), [=] { box->closeBox(); });
	}));
}

} // namespace Settings
