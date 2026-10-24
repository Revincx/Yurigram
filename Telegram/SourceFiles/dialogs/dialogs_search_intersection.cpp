/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "dialogs/dialogs_search_intersection.h"

#include "apiwrap.h"
#include "base/flat_set.h"
#include "data/data_channel.h"
#include "data/data_document.h"
#include "data/data_histories.h"
#include "data/data_media_types.h"
#include "data/data_peer.h"
#include "data/data_session.h"
#include "history/history.h"
#include "history/history_item.h"
#include "main/main_session.h"
#include "storage/storage_shared_media.h"
#include "ui/emoji_config.h"

namespace Dialogs {

MTPMessagesFilter NativeMessageSearchFilter(MessageSearchType type) {
	switch (type) {
	case MessageSearchType::Photo:
		return MTP_inputMessagesFilterPhotos();
	case MessageSearchType::Video:
		return MTP_inputMessagesFilterVideo();
	case MessageSearchType::File:
		return MTP_inputMessagesFilterDocument();
	case MessageSearchType::Link:
		return MTP_inputMessagesFilterUrl();
	case MessageSearchType::Music:
		return MTP_inputMessagesFilterMusic();
	case MessageSearchType::Voice:
		return MTP_inputMessagesFilterVoice();
	case MessageSearchType::RoundVideo:
		return MTP_inputMessagesFilterRoundVideo();
	case MessageSearchType::Gif:
		return MTP_inputMessagesFilterGif();
	case MessageSearchType::Poll:
		return MTP_inputMessagesFilterPoll();
	case MessageSearchType::Mention:
		return MTP_inputMessagesFilterMyMentions();
	case MessageSearchType::Location:
		return MTP_inputMessagesFilterGeo();
	case MessageSearchType::Pinned:
		return MTP_inputMessagesFilterPinned();
	case MessageSearchType::Sticker:
	case MessageSearchType::kCount:
		break;
	}
	Unexpected("MessageSearchType in NativeMessageSearchFilter.");
}

namespace {

[[nodiscard]] bool MatchesSender(
		not_null<HistoryItem*> item,
		PeerData *fromPeer,
		PeerData *savedPeer) {
	return savedPeer
		? (item->sublistPeerId() == savedPeer->id)
		: fromPeer && (item->from()->id == fromPeer->id);
}

} // namespace

bool MatchesMessageSearchTypes(
		not_null<HistoryItem*> item,
		MessageSearchTypes selected) {
	if (!selected) {
		return true;
	}
	using Shared = Storage::SharedMediaType;
	const auto shared = item->sharedMediaTypes();
	const auto matches = [&](MessageSearchType type, Shared value) {
		return (selected & MessageSearchTypeBit(type))
			&& shared.test(value);
	};
	const auto media = item->media();
	const auto document = media ? media->document() : nullptr;
	return matches(MessageSearchType::Photo, Shared::Photo)
		|| matches(MessageSearchType::Video, Shared::Video)
		|| matches(MessageSearchType::File, Shared::File)
		|| matches(MessageSearchType::Link, Shared::Link)
		|| matches(MessageSearchType::Music, Shared::MusicFile)
		|| matches(MessageSearchType::Voice, Shared::VoiceFile)
		|| matches(MessageSearchType::RoundVideo, Shared::RoundFile)
		|| ((selected & MessageSearchTypeBit(MessageSearchType::Sticker))
			&& document
			&& document->sticker())
		|| matches(MessageSearchType::Gif, Shared::GIF)
		|| matches(MessageSearchType::Poll, Shared::Poll)
		|| matches(MessageSearchType::Pinned, Shared::Pinned)
		|| ((selected & MessageSearchTypeBit(MessageSearchType::Mention))
			&& item->mentionsMe())
		|| ((selected & MessageSearchTypeBit(MessageSearchType::Location))
			&& media
			&& media->location());
}

std::optional<base::flat_set<QString>> ParseStickerSearchEmojis(
		QStringView query) {
	auto normalized = query.toString();
	normalized.replace(QChar(0xFE0E), QChar(Ui::Emoji::kPostfix));
	auto result = base::flat_set<QString>();
	auto ch = normalized.constData();
	const auto end = ch + normalized.size();
	while (ch != end) {
		if (ch->isSpace()) {
			++ch;
			continue;
		}
		auto length = 0;
		auto emoji = Ui::Emoji::Find(ch, end, &length);
		if (!emoji) {
			const auto codepointLength = (ch->isHighSurrogate()
				&& ch + 1 != end
				&& (ch + 1)->isLowSurrogate())
				? 2
				: 1;
			const auto symbol = QString(ch, codepointLength)
				+ QChar(Ui::Emoji::kPostfix);
			emoji = Ui::Emoji::Find(symbol);
			length = codepointLength;
		}
		if (!emoji) {
			return std::nullopt;
		}
		result.emplace(emoji->id());
		ch += length;
	}
	return result;
}

bool MatchesStickerSearchEmojis(
		not_null<HistoryItem*> item,
		const base::flat_set<QString> &emojis) {
	const auto media = item->media();
	const auto document = media ? media->document() : nullptr;
	const auto sticker = document ? document->sticker() : nullptr;
	if (!sticker) {
		return false;
	} else if (emojis.empty()) {
		return true;
	}
	const auto alt = ParseStickerSearchEmojis(sticker->alt);
	return alt && ranges::any_of(*alt, [&](const QString &emoji) {
		return emojis.contains(emoji);
	});
}

std::optional<MessageSearchType> NativeMessageSearchType(
		MessageSearchTypes selected) {
	if (!selected || (selected & (selected - 1))) {
		return std::nullopt;
	}
	for (auto i = 0; i != static_cast<int>(MessageSearchType::kCount); ++i) {
		const auto type = static_cast<MessageSearchType>(i);
		if (!(selected & MessageSearchTypeBit(type))) {
			continue;
		}
		switch (type) {
		case MessageSearchType::Photo:
		case MessageSearchType::Video:
		case MessageSearchType::File:
		case MessageSearchType::Link:
		case MessageSearchType::Music:
		case MessageSearchType::Voice:
		case MessageSearchType::RoundVideo:
		case MessageSearchType::Gif:
		case MessageSearchType::Poll:
		case MessageSearchType::Mention:
		case MessageSearchType::Location:
		case MessageSearchType::Pinned:
			return type;
		case MessageSearchType::Sticker:
		case MessageSearchType::kCount:
			return std::nullopt;
		}
	}
	return std::nullopt;
}

struct MessageSearchIntersection::State {
	enum class Leg {
		Sender,
		Type,
	};

