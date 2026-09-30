#pragma once

#include "bot_use/bot_use_types.h"
#include "data/data_message_reaction_id.h"

#include <map>
#include <optional>
#include <rpl/event_stream.h>
#include <rpl/lifetime.h>
#include <set>
#include <tuple>

namespace Main {
class Session;
} // namespace Main

namespace BotUse {

class Manager;

struct ChatChoice {
	bool enabled = false;
	BotId bot = 0;

	friend bool operator==(ChatChoice, ChatChoice) = default;
};

class ChatState final {
public:
	ChatState() = default;
	void bind(
		not_null<Main::Session*> session,
		not_null<Manager*> manager);

	[[nodiscard]] ChatChoice choice(PeerId peer) const;
	void choose(PeerId peer, BotId bot);
	void clear(PeerId peer);
	[[nodiscard]] rpl::producer<PeerId> changes() const;
	[[nodiscard]] std::optional<std::vector<Data::ReactionId>> reactionChoices(
		BotId bot,
		FullMsgId message) const;
	[[nodiscard]] std::vector<std::pair<UserId, std::vector<Data::ReactionId>>>
	reactionActors(FullMsgId message) const;
	void setReactionChoices(
		BotId bot,
		FullMsgId message,
		std::vector<Data::ReactionId> choices);
	void forgetReactionChoices(BotId bot, FullMsgId message);
	[[nodiscard]] std::optional<std::set<UserId>> cachedMembers(
		PeerId peer) const;
	void cacheMembers(PeerId peer, std::set<UserId> users);
	void invalidateMembers(PeerId peer);
	void beginSend(FullMsgId local, UserId bot);
	[[nodiscard]] bool deferIncoming(const MTPMessage &message);
	void finishSend(FullMsgId local, FullMsgId remote = {});
	void bindRichDraft(
		PeerId peer,
		MsgId topicRootId,
		PeerId monoforumPeerId,
		BotId bot);
	[[nodiscard]] std::optional<BotId> richDraftBot(
		PeerId peer,
		MsgId topicRootId,
		PeerId monoforumPeerId) const;
	void clearRichDraft(
		PeerId peer,
		MsgId topicRootId,
		PeerId monoforumPeerId);

private:
	struct MembersCache {
		std::set<UserId> users;
		crl::time expiresAt = 0;
	};
	struct PendingSend {
		FullMsgId local;
		UserId bot;
	};
	struct PendingChat {
		std::vector<PendingSend> sends;
		std::vector<MTPMessage> deferred;
	};

	void prune();

	Main::Session *_session = nullptr;
	Manager *_manager = nullptr;
	std::map<PeerId, ChatChoice> _choices;
	std::map<std::pair<BotId, FullMsgId>, std::vector<Data::ReactionId>> _reactions;
	std::map<PeerId, MembersCache> _members;
	std::map<PeerId, PendingChat> _pending;
	std::map<std::tuple<PeerId, MsgId, PeerId>, BotId> _richDraftBots;
	rpl::event_stream<PeerId> _changes;
	rpl::lifetime _lifetime;

};

} // namespace BotUse
