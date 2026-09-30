#include "bot_use/bot_use_chat_state.h"

#include "bot_use/bot_use_manager.h"
#include "data/data_changes.h"
#include "data/data_channel.h"
#include "data/data_peer.h"
#include "data/data_session.h"
#include "history/history.h"
#include "main/main_session.h"

namespace BotUse {
namespace {

constexpr auto kMembersCacheDuration = 5 * crl::time(60 * 1000);

void ClearDraftNoForwards(
		not_null<Main::Session*> session,
		PeerId peer) {
	const auto history = session->data().historyLoaded(peer);
	if (!history) {
		return;
	}
	auto empty = std::vector<Data::DraftKey>();
	for (const auto &[key, draft] : history->draftsMap()) {
		draft->noForwards = false;
		if (Data::DraftIsNull(draft.get())) {
			empty.push_back(key);
		}
	}
	for (const auto key : empty) {
		history->clearDraft(key);
	}
}

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
	changes() | rpl::on_next([=](PeerId peer) {
		if (const auto history = session->data().historyLoaded(peer)) {
			history->refreshReactionIdentity();
		}
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
		ClearDraftNoForwards(_session, peer);
		_changes.fire_copy(peer);
	}
}

rpl::producer<PeerId> ChatState::changes() const {
	return _changes.events();
}

std::optional<std::vector<Data::ReactionId>> ChatState::reactionChoices(
		BotId bot,
		FullMsgId message) const {
	const auto i = _reactions.find({ bot, message });
	return i == end(_reactions)
		? std::nullopt
		: std::make_optional(i->second);
}

std::vector<std::pair<UserId, std::vector<Data::ReactionId>>>
ChatState::reactionActors(FullMsgId message) const {
	auto result = std::vector<
		std::pair<UserId, std::vector<Data::ReactionId>>>();
	if (!_manager) {
		return result;
	}
	const auto bots = _manager->bots();
	for (const auto &[key, choices] : _reactions) {
		if (key.second != message) {
			continue;
		}
		const auto bot = ranges::find(bots, key.first, &BotInfo::id);
		if (bot != end(bots) && bot->userId) {
			result.emplace_back(bot->userId, choices);
		}
	}
	return result;
}

void ChatState::setReactionChoices(
		BotId bot,
		FullMsgId message,
		std::vector<Data::ReactionId> choices) {
	_reactions.insert_or_assign({ bot, message }, std::move(choices));
}

void ChatState::forgetReactionChoices(BotId bot, FullMsgId message) {
	_reactions.erase({ bot, message });
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

void ChatState::beginSend(FullMsgId local, UserId bot) {
	_pending[local.peer].sends.push_back({ local, bot });
}

bool ChatState::deferIncoming(const MTPMessage &message) {
	if (message.type() != mtpc_message) {
		return false;
	}
	const auto &data = message.c_message();
	const auto peer = peerFromMTP(data.vpeer_id());
	const auto i = _pending.find(peer);
	if (i == end(_pending) || i->second.sends.empty()) {
		return false;
	}
	const auto channel = _session->data().channelLoaded(peerToChannel(peer));
	const auto broadcast = channel && channel->isBroadcast();
	const auto from = data.vfrom_id()
		? peerFromMTP(*data.vfrom_id()) : PeerId();
	const auto matchingBot = ranges::contains(i->second.sends, from,
		[](const PendingSend &send) { return peerFromUser(send.bot); });
	if (!matchingBot && (!broadcast || (from && from != peer))) {
		return false;
	}
	if (!ranges::contains(i->second.deferred, data.vid().v,
			[](const MTPMessage &value) {
				return value.c_message().vid().v;
			})) {
		i->second.deferred.push_back(message);
	}
	return true;
}

void ChatState::finishSend(FullMsgId local, FullMsgId remote) {
	const auto i = _pending.find(local.peer);
	if (i == end(_pending)) {
		return;
	}
	auto &chat = i->second;
	std::erase_if(chat.sends, [&](const PendingSend &send) {
		return send.local == local;
	});
	if (remote) {
		std::erase_if(chat.deferred, [&](const MTPMessage &message) {
			return message.c_message().vid().v == remote.msg.bare;
		});
	}
	const auto channel = _session->data().channelLoaded(peerToChannel(local.peer));
	const auto broadcast = channel && channel->isBroadcast();
	auto ready = std::vector<MTPMessage>();
	std::erase_if(chat.deferred, [&](const MTPMessage &message) {
		const auto from = message.c_message().vfrom_id()
			? peerFromMTP(*message.c_message().vfrom_id()) : PeerId();
		const auto stillPending = ranges::contains(
			chat.sends, from, [](const PendingSend &send) {
				return peerFromUser(send.bot);
			}) || (broadcast && (!from || from == local.peer)
				&& !chat.sends.empty());
		if (stillPending) {
			return false;
		}
		ready.push_back(message);
		return true;
	});
	if (chat.sends.empty()) {
		_pending.erase(i);
	}
	for (const auto &message : ready) {
		const auto inserted = _session->data().addNewMessage(
			message, MessageFlags(), NewMessageType::Unread);
		if (!inserted) {
			continue;
		}
	}
}

void ChatState::bindRichDraft(
		PeerId peer,
		MsgId topicRootId,
		PeerId monoforumPeerId,
		BotId bot) {
	_richDraftBots[{ peer, topicRootId, monoforumPeerId }] = bot;
}

std::optional<BotId> ChatState::richDraftBot(
		PeerId peer,
		MsgId topicRootId,
		PeerId monoforumPeerId) const {
	const auto i = _richDraftBots.find({ peer, topicRootId, monoforumPeerId });
	return i == end(_richDraftBots)
		? std::nullopt : std::make_optional(i->second);
}

void ChatState::clearRichDraft(
		PeerId peer,
		MsgId topicRootId,
		PeerId monoforumPeerId) {
	_richDraftBots.erase({ peer, topicRootId, monoforumPeerId });
}

void ChatState::prune() {
	const auto bots = _manager->bots();
	for (auto i = _choices.begin(); i != _choices.end();) {
		if (ranges::contains(bots, i->second.bot, &BotInfo::id)) {
			++i;
		} else {
			const auto peer = i->first;
			i = _choices.erase(i);
			ClearDraftNoForwards(_session, peer);
			_changes.fire_copy(peer);
		}
	}
}

} // namespace BotUse
