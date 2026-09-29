#include "bot_use/bot_use_chat_state.h"

#include "bot_use/bot_use_manager.h"
#include "data/data_changes.h"
#include "data/data_peer.h"
#include "main/main_session.h"

namespace BotUse {
namespace {

constexpr auto kMembersCacheDuration = 5 * crl::time(60 * 1000);

} // namespace

void ChatState::bind(
		not_null<Main::Session*> session,
		not_null<Manager*> manager) {
	if (_session == session && _manager == manager) {
		return;
	}
	_lifetime.destroy();
	_session = session;
	_manager = manager;
	manager->changes(
	) | rpl::on_next([=] { prune(); }, _lifetime);
	session->changes().peerUpdates(
		Data::PeerUpdate::Flag::Members
		| Data::PeerUpdate::Flag::Admins
		| Data::PeerUpdate::Flag::ChannelAmIn
	) | rpl::on_next([=](const Data::PeerUpdate &update) {
		invalidateMembers(update.peer->id);
	}, _lifetime);
	prune();
}

ChatChoice ChatState::choice(PeerId peer) const {
	const auto i = _choices.find(peer);
	return (i == end(_choices)) ? ChatChoice() : i->second;
}

void ChatState::choose(PeerId peer, BotId bot) {
	if (!bot || choice(peer) == ChatChoice{ true, bot }) {
		return;
	}
	_choices[peer] = { true, bot };
	_changes.fire_copy(peer);
}

void ChatState::clear(PeerId peer) {
	if (_choices.erase(peer)) {
		_changes.fire_copy(peer);
	}
}

rpl::producer<PeerId> ChatState::changes() const {
	return _changes.events();
}

std::optional<std::set<UserId>> ChatState::cachedMembers(
		PeerId peer) const {
	const auto i = _members.find(peer);
	return (i != end(_members) && crl::now() < i->second.expiresAt)
		? std::optional(i->second.users)
		: std::nullopt;
}

void ChatState::cacheMembers(PeerId peer, std::set<UserId> users) {
	_members[peer] = {
		.users = std::move(users),
		.expiresAt = crl::now() + kMembersCacheDuration,
	};
}

void ChatState::invalidateMembers(PeerId peer) {
	_members.erase(peer);
}

void ChatState::prune() {
	const auto bots = _manager->bots();
	for (auto i = _choices.begin(); i != _choices.end();) {
		if (ranges::contains(bots, i->second.bot, &BotInfo::id)) {
			++i;
		} else {
			const auto peer = i->first;
			i = _choices.erase(i);
			_changes.fire_copy(peer);
		}
	}
}

} // namespace BotUse
