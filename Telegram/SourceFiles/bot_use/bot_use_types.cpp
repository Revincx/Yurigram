#include "bot_use/bot_use_types.h"

namespace BotUse {

bool Result::terminal() const {
	return state == OperationState::Completed
		|| state == OperationState::Failed
		|| state == OperationState::Cancelled
		|| state == OperationState::Unconfirmed;
}

Error ValidateCredentials(const ApiCredentials &credentials) {
	if (credentials.apiId <= 0 || credentials.apiHash.size() != 32) {
		return { u"API_CREDENTIALS_INVALID"_q };
	}
	for (const auto ch : credentials.apiHash) {
		if (!((ch >= u'0' && ch <= u'9')
			|| (ch >= u'a' && ch <= u'f')
			|| (ch >= u'A' && ch <= u'F'))) {
			return { u"API_CREDENTIALS_INVALID"_q };
		}
	}
	return {};
}

Error ValidateOptions(const Api::SendOptions &options) {
	if (options.price
		|| options.sendAs
		|| options.scheduled
		|| options.scheduleRepeatPeriod
		|| options.shortcutId
		|| options.effectId
		|| !options.stakeSeedHash.isEmpty()
		|| options.stakeNanoTon
		|| options.starsApproved
		|| options.hideViaBot
		|| options.welcomeTemplate
		|| options.ttlSeconds
		|| options.suggest) {
		return { u"UNSUPPORTED_SEND_OPTIONS"_q };
	}
	return {};
}

} // namespace BotUse
