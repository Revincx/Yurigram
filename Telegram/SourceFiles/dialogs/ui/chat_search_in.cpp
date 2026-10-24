/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "dialogs/ui/chat_search_in.h"

#include "lang/lang_keys.h"
#include "ui/effects/ripple_animation.h"
#include "ui/text/text_utilities.h"
#include "ui/widgets/buttons.h"
#include "ui/widgets/popup_menu.h"
#include "ui/widgets/shadow.h"
#include "ui/widgets/menu/menu_item_base.h"
#include "ui/dynamic_image.h"
#include "ui/dynamic_thumbnails.h"
#include "ui/painter.h"
#include "styles/style_dialogs.h"
#include "styles/style_menu_icons.h"
#include "styles/style_window.h"

namespace Dialogs {
namespace {

class Action final : public Ui::Menu::ItemBase {
public:
	Action(
		not_null<Ui::PopupMenu*> parentMenu,
		std::shared_ptr<Ui::DynamicImage> icon,
		const QString &label,
		bool chosen);
	~Action();

	bool isEnabled() const override;
	not_null<QAction*> action() const override;

	void handleKeyPress(not_null<QKeyEvent*> e) override;
	void setChecked(bool checked);

protected:
	QPoint prepareRippleStartPosition() const override;
	QImage prepareRippleMask() const override;

	int contentHeight() const override;

private:
	void paint(Painter &p);

	void resolveMinWidth();
	void refreshDimensions();

	const not_null<Ui::PopupMenu*> _parentMenu;
	const not_null<QAction*> _dummyAction;
	const style::Menu &_st;
	const int _height = 0;

	std::shared_ptr<Ui::DynamicImage> _icon;
	Ui::Text::String _text;
	bool _checked = false;

};

class TagFilterThumbnail final : public Ui::DynamicImage {
public:
	std::shared_ptr<Ui::DynamicImage> clone() override;

