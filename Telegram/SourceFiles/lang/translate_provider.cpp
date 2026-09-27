/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "lang/translate_provider.h"

#include "base/options.h"
#include "base/platform/base_platform_info.h"
#include "core/enhanced_settings.h"
#include "data/data_msg_id.h"
#include "data/data_peer.h"
#include "data/data_session.h"
#include "history/history_item.h"
#include "lang/lang_keys.h"
#include "lang/translate_google_provider.h"
#include "lang/translate_llm_provider.h"
#include "lang/translate_llm_settings.h"
#include "lang/translate_mtproto_provider.h"
#include "lang/translate_url_provider.h"
#include "platform/platform_translate_provider.h"

#include <QtCore/QUrl>

namespace {

base::options::option<QString> OptionTranslateUrlTemplate({
	.id = Ui::kOptionTranslateUrlTemplate,
	.name = "Translate URL template",
	.description = "Template URL for custom translation provider."
		" Supports %q text, %f source language and %t target language.",
});

[[nodiscard]] bool ValidUrlTemplate(const QString &value) {
	if (!value.contains(u"%q"_q)) {
		return false;
	}
	auto example = value;
	example.replace(u"%q"_q, u"text"_q);
	example.replace(u"%f"_q, u"auto"_q);
	example.replace(u"%t"_q, u"en"_q);
	const auto url = QUrl(example);
	return url.isValid() && !url.scheme().isEmpty();
}

class UnavailableTranslateProvider final : public Ui::TranslateProvider {
public:
	[[nodiscard]] bool supportsMessageId() const override {
		return false;
	}

	void request(
			Ui::TranslateProviderRequest,
			LanguageId,
			Fn<void(Ui::TranslateProviderResult)> done) override {
		done(Ui::TranslateProviderResult{
			.error = Ui::TranslateProviderError::Unknown,
		});
	}

};

} // namespace

namespace Ui {

const char kOptionTranslateUrlTemplate[] = "translate-url-template";

QString SelectedTranslateProviderId() {
	return EnhancedSettings::Get(EnhancedSettings::Option::TranslateProvider);
}

QString SelectedTranslateCacheBase() {
	const auto id = SelectedTranslateProviderId();
	return (id == u"llm"_q)
		? LLMTranslateCacheBase(ReadLLMTranslateConfig())
		: id;
}

bool TranslateProviderAvailable(const QString &id) {
	if (id == u"telegram"_q || id == u"google"_q) {
		return true;
	} else if (id == u"crow"_q) {
		return Platform::IsLinux()
			&& Platform::IsTranslateProviderAvailable();
	} else if (id == u"apple"_q) {
		return Platform::IsMac()
			&& Platform::IsTranslateProviderAvailable();
	} else if (id == u"url"_q) {
		return ValidUrlTemplate(OptionTranslateUrlTemplate.value());
	} else if (id == u"llm"_q) {
		return LLMTranslateConfigured();
	}
	return false;
}

QString TranslateProviderName(const QString &id) {
	if (id == u"telegram"_q) {
		return tr::lng_translate_provider_telegram(tr::now);
	} else if (id == u"crow"_q) {
		return tr::lng_translate_provider_crow(tr::now);
	} else if (id == u"apple"_q) {
		return tr::lng_translate_provider_apple(tr::now);
	} else if (id == u"google"_q) {
		return tr::lng_translate_provider_google(tr::now);
	} else if (id == u"url"_q) {
		return tr::lng_translate_provider_url(tr::now);
	} else if (id == u"llm"_q) {
		return tr::lng_translate_provider_llm(tr::now);
	}
	return tr::lng_translate_provider_unknown(tr::now);
}

std::vector<TranslateProviderInfo> TranslateProviders() {
	auto result = std::vector<TranslateProviderInfo>();
	const auto selected = SelectedTranslateProviderId();
	const auto add = [&](const QString &id) {
		const auto available = TranslateProviderAvailable(id);
		if (available || selected == id) {
			result.push_back({
				id, TranslateProviderName(id), available, available });
		}
	};
	add(u"telegram"_q);
	if (Platform::IsLinux()) {
		add(u"crow"_q);
	} else if (Platform::IsMac()) {
		add(u"apple"_q);
	}
	add(u"google"_q);
	add(u"url"_q);
	result.push_back({
		u"llm"_q,
		TranslateProviderName(u"llm"_q),
		TranslateProviderAvailable(u"llm"_q),
	});
	if (!ranges::contains(result, selected, &TranslateProviderInfo::id)) {
		result.push_back({
			selected, TranslateProviderName(selected), false, false });
	}
	return result;
}

std::unique_ptr<TranslateProvider> CreateTranslateProvider(
		not_null<Main::Session*> session,
		Fn<void(QString)> errorReporter) {
	const auto id = SelectedTranslateProviderId();
	if (!TranslateProviderAvailable(id)) {
		return std::make_unique<UnavailableTranslateProvider>();
	} else if (id == u"telegram"_q) {
		return CreateMTProtoTranslateProvider(session);
	} else if (id == u"google"_q) {
		return CreateGoogleTranslateProvider();
	} else if (id == u"url"_q) {
		return CreateUrlTranslateProvider(OptionTranslateUrlTemplate.value());
	} else if (id == u"llm"_q) {
		return CreateLLMTranslateProvider(
			session, std::move(errorReporter));
	} else if (id == u"crow"_q || id == u"apple"_q) {
		return Platform::CreateTranslateProvider();
	}
	return std::make_unique<UnavailableTranslateProvider>();
}

QString TranslateProviderTargetCode(LanguageId to) {
	return EnhancedSettings::Get(EnhancedSettings::Option::TranslateToTc)
		? u"zh-Hant"_q
		: to.twoLetterCode();
}

TranslateProviderRequest PrepareTranslateProviderRequest(
		not_null<TranslateProvider*> provider,
		not_null<PeerData*> peer,
		MsgId msgId,
		TextWithEntities text) {
	auto result = TranslateProviderRequest{
		.peerId = uint64(peer->id.value),
		.msgId = IsServerMsgId(msgId) ? msgId.bare : 0,
		.text = std::move(text),
	};
	if (provider->supportsMessageId()) {
		return result;
	}
	if (result.msgId) {
		if (const auto i = peer->owner().message(peer, MsgId(result.msgId))) {
			result.text = i->originalText();
		}
		result.msgId = 0;
	}
	return result;
}

} // namespace Ui
