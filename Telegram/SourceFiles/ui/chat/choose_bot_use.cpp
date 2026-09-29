#include "ui/chat/choose_bot_use.h"

#include "api/api_chat_participants.h"
#include "bot_use/bot_use_chat_state.h"
#include "bot_use/bot_use_manager.h"
#include "boxes/peer_list_box.h"
#include "chat_helpers/compose/compose_show.h"
#include "data/data_channel.h"
#include "data/data_peer_values.h"
#include "data/data_session.h"
#include "data/data_user.h"
#include "lang/lang_keys.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "mtproto/sender.h"
#include "ui/controls/choose_bot_use_button.h"
#include "ui/layers/generic_box.h"
#include "ui/widgets/buttons.h"
#include "ui/widgets/labels.h"
#include "styles/style_calls.h"
#include "styles/style_chat_helpers.h"

namespace Ui {
namespace {

constexpr auto kParticipantsPage = 100;

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

class Row final : public PeerListRow {
public:
	Row(not_null<PeerData*> peer, BotUse::BotId bot)
	: PeerListRow(peer)
	, bot(bot) {
	}

	const BotUse::BotId bot = 0;

};

class ListController final : public PeerListController {
public:
	explicit ListController(not_null<ChannelData*> channel)
	: _channel(channel) {
	}

	Main::Session &session() const override {
		return _channel->session();
	}

	void prepare() override {
		delegate()->peerListSetSearchMode(PeerListSearchMode::Disabled);
		auto row = std::make_unique<Row>(session().user(), 0);
		row->setCustomStatus(tr::lng_group_call_join_as_personal(tr::now));
		_personal = row.get();
		delegate()->peerListAppendRow(std::move(row));
		if (!session().botUseChats().choice(_channel->id).enabled) {
			delegate()->peerListSetRowChecked(_personal, true);
			_personal->finishCheckedAnimation();
		}
		delegate()->peerListRefreshRows();
	}

	void rowClicked(not_null<PeerListRow*> row) override {
		_clicked.fire_copy(static_cast<Row*>(row.get())->bot);
	}

	[[nodiscard]] rpl::producer<BotUse::BotId> clicked() const {
		return _clicked.events();
	}

	void setMembers(std::map<UserId, not_null<UserData*>> members) {
		_members = std::move(members);
		refresh();
	}

	[[nodiscard]] bool contains(BotUse::BotId bot) const {
		return _rows.contains(bot);
	}

	[[nodiscard]] bool empty() const {
		return _rows.empty();
	}

	[[nodiscard]] BotUse::BotInfo info(BotUse::BotId bot) const {
		for (const auto &info : session().domain().botUse().bots()) {
			if (info.id == bot) {
				return info;
			}
		}
		return {};
	}

	void syncChoice() {
		const auto choice = session().botUseChats().choice(_channel->id);
		delegate()->peerListSetRowChecked(_personal, !choice.enabled);
		for (const auto &[id, row] : _rows) {
			delegate()->peerListSetRowChecked(row, choice.enabled && id == choice.bot);
		}
	}

