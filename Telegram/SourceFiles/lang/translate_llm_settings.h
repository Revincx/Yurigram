/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#pragma once

#include <QtCore/QByteArray>
#include <QtCore/QJsonObject>
#include <QtCore/QString>
#include <QtCore/QUrl>

#include <optional>

namespace Main {
class Session;
} // namespace Main

namespace Ui {

struct LLMTranslateConfig {
	QString endpoint;
	QString model;
	QByteArray apiKey;
	bool context = false;
	QString extraParameters;
};

[[nodiscard]] LLMTranslateConfig ReadLLMTranslateConfig();
[[nodiscard]] std::optional<QJsonObject> ParseLLMTranslateExtraParameters(
	const QString &value);
[[nodiscard]] std::optional<QUrl> LLMTranslateCompletionUrl(
	const QString &endpoint);
[[nodiscard]] bool LLMTranslateConfigured();
[[nodiscard]] QString LLMTranslateCacheBase(
	const LLMTranslateConfig &config);
void SaveLLMTranslateConfig(const LLMTranslateConfig &config);
void SaveLLMTranslateCredentials(
	QString endpoint,
	QString model,
	QByteArray apiKey,
	QString extraParameters);
[[nodiscard]] QString LLMTranslateShareLink(
	not_null<Main::Session*> session,
	const LLMTranslateConfig &config);
[[nodiscard]] std::optional<LLMTranslateConfig> ParseLLMTranslateSharePayload(
	const QString &payload);

} // namespace Ui
