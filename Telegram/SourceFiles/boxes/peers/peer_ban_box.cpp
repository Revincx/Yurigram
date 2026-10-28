#include "boxes/peers/peer_ban_box.h"

#include "base/unixtime.h"
#include "data/data_channel.h"
#include "lang/lang_keys.h"
#include "ui/boxes/choose_date_time.h"
#include "ui/layers/show.h"
#include "ui/widgets/checkbox.h"
#include "ui/widgets/labels.h"

#include <rpl/combine.h>

#include "styles/style_boxes.h"
#include "styles/style_edit_peer_members.h"

namespace {

constexpr auto kUntilOneDay = TimeId(-1);
constexpr auto kUntilOneWeek = TimeId(-2);
constexpr auto kUntilCustom = TimeId(-3);
constexpr auto kSecondsInDay = TimeId(24 * 60 * 60);
constexpr auto kMaxUntilDelay = TimeId(366 * kSecondsInDay);
constexpr auto kCustomUntilDelay = TimeId(60);

void ChooseBanUntil(
		not_null<Ui::GenericBox*> box,
		TimeId until,
		Fn<void(TimeId)> done) {
	const auto control = box->addRow(object_ptr<PeerRestrictionUntil>(
		box,
		box->uiShow(),
		tr::lng_peer_ban_until(),
		until), QMargins());
	box->addButton(tr::lng_settings_save(), [=] {
		done(control->value());
		box->closeBox();
	});
	box->addButton(tr::lng_cancel(), [=] { box->closeBox(); });
}

} // namespace

PeerRestrictionUntil::PeerRestrictionUntil(
	QWidget *parent,
	std::shared_ptr<Ui::Show> show,
	rpl::producer<QString> title,
	TimeId until)
: VerticalLayout(parent)
, _show(std::move(show))
, _until(ChannelData::IsRestrictedForever(until) ? 0 : until) {
	add(object_ptr<Ui::FlatLabel>(
		this,
		std::move(title),
		st::rightsHeaderLabel), st::rightsHeaderMargin);
	_group = std::make_shared<Ui::RadiobuttonGroup>(_until);
	const auto addOption = [&](int value, rpl::producer<QString> text) {
		const auto button = add(object_ptr<Ui::Radiobutton>(
			this,
			_group,
			value,
			QString(),
			st::defaultCheckbox), st::rightsToggleMargin);
		std::move(text) | rpl::on_next([=](const QString &text) {
			button->setText(text);
		}, button->lifetime());
	};
	addOption(0, tr::lng_rights_chat_banned_forever());
	addOption(kUntilOneDay, tr::lng_rights_chat_banned_day(
		lt_count,
		rpl::single(1.)));
	addOption(kUntilOneWeek, tr::lng_rights_chat_banned_week(
		lt_count,
		rpl::single(1.)));
	addOption(kUntilCustom, tr::lng_rights_chat_banned_custom());
	if (_until) {
		setCustomUntil(_until);
	}
	_group->setChangedCallback([=](int value) {
		if (value == kUntilCustom) {
			_group->setValue(_until);
			chooseCustom();
		} else {
			_until = value;
		}
	});
}

TimeId PeerRestrictionUntil::value() const {
	if (_until == kUntilOneDay) {
		return base::unixtime::now() + kSecondsInDay;
	} else if (_until == kUntilOneWeek) {
		return base::unixtime::now() + 7 * kSecondsInDay;
	}
	return _until;
}

void PeerRestrictionUntil::chooseCustom() {
	const auto show = _show;
	const auto until = value();
	const auto done = crl::guard(this, [=](TimeId result) {
		setCustomUntil(result);
	});
	show->showBox(Box([=](not_null<Ui::GenericBox*> box) {
		ChooseDateTimeBox(box, {
			.title = tr::lng_rights_chat_banned_custom(),
			.submit = tr::lng_settings_save(),
			.done = [=](TimeId result) { done(result); box->closeBox(); },
			.min = [] { return base::unixtime::now() + kCustomUntilDelay; },
			.time = until ? until : base::unixtime::now() + kSecondsInDay,
			.max = [] { return base::unixtime::now() + kMaxUntilDelay; },
		});
	}), Ui::LayerOption::KeepOther);
}

void PeerRestrictionUntil::setCustomUntil(TimeId until) {
	_customOption = nullptr;
	_until = until;
	const auto button = insert(1, object_ptr<Ui::Radiobutton>(
		this,
		_group,
		until,
		QString(),
		st::defaultCheckbox), st::rightsToggleMargin);
	_customOption.reset(button);
	tr::lng_rights_chat_banned_custom_date(
		lt_date,
		rpl::single(langDateTime(base::unixtime::parse(until)))
	) | rpl::on_next([=](const QString &text) {
		button->setText(text);
	}, button->lifetime());
	_group->setValue(until);
}

object_ptr<Ui::GenericBox> MakePeerBanBox(
		Ui::ConfirmBoxArgs args,
		Fn<void(TimeId, Fn<void()>)> confirmed) {
	return Box([
			args = std::move(args),
			confirmed = std::move(confirmed)](
			not_null<Ui::GenericBox*> box) mutable {
		const auto until = box->lifetime().make_state<rpl::variable<TimeId>>(0);
		args.text = rpl::combine(
			v::text::take_marked(std::move(args.text)),
			until->value(),
			tr::lng_peer_ban_until_confirmation(
				lt_date,
				until->value() | rpl::map([](TimeId value) {
					return langDateTime(base::unixtime::parse(value));
				}))
		) | rpl::map([](
				TextWithEntities text,
				TimeId until,
				const QString &suffix) {
			if (until) {
				text.append(u"\n\n"_q).append(suffix);
			}
			return text;
		});
		args.confirmed = [=](Fn<void()> close) {
			confirmed(until->current(), std::move(close));
		};
		Ui::ConfirmBox(box, std::move(args));
		box->addLeftButton(tr::lng_peer_ban_until(), [=] {
			box->uiShow()->showBox(Box(
				ChooseBanUntil,
				until->current(),
				crl::guard(box, [=](TimeId value) { *until = value; })),
				Ui::LayerOption::KeepOther);
		});
	});
}
