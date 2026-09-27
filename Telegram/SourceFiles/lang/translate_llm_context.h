/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#pragma once

#include <QtCore/QJsonObject>

class HistoryItem;

namespace Ui {

[[nodiscard]] QJsonObject LLMTranslateContext(
	not_null<HistoryItem*> item);
[[nodiscard]] QString LLMTranslateContextFingerprint(
	not_null<HistoryItem*> item);

} // namespace Ui
