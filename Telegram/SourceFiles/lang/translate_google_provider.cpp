/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "lang/translate_google_provider.h"

#include "lang/translate_provider.h"
#include "translate/google_translate.h"

namespace Ui {
namespace {

class GoogleTranslateProvider final : public TranslateProvider {
public:
	[[nodiscard]] bool supportsMessageId() const override {
		return false;
	}

	void request(
			TranslateProviderRequest request,
			LanguageId to,
			Fn<void(TranslateProviderResult)> done) override {
		if (request.text.text.isEmpty()) {
			done(TranslateProviderResult{
				.error = TranslateProviderError::Unknown,
			});
			return;
		}
		_translate.translate(
			u"auto"_q,
			TranslateProviderTargetCode(to),
			request.text.text,
			[done = std::move(done)](TranslationResult result) {
				done(result.success
					? TranslateProviderResult{
						.text = TextWithEntities{ .text = result.text },
					}
					: TranslateProviderResult{
						.error = TranslateProviderError::Unknown,
					});
			});
	}

private:
	GTranslate _translate;

};

} // namespace

std::unique_ptr<TranslateProvider> CreateGoogleTranslateProvider() {
	return std::make_unique<GoogleTranslateProvider>();
}

} // namespace Ui