	struct LoadedPage {
		std::vector<not_null<HistoryItem*>> messages;
		int total = 0;
		int rawCount = 0;
		MsgId lastId;
		bool complete = false;
	};

	struct LegState {
		std::optional<LoadedPage> first;
		MsgId offsetId;
		int historyRequestId = 0;
		int received = 0;
		int total = 0;
		bool full = false;
	};

	explicit State(not_null<MessageSearchIntersection*> owner)
	: owner(owner) {
	}

	void start(Request value) {
		cancel();
		Expects(value.fromPeer != nullptr || value.savedPeer != nullptr);
		Expects(value.limit > 0);
		Expects(NativeMessageSearchType(
			MessageSearchTypeBit(value.type)).has_value());
		request.emplace(std::move(value));
		loading = true;
		full = false;
		send(Leg::Sender, true);
		send(Leg::Type, true);
	}

	void searchMore() {
		if (!request || !driver || loading || full) {
			return;
		}
		loading = true;
		send(*driver, false);
	}

	void cancel() {
		++generation;
		cancelRequests();
		request.reset();
		sender = {};
		type = {};
		driver.reset();
		seen.clear();
		matchedCount = 0;
		loading = false;
		full = false;
	}

	void send(Leg which, bool first) {
		Expects(request.has_value());
		auto &state = leg(which);
		Expects(!state.historyRequestId);
		const auto current = generation;
		const auto copy = *request;
		const auto offsetId = first ? MsgId() : state.offsetId;
		const auto weak = base::make_weak(owner.get());
		auto &histories = copy.history->owner().histories();
		state.historyRequestId = histories.sendRequest(
			copy.history,
			Data::Histories::RequestType::History,
			[=](Fn<void()> finish) {
				using Flag = MTPmessages_Search::Flag;
				const auto sender = (which == Leg::Sender);
				const auto fromPeer = sender ? copy.fromPeer : nullptr;
				const auto savedPeer = sender ? copy.savedPeer : nullptr;
				return copy.history->session().api().request(
					MTPmessages_Search(
						MTP_flags((copy.topMsgId
								? Flag::f_top_msg_id
								: Flag())
							| (fromPeer ? Flag::f_from_id : Flag())
							| (savedPeer ? Flag::f_saved_peer_id : Flag())
							| (copy.tags.empty()
								? Flag()
								: Flag::f_saved_reaction)),
						copy.history->peer->input(),
						MTP_string(copy.query),
						(fromPeer
							? fromPeer->input()
							: MTP_inputPeerEmpty()),
						(savedPeer
							? savedPeer->input()
							: MTP_inputPeerEmpty()),
						MTP_vector_from_range(
							copy.tags | ranges::views::transform(
								Data::ReactionToMTP
							)),
						MTP_int(copy.topMsgId),
						(sender
							? MTPMessagesFilter(MTP_inputMessagesFilterEmpty())
							: NativeMessageSearchFilter(copy.type)),
						MTP_int(0), // min_date
						MTP_int(0), // max_date
						MTP_int(offsetId),
						MTP_int(0), // add_offset
						MTP_int(copy.limit),
						MTP_int(0), // max_id
						MTP_int(0), // min_id
						MTP_long(0)) // hash
				).done([=](const MTPmessages_Messages &result) {
					if (weak) {
						weak->_state->received(
							which,
							result,
							first,
							current);
					}
					finish();
				}).fail([=](const MTP::Error &error) {
					if (weak) {
						weak->_state->failed(
							which,
							error,
							first,
							current);
					}
					finish();
				}).send();
			});
	}

