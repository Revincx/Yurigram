#pragma once

#include "mtproto/details/mtproto_serialized_request.h"

namespace MTP {
class Instance;
} // namespace MTP

namespace Test {

class Runner;

void ObserveBotUseRequest(
	not_null<MTP::Instance*> instance,
	mtpRequestId id,
	const MTP::details::SerializedRequest &request);
void AppendBotUseSelfTest(not_null<Runner*> runner);

} // namespace Test
