/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "lang/translate_llm_settings.h"

#include "core/application.h"
#include "core/core_settings.h"
#include "core/enhanced_settings.h"
#include "main/main_session.h"

#include <QtCore/QCryptographicHash>
#include <QtCore/QJsonDocument>
#include <QtCore/QJsonObject>

namespace Ui {
namespace {

constexpr auto kApiKeyPref = "translate-llm-api-key";
constexpr auto kMaxPayloadLength = 16384;

[[nodiscard]] QByteArray SerializeConfig(const LLMTranslateConfig &config) {
	return QJsonDocument(QJsonObject{
		{ u"version"_q, 1 },
		{ u"endpoint"_q, config.endpoint },
		{ u"model"_q, config.model },
		{ u"api_key"_q, QString::fromUtf8(config.apiKey) },
		{ u"context"_q, config.context },
		{ u"extra_parameters"_q, config.extraParameters },
	}).toJson(QJsonDocument::Compact);
}

} // namespace

LLMTranslateConfig ReadLLMTranslateConfig() {
	return {
		.endpoint = EnhancedSettings::Get(
			EnhancedSettings::Option::LlmTranslateEndpoint),
		.model = EnhancedSettings::Get(
			EnhancedSettings::Option::LlmTranslateModel),
		.apiKey = Core::App().settings().readPref<QByteArray>(kApiKeyPref),
		.context = EnhancedSettings::Get(
			EnhancedSettings::Option::LlmTranslateContext),
		.extraParameters = EnhancedSettings::Get(
			EnhancedSettings::Option::LlmTranslateExtraParameters),
	};
}

std::optional<QJsonObject> ParseLLMTranslateExtraParameters(
		const QString &value) {
	if (value.trimmed().isEmpty()) {
		return QJsonObject();
	}
	auto error = QJsonParseError();
	const auto document = QJsonDocument::fromJson(value.toUtf8(), &error);
	if (error.error != QJsonParseError::NoError || !document.isObject()) {
		return std::nullopt;
	}
	return document.object();
}

std::optional<QUrl> LLMTranslateCompletionUrl(const QString &endpoint) {
	const auto url = QUrl(endpoint.trimmed());
	if (!url.isValid()
		|| (url.scheme() != u"http"_q && url.scheme() != u"https"_q)
		|| url.host().isEmpty()
		|| !url.userName().isEmpty()
		|| !url.password().isEmpty()
		|| url.hasFragment()) {
		return std::nullopt;
	}
	auto result = url;
	auto path = result.path();
	if (path.endsWith('/')) {
		path.chop(1);
	}
	if (!path.endsWith(u"/chat/completions"_q)) {
		path += u"/chat/completions"_q;
	}
	result.setPath(path);
	return result;
}

bool LLMTranslateConfigured() {
	const auto config = ReadLLMTranslateConfig();
	return LLMTranslateCompletionUrl(config.endpoint).has_value()
		&& !config.model.trimmed().isEmpty()
		&& ParseLLMTranslateExtraParameters(
			config.extraParameters).has_value();
}

QString LLMTranslateCacheBase(const LLMTranslateConfig &config) {
	const auto digest = QCryptographicHash::hash(
		SerializeConfig(config),
		QCryptographicHash::Sha256).toHex();
	return u"llm:"_q + QString::fromLatin1(digest);
}

void SaveLLMTranslateConfig(const LLMTranslateConfig &config) {
	EnhancedSettings::Set(
		EnhancedSettings::Option::LlmTranslateEndpoint,
		config.endpoint.trimmed());
	EnhancedSettings::Set(
		EnhancedSettings::Option::LlmTranslateModel,
		config.model.trimmed());
	EnhancedSettings::Set(
		EnhancedSettings::Option::LlmTranslateContext,
		config.context);
	EnhancedSettings::Set(
		EnhancedSettings::Option::LlmTranslateExtraParameters,
		config.extraParameters.trimmed());
	Core::App().settings().writePref<QByteArray>(
		kApiKeyPref,
		config.apiKey);
	Core::App().saveSettingsDelayed();
}

void SaveLLMTranslateCredentials(
		QString endpoint,
		QString model,
		QByteArray apiKey,
		QString extraParameters) {
	auto config = ReadLLMTranslateConfig();
	config.endpoint = std::move(endpoint);
	config.model = std::move(model);
	config.apiKey = std::move(apiKey);
	config.extraParameters = std::move(extraParameters);
	SaveLLMTranslateConfig(config);
}

QString LLMTranslateShareLink(
		not_null<Main::Session*> session,
		const LLMTranslateConfig &config) {
	if (!LLMTranslateCompletionUrl(config.endpoint)
		|| config.model.trimmed().isEmpty()
		|| !ParseLLMTranslateExtraParameters(config.extraParameters)) {
		return {};
	}
	const auto serialized = SerializeConfig(config);
	if (serialized.size() > kMaxPayloadLength) {
		return {};
	}
	const auto payload = serialized.toBase64(
		QByteArray::Base64UrlEncoding | QByteArray::OmitTrailingEquals);
	return session->createInternalLinkFull(
		u"yurisettings/llm-translate?config="_q
			+ QString::fromLatin1(payload));
}

std::optional<LLMTranslateConfig> ParseLLMTranslateSharePayload(
		const QString &payload) {
	if (payload.isEmpty() || payload.size() > kMaxPayloadLength) {
		return std::nullopt;
	}
	const auto decoded = QByteArray::fromBase64Encoding(
		payload.toLatin1(),
		QByteArray::Base64UrlEncoding
			| QByteArray::AbortOnBase64DecodingErrors);
	if (!decoded || decoded.decoded.size() > kMaxPayloadLength) {
		return std::nullopt;
	}
	auto error = QJsonParseError();
	const auto document = QJsonDocument::fromJson(decoded.decoded, &error);
	if (error.error != QJsonParseError::NoError || !document.isObject()) {
		return std::nullopt;
	}
	const auto object = document.object();
	const auto endpoint = object.value(u"endpoint"_q);
	const auto model = object.value(u"model"_q);
	const auto apiKey = object.value(u"api_key"_q);
	const auto context = object.value(u"context"_q);
	const auto extraParameters = object.value(u"extra_parameters"_q);
	if (object.value(u"version"_q) != 1
		|| !endpoint.isString()
		|| !model.isString()
		|| !apiKey.isString()
		|| !context.isBool()
		|| (!extraParameters.isUndefined()
			&& (!extraParameters.isString()
				|| !ParseLLMTranslateExtraParameters(
					extraParameters.toString())))
		|| !LLMTranslateCompletionUrl(endpoint.toString())
		|| model.toString().trimmed().isEmpty()) {
		return std::nullopt;
	}
	return LLMTranslateConfig{
		.endpoint = endpoint.toString().trimmed(),
		.model = model.toString().trimmed(),
		.apiKey = apiKey.toString().toUtf8(),
		.context = context.toBool(),
		.extraParameters = extraParameters.toString(),
	};
}

} // namespace Ui