	void received(
			Leg which,
			const MTPmessages_Messages &result,
			bool first,
			uint64 current) {
		if (current != generation || !request) {
			return;
		}
		auto &state = leg(which);
		state.historyRequestId = 0;
		auto loaded = parse(result);
		state.received += loaded.rawCount;
		state.total = loaded.total;
		if (loaded.lastId) {
			state.offsetId = loaded.lastId;
		}
		state.full = loaded.complete
			|| !loaded.rawCount
			|| (state.received >= state.total);
		if (first) {
			state.first.emplace(std::move(loaded));
			if (sender.first && type.first) {
				finishFirst();
			}
		} else {
			finishPage(std::move(loaded));
		}
	}

	void failed(
			Leg which,
			const MTP::Error &error,
			bool first,
			uint64 current) {
		if (current != generation || !request) {
			return;
		}
		leg(which).historyRequestId = 0;
		if (error.type() == u"SEARCH_QUERY_EMPTY"_q) {
			auto empty = LoadedPage{ .complete = true };
			auto &state = leg(which);
			state.total = 0;
			state.full = true;
			if (first) {
				state.first.emplace(std::move(empty));
				if (sender.first && type.first) {
					finishFirst();
				}
			} else {
				finishPage(std::move(empty));
			}
			return;
		}
		const auto failure = Failure{
			.type = error.type(),
			.first = !driver.has_value(),
		};
		++generation;
		cancelRequests();
		request.reset();
		loading = false;
		full = true;
		owner->_failures.fire_copy(failure);
	}

	LoadedPage parse(const MTPmessages_Messages &result) {
		Expects(request.has_value());
		auto loaded = LoadedPage();
		const auto process = [&](const auto &data, int total, bool complete) {
			request->history->owner().processUsers(data.vusers());
			request->history->owner().processChats(data.vchats());
			request->history->peer->processTopics(data.vtopics());
			loaded.total = total;
			loaded.complete = complete;
			loaded.rawCount = data.vmessages().v.size();
			for (const auto &message : data.vmessages().v) {
				loaded.lastId = IdFromMessage(message);
				const auto peerId = PeerFromMessage(message);
				if (!request->history->owner().peerLoaded(peerId)) {
					LOG(("API Error: a search result has an unavailable peer."));
					continue;
				} else if (!DateFromMessage(message)) {
					continue;
				}
				if (const auto item = request->history->owner().addNewMessage(
						message,
						MessageFlags(),
						NewMessageType::Existing)) {
					loaded.messages.push_back(item);
				}
			}
		};
		result.match([&](const MTPDmessages_messages &data) {
			process(data, data.vmessages().v.size(), true);
		}, [&](const MTPDmessages_messagesSlice &data) {
			process(data, data.vcount().v, false);
		}, [&](const MTPDmessages_channelMessages &data) {
			if (const auto channel = request->history->peer->asChannel()) {
				channel->ptsReceived(data.vpts().v);
			} else {
				LOG(("API Error: search returned channel messages "
					"for a non-channel peer."));
			}
			process(data, data.vcount().v, false);
		}, [&](const MTPDmessages_messagesNotModified &) {
			loaded.complete = true;
		});
		return loaded;
	}

