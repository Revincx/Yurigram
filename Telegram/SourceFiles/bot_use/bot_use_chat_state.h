#pragma once

#include "bot_use/bot_use_types.h"

#include <map>
#include <optional>
#include <rpl/event_stream.h>
#include <rpl/lifetime.h>
#include <set>

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
	[[nodiscard]] std::optional<std::set<UserId>> cachedMembers(
		PeerId peer) const;
	void cacheMembers(PeerId peer, std::set<UserId> users);
	void invalidateMembers(PeerId peer);

private:
	struct MembersCache {
		std::set<UserId> users;
		crl::time expiresAt = 0;
	};

	void prune();

	Main::Session *_session = nullptr;
	Manager *_manager = nullptr;
	std::map<PeerId, ChatChoice> _choices;
	std::map<PeerId, MembersCache> _members;
	rpl::event_stream<PeerId> _changes;
	rpl::lifetime _lifetime;

};

} // namespace BotUse
