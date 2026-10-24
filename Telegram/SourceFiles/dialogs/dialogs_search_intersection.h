/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#pragma once

#include "base/flat_set.h"
#include "base/weak_ptr.h"
#include "data/data_message_reaction_id.h"
#include "dialogs/dialogs_search_types.h"
#include "rpl/event_stream.h"

#include <optional>

class History;
class HistoryItem;
class PeerData;

namespace Dialogs {

[[nodiscard]] bool MatchesMessageSearchTypes(
	not_null<HistoryItem*> item,
	MessageSearchTypes selected);

[[nodiscard]] std::optional<base::flat_set<QString>> ParseStickerSearchEmojis(
	QStringView query);

[[nodiscard]] bool MatchesStickerSearchEmojis(
	not_null<HistoryItem*> item,
	const base::flat_set<QString> &emojis);

[[nodiscard]] std::optional<MessageSearchType> NativeMessageSearchType(
	MessageSearchTypes selected);

[[nodiscard]] MTPMessagesFilter NativeMessageSearchFilter(
	MessageSearchType type);

class MessageSearchIntersection final : public base::has_weak_ptr {
public:
	struct Request {
		not_null<History*> history;
		PeerData *fromPeer = nullptr;
		PeerData *savedPeer = nullptr;
		QString query;
		std::vector<Data::ReactionId> tags;
		MsgId topMsgId;
		MessageSearchType type = MessageSearchType::Photo;
		int limit = 0;
	};

	struct Page {
		std::vector<not_null<HistoryItem*>> messages;
		int matchedCount = 0;
		bool first = false;
		bool full = false;
	};

	struct Failure {
		QString type;
		bool first = false;
	};

	MessageSearchIntersection();
	~MessageSearchIntersection();

	void start(Request request);
	void searchMore();
	void cancel();

	[[nodiscard]] bool loading() const;
	[[nodiscard]] rpl::producer<Page> pages() const;
	[[nodiscard]] rpl::producer<Failure> failures() const;

private:
	struct State;
	const std::unique_ptr<State> _state;

	rpl::event_stream<Page> _pages;
	rpl::event_stream<Failure> _failures;

};

} // namespace Dialogs