	void finishFirst() {
		Expects(request.has_value());
		Expects(sender.first.has_value());
		Expects(type.first.has_value());
		driver = (sender.total < type.total) ? Leg::Sender : Leg::Type;
		const auto &selected = *leg(*driver).first;
		const auto &other = *leg(
			(*driver == Leg::Sender) ? Leg::Type : Leg::Sender).first;
		auto otherIds = base::flat_set<FullMsgId>();
		for (const auto &item : other.messages) {
			otherIds.emplace(item->fullId());
		}

		// The other server page is authoritative where both page windows
		// overlap, while local matching covers driver messages beyond that
		// overlap. Combining both prevents page-boundary false negatives and
		// lets the server correct local media classification on the first page.
		auto messages = std::vector<not_null<HistoryItem*>>();
		for (const auto &item : selected.messages) {
			if (matchesOther(item) || otherIds.contains(item->fullId())) {
				append(messages, item);
			}
		}
		loading = false;
		full = leg(*driver).full;
		publish(std::move(messages), true);
	}

	void finishPage(LoadedPage loaded) {
		Expects(driver.has_value());
		auto messages = std::vector<not_null<HistoryItem*>>();
		for (const auto &item : loaded.messages) {
			if (matchesOther(item)) {
				append(messages, item);
			}
		}
		loading = false;
		full = leg(*driver).full;
		publish(std::move(messages), false);
	}

	bool matchesOther(not_null<HistoryItem*> item) const {
		Expects(request.has_value());
		Expects(driver.has_value());
		return (*driver == Leg::Sender)
			? MatchesMessageSearchTypes(
				item,
				MessageSearchTypeBit(request->type))
			: MatchesSender(item, request->fromPeer, request->savedPeer);
	}

	void append(
			std::vector<not_null<HistoryItem*>> &messages,
			not_null<HistoryItem*> item) {
		if (seen.emplace(item->fullId()).second) {
			messages.push_back(item);
			++matchedCount;
		}
	}

	void publish(
			std::vector<not_null<HistoryItem*>> messages,
			bool first) {
		owner->_pages.fire(Page{
			.messages = std::move(messages),
			.matchedCount = matchedCount,
			.first = first,
			.full = full,
		});
	}

	void cancelRequests() {
		if (!request) {
			return;
		}
		auto &histories = request->history->owner().histories();
		histories.cancelRequest(base::take(sender.historyRequestId));
		histories.cancelRequest(base::take(type.historyRequestId));
	}

	LegState &leg(Leg which) {
		return (which == Leg::Sender) ? sender : type;
	}

	const LegState &leg(Leg which) const {
		return (which == Leg::Sender) ? sender : type;
	}

	const not_null<MessageSearchIntersection*> owner;
	std::optional<Request> request;
	LegState sender;
	LegState type;
	std::optional<Leg> driver;
	base::flat_set<FullMsgId> seen;
	uint64 generation = 0;
	int matchedCount = 0;
	bool loading = false;
	bool full = false;
};

MessageSearchIntersection::MessageSearchIntersection()
: _state(std::make_unique<State>(this)) {
}

MessageSearchIntersection::~MessageSearchIntersection() {
	cancel();
}

void MessageSearchIntersection::start(Request request) {
	_state->start(std::move(request));
}

void MessageSearchIntersection::searchMore() {
	_state->searchMore();
}

void MessageSearchIntersection::cancel() {
	_state->cancel();
}

bool MessageSearchIntersection::loading() const {
	return _state->loading;
}

auto MessageSearchIntersection::pages() const
-> rpl::producer<MessageSearchIntersection::Page> {
	return _pages.events();
}

auto MessageSearchIntersection::failures() const
-> rpl::producer<MessageSearchIntersection::Failure> {
	return _failures.events();
}

} // namespace Dialogs
