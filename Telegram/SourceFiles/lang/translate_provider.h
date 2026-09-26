/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#pragma once

#include <translate_provider.h>

class PeerData;
struct MsgId;

namespace Main {
class Session;
} // namespace Main

namespace Ui {

extern const char kOptionTranslateUrlTemplate[];

struct TranslateProviderInfo {
	QString id;
	QString name;
	bool available = false;
};

[[nodiscard]] QString SelectedTranslateProviderId();
[[nodiscard]] std::vector<TranslateProviderInfo> TranslateProviders();
[[nodiscard]] QString TranslateProviderName(const QString &id);
[[nodiscard]] bool TranslateProviderAvailable(const QString &id);

[[nodiscard]] std::unique_ptr<TranslateProvider> CreateTranslateProvider(
	not_null<Main::Session*> session);

[[nodiscard]] QString TranslateProviderTargetCode(LanguageId to);

[[nodiscard]] TranslateProviderRequest PrepareTranslateProviderRequest(
	not_null<TranslateProvider*> provider,
	not_null<PeerData*> peer,
	MsgId msgId,
	TextWithEntities text);

} // namespace Ui
