/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "api/api_send_progress.h"

#include "bot_use/bot_use_manager.h"
#include "bot_use/bot_use_sending.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "history/history.h"
#include "data/data_peer.h"
#include "data/data_user.h"
#include "base/unixtime.h"
#include "data/data_peer_values.h"
#include "apiwrap.h"

namespace Api {
namespace {

constexpr auto kCancelTypingActionTimeout = crl::time(5000);
constexpr auto kSendMySpeakingInterval = 3 * crl::time(1000);
constexpr auto kSendMyTypingInterval = 5 * crl::time(1000);
constexpr auto kSendTypingsToOfflineFor = TimeId(30);

[[nodiscard]] bool BotUseSupports(SendProgressType type) {
	using Type = SendProgressType;
	switch (type) {
	case Type::ChooseLocation:
	case Type::ChooseContact:
	case Type::PlayGame:
	case Type::Speaking:
		return false;
	case Type::Typing:
	case Type::RecordVideo:
	case Type::UploadVideo:
	case Type::RecordVoice:
	case Type::UploadVoice:
	case Type::RecordRound:
	case Type::UploadRound:
	case Type::UploadPhoto:
	case Type::UploadFile:
	case Type::ChooseSticker:
		return true;
	}
	Unexpected("SendProgressType value.");
}

} // namespace

SendProgressManager::SendProgressManager(not_null<Main::Session*> session)
: _session(session)
, _stopTypingTimer([=] { cancelTyping(base::take(_stopTypingHistory)); }) {
}

void SendProgressManager::cancel(
		not_null<History*> history,
		SendProgressType type) {
	cancel(history, 0, type);
}

void SendProgressManager::cancel(
		not_null<History*> history,
		MsgId topMsgId,
		SendProgressType type) {
	for (auto i = begin(_requests); i != end(_requests);) {
		const auto &key = i->first;
		if (key.history != history
			|| key.topMsgId != topMsgId
			|| key.type != type) {
			++i;
			continue;
		}
		const auto request = i->second;
		i = _requests.erase(i);
		if (request.botUse) {
			_session->domain().botUse().cancel(request.operation);
		} else {
			_session->api().request(request.user).cancel();
		}
	}
}

void SendProgressManager::cancelTyping(not_null<History*> history) {
	_stopTypingTimer.cancel();
	cancel(history, SendProgressType::Typing);
}

void SendProgressManager::update(
		not_null<History*> history,
		SendProgressType type,
		int progress) {
	update(history, 0, type, progress);
}

void SendProgressManager::update(
		not_null<History*> history,
		MsgId topMsgId,
		SendProgressType type,
		int progress) {
	const auto peer = history->peer;
	if (peer->isSelf()
		|| (peer->isChannel()
			&& !peer->isMegagroup()
			&& type != SendProgressType::Speaking)) {
		return;
	}

	const auto doing = (progress >= 0);
	const auto bot = BotUseSupports(type) ? BotUse::Selected(history) : 0;
	const auto key = Key{ history, topMsgId, type, bot };
	if (updated(key, doing)) {
		cancel(history, topMsgId, type);
		if (doing) {
			send(key, progress);
		}
	}
}

bool SendProgressManager::updated(const Key &key, bool doing) {
	const auto now = crl::now();
	auto i = _updated.find(key);
	if (doing) {
		for (auto other = begin(_updated); other != end(_updated);) {
			const auto &candidate = other->first;
			if (candidate.history == key.history
				&& candidate.topMsgId == key.topMsgId
				&& candidate.type == key.type
				&& candidate.botUse != key.botUse) {
				other = _updated.erase(other);
			} else {
				++other;
			}
		}
		i = _updated.find(key);
		const auto sendEach = (key.type == SendProgressType::Speaking)
			? kSendMySpeakingInterval
			: kSendMyTypingInterval;
		if (i == end(_updated)) {
			_updated.emplace(key, now + 2 * sendEach);
		} else if (i->second > now + sendEach) {
			return false;
		} else {
			i->second = now + 2 * sendEach;
		}
	} else {
		auto active = false;
		for (auto other = begin(_updated); other != end(_updated);) {
			const auto &candidate = other->first;
			if (candidate.history == key.history
				&& candidate.topMsgId == key.topMsgId
				&& candidate.type == key.type) {
				active |= (other->second > now);
				other = _updated.erase(other);
			} else {
				++other;
			}
		}
		return active;
	}
	return true;
}

void SendProgressManager::send(const Key &key, int progress) {
	if (skipRequest(key)) {
		return;
	}
	using Type = SendProgressType;
	const auto action = [&]() -> MTPsendMessageAction {
		const auto p = MTP_int(progress);
		switch (key.type) {
		case Type::Typing: return MTP_sendMessageTypingAction();
		case Type::RecordVideo: return MTP_sendMessageRecordVideoAction();
		case Type::UploadVideo: return MTP_sendMessageUploadVideoAction(p);
		case Type::RecordVoice: return MTP_sendMessageRecordAudioAction();
		case Type::UploadVoice: return MTP_sendMessageUploadAudioAction(p);
		case Type::RecordRound: return MTP_sendMessageRecordRoundAction();
		case Type::UploadRound: return MTP_sendMessageUploadRoundAction(p);
		case Type::UploadPhoto: return MTP_sendMessageUploadPhotoAction(p);
		case Type::UploadFile: return MTP_sendMessageUploadDocumentAction(p);
		case Type::ChooseLocation: return MTP_sendMessageGeoLocationAction();
		case Type::ChooseContact: return MTP_sendMessageChooseContactAction();
		case Type::PlayGame: return MTP_sendMessageGamePlayAction();
		case Type::Speaking: return MTP_speakingInGroupCallAction();
		case Type::ChooseSticker: return MTP_sendMessageChooseStickerAction();
		default: return MTP_sendMessageTypingAction();
		}
	}();
	if (key.botUse) {
		const auto weak = base::make_weak(this);
		const auto operation = _session->domain().botUse().setTyping(
			key.botUse,
			key.history->peer->id,
			key.topMsgId,
			action,
			[=](const BotUse::Result &result) {
				if (const auto strong = weak.get()) {
					strong->doneBot(result.bot, result.operation);
				}
			});
		_requests.emplace(key, Request{
			.botUse = key.botUse,
			.operation = operation,
		});
	} else {
		const auto requestId = _session->api().request(MTPmessages_SetTyping(
			MTP_flags(key.topMsgId
				? MTPmessages_SetTyping::Flag::f_top_msg_id
				: MTPmessages_SetTyping::Flag(0)),
			key.history->peer->input(),
			MTP_int(key.topMsgId),
			action
		)).done([=](const MTPBool &result, mtpRequestId requestId) {
			done(requestId);
		}).send();
		_requests.emplace(key, Request{ .user = requestId });
	}

	if (key.type == Type::Typing) {
		_stopTypingHistory = key.history;
		_stopTypingTimer.callOnce(kCancelTypingActionTimeout);
	}
}

bool SendProgressManager::skipRequest(const Key &key) const {
	const auto user = key.history->peer->asUser();
	if (!user) {
		return false;
	} else if (user->isSelf()) {
		return true;
	} else if (user->isBot() && !user->isSupport()) {
		return true;
	}
	const auto recently = base::unixtime::now() - kSendTypingsToOfflineFor;
	const auto lastseen = user->lastseen();
	if (lastseen.isRecently()) {
		return false;
	} else if (const auto value = lastseen.onlineTill()) {
		return (value < recently);
	}
	return true;
}

void SendProgressManager::done(mtpRequestId requestId) {
	for (auto i = _requests.begin(), e = _requests.end(); i != e; ++i) {
		if (!i->second.botUse && i->second.user == requestId) {
			_requests.erase(i);
			break;
		}
	}
}

void SendProgressManager::doneBot(uint64 bot, uint64 operation) {
	for (auto i = _requests.begin(), e = _requests.end(); i != e; ++i) {
		if (i->second.botUse == bot && i->second.operation == operation) {
			_requests.erase(i);
			break;
		}
	}
}

} // namespace Api