	void refresh() {
		auto desired = std::vector<std::pair<BotUse::BotInfo, not_null<UserData*>>>();
		for (const auto &info : session().domain().botUse().bots()) {
			const auto i = _members.find(info.userId);
			if (i != end(_members)
				&& info.environment == session().mtp().environment()) {
				desired.emplace_back(info, i->second);
			}
		}
		auto ids = std::vector<BotUse::BotId>();
		for (const auto &entry : desired) {
			ids.push_back(entry.first.id);
		}
		if (ids != _ids) {
			for (const auto &[id, row] : _rows) {
				delegate()->peerListRemoveRow(row);
			}
			_rows.clear();
			_ids = std::move(ids);
			for (const auto &[info, user] : desired) {
				auto row = std::make_unique<Row>(user, info.id);
				row->setCustomStatus(StateText(info.state));
				const auto raw = row.get();
				delegate()->peerListAppendRow(std::move(row));
				_rows.emplace(info.id, raw);
				if (session().botUseChats().choice(_channel->id).bot == info.id) {
					delegate()->peerListSetRowChecked(raw, true);
					raw->finishCheckedAnimation();
				}
			}
			delegate()->peerListRefreshRows();
		} else {
			for (const auto &entry : desired) {
				const auto &info = entry.first;
				const auto row = _rows.at(info.id);
				row->setCustomStatus(StateText(info.state));
				delegate()->peerListUpdateRow(row);
			}
		}
	}

private:
	const not_null<ChannelData*> _channel;
	Row *_personal = nullptr;
	std::map<UserId, not_null<UserData*>> _members;
	std::map<BotUse::BotId, Row*> _rows;
	std::vector<BotUse::BotId> _ids;
	rpl::event_stream<BotUse::BotId> _clicked;

};

void ChooseBotUseBox(
		not_null<GenericBox*> box,
		not_null<ChannelData*> channel) {
	const auto &st = st::defaultChooseSendAs;
	box->setWidth(st::groupCallJoinAsWidth);
	box->setTitle(tr::lng_bot_use_choose());
	const auto status = box->lifetime().make_state<rpl::variable<QString>>(
		tr::lng_bot_use_loading(tr::now));
	box->addRow(object_ptr<FlatLabel>(box, status->value(), st.label));

	auto &lifetime = box->lifetime();
	const auto boxLife = &lifetime;
	const auto delegate = lifetime.make_state<PeerListContentDelegateSimple>();
	const auto controller = lifetime.make_state<ListController>(channel);
	controller->setStyleOverrides(&st.list, nullptr);
	const auto content = box->addRow(
		object_ptr<PeerListContent>(box, controller),
		style::margins());
	delegate->setContent(content);
	controller->setDelegate(delegate);
	const auto retry = box->addRow(object_ptr<LinkButton>(
		box,
		tr::lng_bot_download_retry(tr::now)));
	retry->hide();

	const auto manager = &channel->session().domain().botUse();
	const auto state = &channel->session().botUseChats();
	const auto operation = lifetime.make_state<BotUse::OperationId>(0);
	box->boxClosing() | rpl::on_next([=] {
		if (*operation) {
			manager->cancel(*operation);
		}
	}, lifetime);
	controller->clicked() | rpl::on_next([=](BotUse::BotId bot) {
		if (*operation) {
			return;
		} else if (!bot) {
			state->clear(channel->id);
			box->closeBox();
			return;
		} else if (!controller->contains(bot)) {
			return;
		}
		const auto info = controller->info(bot);
		if (info.state == BotUse::State::Ready) {
			state->choose(channel->id, bot);
			box->closeBox();
			return;
		}
		*operation = manager->authenticate(bot, crl::guard(box, [=](
				const BotUse::Result &result) {
			*operation = 0;
			if (result.state == BotUse::OperationState::Completed
				&& controller->contains(bot)
				&& controller->info(bot).state == BotUse::State::Ready) {
				state->choose(channel->id, bot);
				box->closeBox();
			} else {
				*status = tr::lng_bot_use_error(
					tr::now,
					lt_error,
					result.error.type);
			}
		}));
	}, lifetime);
	manager->changes() | rpl::on_next([=] {
		controller->refresh();
	}, lifetime);
	state->changes() | rpl::filter([=](PeerId peer) {
		return peer == channel->id;
	}) | rpl::on_next([=] {
		controller->syncChoice();
	}, lifetime);
	const auto applyMembers = [=](const std::set<UserId> &ids) {
		auto members = std::map<UserId, not_null<UserData*>>();
		for (const auto id : ids) {
			if (const auto user = channel->session().data().userLoaded(id)) {
				members.emplace(id, not_null{ user });
			}
		}
		controller->setMembers(std::move(members));
		const auto choice = state->choice(channel->id);
		if (choice.enabled && !controller->contains(choice.bot)) {
			state->clear(channel->id);
		}
		*status = controller->empty()
			? tr::lng_bot_use_no_chat_bots(tr::now)
			: tr::lng_bot_use_choose_about(tr::now);
	};

	const auto api = lifetime.make_state<MTP::Sender>(&channel->session().mtp());
	const auto request = lifetime.make_state<mtpRequestId>(0);
	const auto offset = lifetime.make_state<int>(0);
	const auto members = lifetime.make_state<std::set<UserId>>();
	const auto reload = lifetime.make_state<Fn<void()>>();
	*reload = [=] {
		if (*request) {
			api->request(base::take(*request)).cancel();
		}
		*offset = 0;
		members->clear();
		controller->setMembers({});
		*status = tr::lng_bot_use_loading(tr::now);
		retry->hide();
		const auto page = boxLife->make_state<Fn<void()>>();
		*page = [=] {
			*request = api->request(MTPchannels_GetParticipants(
				channel->inputChannel(),
				channel->isMegagroup()
					? MTPChannelParticipantsFilter(MTP_channelParticipantsBots())
					: MTPChannelParticipantsFilter(MTP_channelParticipantsAdmins()),
				MTP_int(*offset),
				MTP_int(kParticipantsPage),
				MTP_long(0)
			)).done([=](const MTPchannels_ChannelParticipants &result) {
				*request = 0;
				result.match([&](const MTPDchannels_channelParticipants &data) {
					channel->owner().processUsers(data.vusers());
					const auto count = int(data.vparticipants().v.size());
					for (const auto &participant : data.vparticipants().v) {
						const auto parsed = Api::ChatParticipant(
							participant,
							channel);
						if (parsed.isUser()) {
							const auto id = parsed.userId();
							const auto user = channel->session().data().userLoaded(id);
							if (user && user->isBot()) {
								members->insert(id);
							}
						}
					}
					*offset += count;
					if (count > 0 && *offset < data.vcount().v) {
						(*page)();
					} else {
						state->cacheMembers(channel->id, *members);
						applyMembers(*members);
					}
				}, [&](const MTPDchannels_channelParticipantsNotModified &) {
					*status = tr::lng_bot_use_load_error(tr::now);
					retry->show();
				});
			}).fail([=](const MTP::Error &error) {
				*request = 0;
				*status = tr::lng_bot_use_error(
					tr::now,
					lt_error,
					error.type());
				retry->show();
			}).handleAllErrors().send();
		};
		(*page)();
	};
	retry->addClickHandler([=] { (*reload)(); });
	const auto cached = state->cachedMembers(channel->id);
	const auto loaded = cached && ranges::all_of(*cached, [=](UserId id) {
		return channel->session().data().userLoaded(id) != nullptr;
	});
	if (loaded) {
		applyMembers(*cached);
	} else {
		(*reload)();
	}
	box->addButton(tr::lng_box_done(), [=] { box->closeBox(); });
}

} // namespace

bool CanChooseBotUse(not_null<PeerData*> peer) {
	const auto channel = peer->asChannel();
	return channel && (channel->isMegagroup() || channel->isBroadcast());
}

void ShowChooseBotUse(
		not_null<PeerData*> peer,
		std::shared_ptr<ChatHelpers::Show> show) {
	const auto channel = peer->asChannel();
	if (channel && CanChooseBotUse(peer)) {
		show->show(Box(ChooseBotUseBox, not_null{ channel }));
	}
}

void SetupChooseBotUseButton(
		not_null<ChooseBotUseButton*> button,
		not_null<PeerData*> peer,
		std::shared_ptr<ChatHelpers::Show> show) {
	button->setClickedCallback([=] { ShowChooseBotUse(peer, show); });
	const auto choice = peer->session().botUseChats().choice(peer->id);
	for (const auto &info : peer->session().domain().botUse().bots()) {
		if (info.id == choice.bot && info.userId) {
			const auto user = peer->session().data().user(info.userId);
			Data::PeerUserpicImageValue(
				user,
				st::defaultChooseSendAs.button.size
					* style::DevicePixelRatio()
			) | rpl::on_next([=](QImage &&image) {
				button->setUserpic(std::move(image));
			}, button->lifetime());
			break;
		}
	}
}

} // namespace Ui
