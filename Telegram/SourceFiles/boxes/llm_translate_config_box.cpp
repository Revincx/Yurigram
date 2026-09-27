/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "boxes/llm_translate_config_box.h"

#include "core/enhanced_settings.h"
#include "lang/lang_keys.h"
#include "ui/layers/generic_box.h"
#include "ui/widgets/fields/input_field.h"
#include "ui/widgets/fields/password_input.h"

#include "styles/style_layers.h"

namespace Ui {

void LLMTranslateConfigBox(not_null<GenericBox*> box) {
	const auto initial = ReadLLMTranslateConfig();
	box->setTitle(tr::lng_translate_llm_config());
	const auto endpoint = box->addRow(object_ptr<InputField>(
		box,
		st::defaultInputField,
		tr::lng_translate_llm_endpoint(),
		initial.endpoint));
	const auto model = box->addRow(object_ptr<InputField>(
		box,
		st::defaultInputField,
		tr::lng_translate_llm_model(),
		initial.model));
	const auto extraParameters = box->addRow(object_ptr<InputField>(
		box,
		st::defaultInputField,
		tr::lng_translate_llm_extra_parameters(),
		initial.extraParameters));
	auto keyWrap = object_ptr<RpWidget>(box);
	const auto key = CreateChild<PasswordInput>(
		keyWrap.data(),
		st::defaultInputField,
		tr::lng_translate_llm_key(),
		QString::fromUtf8(initial.apiKey));
	keyWrap->resize(box->width(), key->height());
	keyWrap->widthValue(
	) | rpl::on_next([=](int width) {
		key->resize(width, key->height());
	}, key->lifetime());
	box->addRow(std::move(keyWrap));
	endpoint->setInputMethodHints(Qt::ImhUrlCharactersOnly
		| Qt::ImhNoAutoUppercase
		| Qt::ImhNoPredictiveText);
	model->setInputMethodHints(Qt::ImhNoAutoUppercase
		| Qt::ImhNoPredictiveText);
	extraParameters->setInputMethodHints(Qt::ImhNoAutoUppercase
		| Qt::ImhNoPredictiveText);
	box->setFocusCallback([=] { endpoint->setFocusFast(); });
	endpoint->changes() | rpl::on_next([=] {
		endpoint->hideError();
	}, endpoint->lifetime());
	model->changes() | rpl::on_next([=] {
		model->hideError();
	}, model->lifetime());
	extraParameters->changes() | rpl::on_next([=] {
		extraParameters->hideError();
	}, extraParameters->lifetime());
	const auto current = [=] {
		return LLMTranslateConfig{
			.endpoint = endpoint->getLastText().trimmed(),
			.model = model->getLastText().trimmed(),
			.apiKey = key->getLastText().toUtf8(),
			.context = EnhancedSettings::Get(
				EnhancedSettings::Option::LlmTranslateContext),
			.extraParameters = extraParameters->getLastText().trimmed(),
		};
	};
	const auto validated = [=]() -> std::optional<LLMTranslateConfig> {
		auto config = current();
		const auto validEndpoint = LLMTranslateCompletionUrl(
			config.endpoint).has_value();
		if (!validEndpoint) {
			endpoint->showErrorNoFocus();
		}
		if (config.model.isEmpty()) {
			model->showErrorNoFocus();
		}
		const auto validExtra = ParseLLMTranslateExtraParameters(
			config.extraParameters).has_value();
		if (!validExtra) {
			extraParameters->showErrorNoFocus();
		}
		if (!validEndpoint || config.model.isEmpty() || !validExtra) {
			(!validEndpoint ? endpoint
				: config.model.isEmpty() ? model : extraParameters
			)->setFocusFast();
			return std::nullopt;
		}
		return config;
	};
	box->addButton(tr::lng_settings_save(), [=] {
		if (const auto config = validated()) {
			SaveLLMTranslateCredentials(
				config->endpoint,
				config->model,
				config->apiKey,
				config->extraParameters);
			box->closeBox();
		}
	});
	box->addButton(tr::lng_cancel(), [=] { box->closeBox(); });
}

} // namespace Ui
