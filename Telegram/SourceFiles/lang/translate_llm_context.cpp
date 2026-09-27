/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "lang/translate_llm_context.h"

#include "data/data_peer.h"
#include "data/data_session.h"
#include "history/history.h"
#include "history/history_item.h"
#include "history/view/history_view_element.h"

#include <QtCore/QCryptographicHash>
#include <QtCore/QJsonArray>
#include <QtCore/QJsonDocument>

namespace Ui {
namespace {

constexpr auto kReplyLimit = 5;
constexpr auto kContextLimit = 6000;
constexpr auto kMessageLimit = 1000;

[[nodiscard]] bool Eligible(
		not_null<HistoryItem*> target,
		HistoryItem *candidate) {
	return candidate
		&& candidate != target
		&& candidate->history()->peer->id == target->history()->peer->id
		&& candidate->topicRootId() == target->topicRootId()
		&& candidate->isRegular()
		&& !candidate->isService()
		&& !candidate->forbidsSaving()
		&& !candidate->originalText().text.isEmpty();
}

class ContextBuilder final {
public:
	explicit ContextBuilder(not_null<HistoryItem*> target)
	: _target(target) {
		_targetSpeaker = label(target);
	}

	[[nodiscard]] QJsonObject build() {
		auto replies = QJsonArray();
		auto before = QJsonArray();
		auto after = QJsonArray();
		const auto owner = &_target->history()->owner();
		auto current = _target.get();
		for (auto depth = 0; depth != kReplyLimit; ++depth) {
			const auto id = current->replyToFullId();
			const auto parent = id ? owner->message(id) : nullptr;
			if (!add(replies, parent, u"reply"_q)) {
				break;
			}
			current = parent;
		}
		if (const auto view = _target->mainView()) {
			auto previous = view->previousInBlocks();
			for (auto i = 0; i != 2 && previous; ++i) {
				const auto candidate = previous->data();
				add(before, candidate, u"before"_q);
				previous = previous->previousInBlocks();
			}
			if (const auto next = view->nextInBlocks()) {
				add(after, next->data(), u"after"_q);
			}
		}
		return {
			{ u"conversation_kind"_q,
				(_target->history()->peer->isChat()
					|| _target->history()->peer->isMegagroup())
					? u"group"_q : u"direct"_q },
			{ u"target_speaker"_q, _targetSpeaker },
			{ u"reply_chain"_q, replies },
			{ u"before"_q, before },
			{ u"after"_q, after },
		};
	}

private:
	[[nodiscard]] QString label(not_null<HistoryItem*> item) {
		if (item->out()) {
			return u"self"_q;
		}
		const auto id = item->author()->id;
		for (const auto &[known, name] : _speakers) {
			if (known == id) {
				return name;
			}
		}
		const auto name = u"speaker_"_q
			+ QString::number(_speakers.size() + 1);
		_speakers.emplace_back(id, name);
		return name;
	}

	bool add(
			QJsonArray &output,
			HistoryItem *candidate,
			const QString &relation) {
		if (!Eligible(_target, candidate)
			|| ranges::contains(_seen, candidate)
			|| _remaining == 0) {
			return false;
		}
		_seen.push_back(candidate);
		auto text = candidate->originalText().text;
		text.truncate(std::min({
			int(text.size()),
			kMessageLimit,
			_remaining,
		}));
		_remaining -= text.size();
		output.append(QJsonObject{
			{ u"relation"_q, relation },
			{ u"speaker"_q, label(candidate) },
			{ u"text"_q, text },
		});
		return true;
	}

	const not_null<HistoryItem*> _target;
	std::vector<std::pair<PeerId, QString>> _speakers;
	std::vector<HistoryItem*> _seen;
	QString _targetSpeaker;
	int _remaining = kContextLimit;

};

} // namespace

QJsonObject LLMTranslateContext(not_null<HistoryItem*> item) {
	return ContextBuilder(item).build();
}

QString LLMTranslateContextFingerprint(not_null<HistoryItem*> item) {
	const auto bytes = QJsonDocument(LLMTranslateContext(item)).toJson(
		QJsonDocument::Compact);
	return QString::fromLatin1(QCryptographicHash::hash(
		bytes,
		QCryptographicHash::Sha256).toHex());
}

} // namespace Ui
