/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#pragma once

#include "translate_provider.h"

namespace Main {
class Session;
} // namespace Main

class QObject;

namespace Ui {

struct LLMTranslateConfig;

[[nodiscard]] std::unique_ptr<TranslateProvider> CreateLLMTranslateProvider(
	not_null<Main::Session*> session,
	Fn<void(QString)> errorReporter);
void TestLLMTranslateConfig(
	const LLMTranslateConfig &config,
	not_null<QObject*> context,
	Fn<void(QString)> done);

} // namespace Ui