	QImage image(int size) override;
	void subscribeToUpdates(Fn<void()> callback) override;

private:
	int _paletteVersion = 0;
	QImage _frame;

};

std::shared_ptr<Ui::DynamicImage> TagFilterThumbnail::clone() {
	return std::make_shared<TagFilterThumbnail>();
}

QImage TagFilterThumbnail::image(int size) {
	const auto good = (_frame.width() == size * _frame.devicePixelRatio());
	const auto paletteVersion = style::PaletteVersion();
	if (!good || _paletteVersion != paletteVersion) {
		_paletteVersion = paletteVersion;
		const auto ratio = style::DevicePixelRatio();
		if (!good) {
			_frame = QImage(
				QSize(size, size) * ratio,
				QImage::Format_ARGB32_Premultiplied);
			_frame.setDevicePixelRatio(ratio);
		}
		_frame.fill(Qt::transparent);
		auto p = Painter(&_frame);
		st::menuIconTagFilter.paintInCenter(p, QRect(0, 0, size, size));
	}
	return _frame;
}

void TagFilterThumbnail::subscribeToUpdates(Fn<void()> callback) {
	if (!callback) {
		_frame = {};
	}
}

[[nodiscard]] std::shared_ptr<Ui::DynamicImage> MakeTagFilterThumbnail() {
	return std::make_shared<TagFilterThumbnail>();
}

[[nodiscard]] auto MessageSearchTypeIcon(MessageSearchType type)
-> const style::icon & {
	switch (type) {
	case MessageSearchType::Photo:
		return st::dialogsSearchInMessageTypePhoto;
	case MessageSearchType::Video:
		return st::dialogsSearchInMessageTypeVideo;
	case MessageSearchType::File:
		return st::dialogsSearchInMessageTypeFile;
	case MessageSearchType::Link:
		return st::dialogsSearchInMessageTypeLink;
	case MessageSearchType::Music:
		return st::dialogsSearchInMessageTypeMusic;
	case MessageSearchType::Voice:
		return st::dialogsSearchInMessageTypeVoice;
	case MessageSearchType::RoundVideo:
		return st::dialogsSearchInMessageTypeRoundVideo;
	case MessageSearchType::Sticker:
		return st::dialogsSearchInMessageTypeSticker;
	case MessageSearchType::Gif:
		return st::dialogsSearchInMessageTypeGif;
	case MessageSearchType::Poll:
		return st::dialogsSearchInMessageTypePoll;
	case MessageSearchType::Mention:
		return st::dialogsSearchInMessageTypeMention;
	case MessageSearchType::Location:
		return st::dialogsSearchInMessageTypeLocation;
	case MessageSearchType::Pinned:
		return st::dialogsSearchInMessageTypePinned;
	case MessageSearchType::kCount:
		break;
	}
	Unexpected("MessageSearchType in MessageSearchTypeIcon.");
}

[[nodiscard]] const std::vector<MessageSearchType> &MessageSearchTypeList() {
	static const auto result = std::vector{
		MessageSearchType::Photo,
		MessageSearchType::Video,
		MessageSearchType::File,
		MessageSearchType::Link,
		MessageSearchType::Music,
		MessageSearchType::Voice,
		MessageSearchType::RoundVideo,
		MessageSearchType::Sticker,
		MessageSearchType::Gif,
		MessageSearchType::Poll,
		MessageSearchType::Mention,
		MessageSearchType::Location,
		MessageSearchType::Pinned,
	};
	return result;
}

[[nodiscard]] QString MessageSearchTypeLabel(MessageSearchType type) {
	switch (type) {
	case MessageSearchType::Photo:
		return tr::lng_media_type_photos(tr::now);
	case MessageSearchType::Video:
		return tr::lng_media_type_videos(tr::now);
	case MessageSearchType::File:
		return tr::lng_media_type_files(tr::now);
	case MessageSearchType::Link:
		return tr::lng_media_type_links(tr::now);
	case MessageSearchType::Music:
		return tr::lng_media_type_songs(tr::now);
	case MessageSearchType::Voice:
		return tr::lng_media_type_audios(tr::now);
	case MessageSearchType::RoundVideo:
		return tr::lng_media_type_rounds(tr::now);
	case MessageSearchType::Sticker:
		return tr::lng_switch_stickers(tr::now);
	case MessageSearchType::Gif:
		return tr::lng_media_type_gifs(tr::now);
	case MessageSearchType::Poll:
		return tr::lng_media_type_polls(tr::now);
	case MessageSearchType::Mention:
		return tr::lng_message_search_filter_mentions(tr::now);
	case MessageSearchType::Location:
		return tr::lng_location_title(tr::now);
	case MessageSearchType::Pinned:
		return tr::lng_settings_events_pinned(tr::now);
	case MessageSearchType::kCount:
		break;
	}
	Unexpected("MessageSearchType in MessageSearchTypeLabel.");
}

[[nodiscard]] int MessageSearchTypesCount(MessageSearchTypes types) {
	auto result = 0;
	for (const auto type : MessageSearchTypeList()) {
		if (types & MessageSearchTypeBit(type)) {
			++result;
		}
	}
	return result;
}

[[nodiscard]] QString MessageSearchTypesLabel(MessageSearchTypes types) {
	const auto count = MessageSearchTypesCount(types);
	if (!count) {
		return tr::lng_forum_all_messages(tr::now);
	} else if (count == 1) {
		for (const auto type : MessageSearchTypeList()) {
			if (types & MessageSearchTypeBit(type)) {
				return MessageSearchTypeLabel(type);
			}
		}
	}
	return tr::lng_message_search_filter_selected(
		tr::now,
		lt_count,
		count);
}

[[nodiscard]] QString TabLabel(
		ChatSearchTab tab,
		ChatSearchPeerTabType type = {}) {
	switch (tab) {
	case ChatSearchTab::MyMessages:
		return tr::lng_search_tab_my_messages(tr::now);
	case ChatSearchTab::ThisTopic:
		return tr::lng_search_tab_this_topic(tr::now);
	case ChatSearchTab::ThisPeer:
		switch (type) {
		case ChatSearchPeerTabType::Chat:
			return tr::lng_search_tab_this_chat(tr::now);
		case ChatSearchPeerTabType::Channel:
			return tr::lng_search_tab_this_channel(tr::now);
		case ChatSearchPeerTabType::Group:
			return tr::lng_search_tab_this_group(tr::now);
		}
		Unexpected("Type in Dialogs::TabLabel.");
	case ChatSearchTab::PublicPosts:
		return tr::lng_search_tab_public_posts(tr::now);
	case ChatSearchTab::Archive:
		return tr::lng_search_tab_archive(tr::now);
	case ChatSearchTab::ThisCommunity:
		return tr::lng_search_tab_this_community(tr::now);
	}
	Unexpected("Tab in Dialogs::TabLabel.");
}

Action::Action(
	not_null<Ui::PopupMenu*> parentMenu,
	std::shared_ptr<Ui::DynamicImage> icon,
	const QString &label,
	bool chosen)
: ItemBase(parentMenu->menu(), parentMenu->menu()->st())
, _parentMenu(parentMenu)
, _dummyAction(CreateChild<QAction>(parentMenu->menu().get()))
, _st(parentMenu->menu()->st())
, _height(st::dialogsSearchInHeight)
, _icon(std::move(icon))
, _checked(chosen) {
	_text.setText(st::semiboldTextStyle, label);
	_icon->subscribeToUpdates([=] { update(); });

	fitToMenuWidth();
	resolveMinWidth();

	paintRequest(
	) | rpl::on_next([=] {
		Painter p(this);
		paint(p);
	}, lifetime());

	enableMouseSelecting();
}

Action::~Action() {
	_icon->subscribeToUpdates(nullptr);
}

void Action::resolveMinWidth() {
	const auto maxWidth = st::dialogsSearchInPhotoPadding
		+ st::dialogsSearchInPhotoSize
		+ st::dialogsSearchInSkip
		+ _text.maxWidth()
		+ st::dialogsSearchInCheckSkip
		+ st::dialogsSearchInCheck.width()
		+ st::dialogsSearchInCheckSkip;
	setMinWidth(maxWidth);
}

void Action::paint(Painter &p) {
	const auto enabled = isEnabled();
	const auto selected = isSelected();
	if (selected && _st.itemBgOver->c.alpha() < 255) {
		p.fillRect(0, 0, width(), _height, _st.itemBg);
	}
	const auto &bg = selected ? _st.itemBgOver : _st.itemBg;
	p.fillRect(0, 0, width(), _height, bg);
	if (enabled) {
		paintRipple(p, 0, 0);
	}

	auto x = st::dialogsSearchInPhotoPadding;
	const auto photos = st::dialogsSearchInPhotoSize;
	const auto photoy = (height() - photos) / 2;
	p.drawImage(QRect{ x, photoy, photos, photos }, _icon->image(photos));
	x += photos + st::dialogsSearchInSkip;
	const auto available = width()
		- x
		- st::dialogsSearchInCheckSkip
		- st::dialogsSearchInCheck.width()
		- st::dialogsSearchInCheckSkip;

	p.setPen(!enabled
		? _st.itemFgDisabled
		: selected
		? _st.itemFgOver
		: _st.itemFg);
	_text.drawLeftElided(
		p,
		x,
		st::dialogsSearchInNameTop,
		available,
		width());
	x += available;
	if (_checked) {
		x += st::dialogsSearchInCheckSkip;
		const auto &icon = st::dialogsSearchInCheck;
		const auto icony = (height() - icon.height()) / 2;
		icon.paint(p, x, icony, width());
	}
}

bool Action::isEnabled() const {
	return true;
}

not_null<QAction*> Action::action() const {
	return _dummyAction;
}

QPoint Action::prepareRippleStartPosition() const {
	return mapFromGlobal(QCursor::pos());
}

QImage Action::prepareRippleMask() const {
	return Ui::RippleAnimation::RectMask(size());
}

int Action::contentHeight() const {
	return _height;
}

void Action::handleKeyPress(not_null<QKeyEvent*> e) {
	if (!isSelected()) {
		return;
	}
	const auto key = e->key();
	if (key == Qt::Key_Enter || key == Qt::Key_Return) {
		setClicked(Ui::Menu::TriggeredSource::Keyboard);
	}
}

void Action::setChecked(bool checked) {
	if (_checked != checked) {
		_checked = checked;
		update();
	}
}

} // namespace

FixedHashtagSearchQuery FixHashtagSearchQuery(
		const QString &query,
		int cursorPosition,
		HashOrCashtag tag) {
	const auto trimmed = query.trimmed();
	const auto hash = int(trimmed.isEmpty()
		? query.size()
		: query.indexOf(trimmed));
	const auto start = std::min(cursorPosition, hash);
	const auto first = QChar(tag == HashOrCashtag::Cashtag ? '$' : '#');
	auto result = query.mid(0, start);
	for (const auto &ch : query.mid(start)) {
		if (ch.isSpace()) {
			if (cursorPosition > result.size()) {
				--cursorPosition;
			}
			continue;
		} else if (result.size() == start) {
			result += first;
			if (ch != first) {
				++cursorPosition;
			}
		}
		if (ch != first) {
			result += ch;
		}
	}
	if (result.size() == start) {
		result += first;
		++cursorPosition;
	}
	return { result, cursorPosition };
}

HashOrCashtag IsHashOrCashtagSearchQuery(const QString &query) {
	const auto trimmed = query.trimmed();
	const auto first = trimmed.isEmpty() ? QChar() : trimmed[0];
	if (first == '#') {
		for (const auto &ch : trimmed) {
			if (ch.isSpace()) {
				return HashOrCashtag::None;
			}
		}
		return HashOrCashtag::Hashtag;
	} else if (first == '$') {
		for (auto it = trimmed.begin() + 1; it != trimmed.end(); ++it) {
			if ((*it) < 'A' || (*it) > 'Z') {
				return HashOrCashtag::None;
			}
		}
		return HashOrCashtag::Cashtag;
	}
	return HashOrCashtag::None;
}

void ChatSearchIn::Section::update() {
	outer->update();
}

ChatSearchIn::ChatSearchIn(QWidget *parent)
: RpWidget(parent) {
	_in.clicks.events() | rpl::on_next([=] {
		showMenu();
	}, lifetime());
	_messageTypesSection.clicks.events() | rpl::on_next([=] {
		showMessageTypesMenu();
	}, lifetime());
}

ChatSearchIn::~ChatSearchIn() = default;

void ChatSearchIn::apply(
		std::vector<PossibleTab> tabs,
		ChatSearchTab active,
		ChatSearchPeerTabType peerTabType,
		std::shared_ptr<Ui::DynamicImage> fromUserpic,
		QString fromName,
		bool messageTypesAvailable,
		bool multipleMessageTypesAllowed,
		MessageSearchTypes messageTypes) {
	_tabs = std::move(tabs);
	_peerTabType = peerTabType;
	_active = active;
	const auto i = ranges::find(_tabs, active, &PossibleTab::tab);
	Assert(i != end(_tabs));
	Assert(i->icon != nullptr);
	updateSection(
		&_in,
		i->icon->clone(),
		tr::semibold(TabLabel(active, peerTabType)));

	auto text = tr::lng_dlg_search_from(
		tr::now,
		lt_user,
		tr::semibold(fromName),
		tr::marked);
	updateSection(&_from, std::move(fromUserpic), std::move(text));
	_messageTypesAvailable = messageTypesAvailable;
	_multipleMessageTypesAllowed = multipleMessageTypesAllowed;
	_messageTypes = _messageTypesAvailable ? messageTypes : 0;
	updateMessageTypesSection();

	resizeToWidth(width());
}

rpl::producer<> ChatSearchIn::cancelInRequests() const {
	return _in.cancelRequests.events();
}

rpl::producer<> ChatSearchIn::cancelFromRequests() const {
	return _from.cancelRequests.events();
}

rpl::producer<> ChatSearchIn::changeFromRequests() const {
	return _from.clicks.events();
}

rpl::producer<MessageSearchTypes> ChatSearchIn::messageTypesChanges() const {
	return _messageTypesChanges.events();
}

rpl::producer<ChatSearchTab> ChatSearchIn::tabChanges() const {
	return _active.changes();
}

void ChatSearchIn::showMenu() {
	_messageTypesMenuRefresh.clear();
	_menu = base::make_unique_q<Ui::PopupMenu>(
		this,
		st::dialogsSearchInMenu);
	const auto active = _active.current();
	auto activeIndex = 0;
	for (const auto &tab : _tabs) {
		if (!tab.icon) {
			continue;
		}
		const auto value = tab.tab;
		if (value == active) {
			activeIndex = _menu->actions().size();
		}
		auto action = base::make_unique_q<Action>(
			_menu.get(),
			tab.icon,
			TabLabel(value, _peerTabType),
			(value == active));
		action->setActionTriggered([=] {
			_active = value;
		});
		_menu->addAction(std::move(action));
	}
	const auto count = int(_menu->actions().size());
	const auto bottomLeft = (activeIndex * 2 >= count);
	const auto single = st::dialogsSearchInHeight;
	const auto in = mapToGlobal(_in.outer->pos()
		+ QPoint(0, bottomLeft ? count * single : 0));
	_menu->setForcedOrigin(bottomLeft
		? Ui::PanelAnimation::Origin::BottomLeft
		: Ui::PanelAnimation::Origin::TopLeft);
	if (_menu->prepareGeometryFor(in)) {
		_menu->move(_menu->pos() - QPoint(_menu->inner().x(), activeIndex * single));
		_menu->popupPrepared();
	}
}

void ChatSearchIn::showMessageTypesMenu() {
	if (!_messageTypesSection.outer) {
		return;
	}
	_messageTypesMenuRefresh.clear();
	_menu = base::make_unique_q<Ui::PopupMenu>(
		this,
		st::dialogsSearchInMenu);
	const auto add = [&](QString label, std::optional<MessageSearchType> type) {
		auto action = base::make_unique_q<Action>(
			_menu.get(),
			type
				? Ui::MakeIconThumbnail(MessageSearchTypeIcon(*type))
				: MakeTagFilterThumbnail(),
			label,
			type
				? bool(_messageTypes & MessageSearchTypeBit(*type))
				: !_messageTypes);
		const auto raw = action.get();
		raw->setPreventClose(true);
		raw->setActionTriggered([=] {
			if (!type) {
				setMessageTypes(0);
			} else {
				const auto bit = MessageSearchTypeBit(*type);
				setMessageTypes(_multipleMessageTypesAllowed
					? ((_messageTypes & bit)
						? (_messageTypes & ~bit)
						: (_messageTypes | bit))
					: bit);
			}
		});
		_messageTypesMenuRefresh.push_back([=](MessageSearchTypes types) {
			raw->setChecked(type
				? bool(types & MessageSearchTypeBit(*type))
				: !types);
		});
		_menu->addAction(std::move(action));
	};
	add(tr::lng_forum_all_messages(tr::now), std::nullopt);
	for (const auto type : MessageSearchTypeList()) {
		if (_peerTabType != ChatSearchPeerTabType::Group
			&& type == MessageSearchType::Mention) {
			continue;
		}
		add(MessageSearchTypeLabel(type), type);
	}
	const auto point = mapToGlobal(
		_messageTypesSection.outer->pos()
		+ QPoint(0, _messageTypesSection.outer->height()));
	_menu->popup(point);
}

void ChatSearchIn::setMessageTypes(MessageSearchTypes types) {
	if (_messageTypes == types) {
		return;
	}
	_messageTypes = types;
	_messageTypesChanges.fire_copy(types);
	refreshMessageTypesMenu();
}

void ChatSearchIn::updateMessageTypesSection() {
	updateSection(
		&_messageTypesSection,
		_messageTypesAvailable
			? MakeTagFilterThumbnail()
			: nullptr,
		tr::semibold(MessageSearchTypesLabel(_messageTypes)),
		false);
}

void ChatSearchIn::refreshMessageTypesMenu() {
	for (const auto &refresh : _messageTypesMenuRefresh) {
		refresh(_messageTypes);
	}
}

void ChatSearchIn::paintEvent(QPaintEvent *e) {
	auto p = Painter(this);
	const auto top = QRect(0, 0, width(), st::searchedBarHeight);
	p.fillRect(top, st::searchedBarBg);
	p.fillRect(rect().translated(0, st::searchedBarHeight), st::dialogsBg);

	p.setFont(st::searchedBarFont);
	p.setPen(st::searchedBarFg);
	p.drawTextLeft(
		st::searchedBarPosition.x(),
		st::searchedBarPosition.y(),
		width(),
		tr::lng_dlg_search_in(tr::now));
}

int ChatSearchIn::resizeGetHeight(int newWidth) {
	auto result = st::searchedBarHeight;
	if (const auto raw = _in.outer.get()) {
		raw->resizeToWidth(newWidth);
		raw->move(0, result);
		result += raw->height();
		_in.shadow->setGeometry(0, result, newWidth, st::lineWidth);
		result += st::lineWidth;
	}
	if (const auto raw = _from.outer.get()) {
		raw->resizeToWidth(newWidth);
		raw->move(0, result);
		result += raw->height();
		_from.shadow->setGeometry(0, result, newWidth, st::lineWidth);
		result += st::lineWidth;
	}
	if (const auto raw = _messageTypesSection.outer.get()) {
		raw->resizeToWidth(newWidth);
		raw->move(0, result);
		result += raw->height();
		_messageTypesSection.shadow->setGeometry(
			0,
			result,
			newWidth,
			st::lineWidth);
		result += st::lineWidth;
	}
	return result;
}

void ChatSearchIn::updateSection(
		not_null<Section*> section,
		std::shared_ptr<Ui::DynamicImage> image,
		TextWithEntities text,
		bool cancelable) {
	if (section->subscribed) {
		section->image->subscribeToUpdates(nullptr);
		section->subscribed = false;
	}
	if (!image) {
		if (section->outer) {
			section->cancel = nullptr;
			section->shadow = nullptr;
			section->outer = nullptr;
			section->subscribed = false;
		}
		return;
	} else if (!section->outer) {
		auto button = std::make_unique<Ui::AbstractButton>(this);
		const auto raw = button.get();
		section->outer = std::move(button);

		raw->resize(
			st::columnMinimalWidthLeft,
			st::dialogsSearchInHeight);

		raw->paintRequest() | rpl::on_next([=] {
			auto p = QPainter(raw);
			if (!section->subscribed) {
				section->subscribed = true;
				section->image->subscribeToUpdates([=] {
					raw->update();
				});
			}
			const auto outer = raw->width();
			const auto size = st::dialogsSearchInPhotoSize;
			const auto left = st::dialogsSearchInPhotoPadding;
			const auto top = (st::dialogsSearchInHeight - size) / 2;
			p.drawImage(
				QRect{ left, top, size, size },
				section->image->image(size));

			const auto x = left + size + st::dialogsSearchInSkip;
			const auto cancelWidth = section->cancel
				? section->cancel->width()
				: 0;
			const auto available = outer
				- st::dialogsSearchInSkip
				- cancelWidth
				- 2 * st::dialogsSearchInDownSkip
				- st::dialogsSearchInDown.width()
				- x;
			const auto use = std::min(section->text.maxWidth(), available);
			const auto iconx = x + use + st::dialogsSearchInDownSkip;
			const auto icony = st::dialogsSearchInDownTop;
			st::dialogsSearchInDown.paint(p, iconx, icony, outer);
			p.setPen(st::windowBoldFg);
			section->text.draw(p, {
				.position = QPoint(x, st::dialogsSearchInNameTop),
				.outerWidth = outer,
				.availableWidth = available,
				.elisionLines = 1,
			});
		}, raw->lifetime());

		section->shadow = std::make_unique<Ui::PlainShadow>(this);
		section->shadow->show();

		if (cancelable) {
			const auto st = &st::dialogsCancelSearchInPeer;
			section->cancel = std::make_unique<Ui::IconButton>(raw, *st);
			section->cancel->setAccessibleName(tr::lng_cancel(tr::now));
			section->cancel->show();
			raw->sizeValue() | rpl::on_next([=](QSize size) {
				const auto left = size.width() - section->cancel->width();
				const auto top = (size.height() - st->height) / 2;
				section->cancel->moveToLeft(left, top);
			}, section->cancel->lifetime());
			section->cancel->clicks(
			) | rpl::to_empty | rpl::start_to_stream(
				section->cancelRequests,
				section->cancel->lifetime());
		}

		raw->clicks() | rpl::to_empty | rpl::start_to_stream(
			section->clicks,
			raw->lifetime());

		raw->show();
	}
	section->image = std::move(image);
	section->text.setMarkedText(st::dialogsSearchFromStyle, std::move(text));
	section->update();
}

} // namespace Dialogs
