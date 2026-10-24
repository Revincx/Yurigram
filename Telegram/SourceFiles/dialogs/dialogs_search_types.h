/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#pragma once

#include "base/basic_types.h"

namespace Dialogs {

enum class MessageSearchType : uchar {
	Photo,
	Video,
	File,
	Link,
	Music,
	Voice,
	RoundVideo,
	Sticker,
	Gif,
	Poll,
	Mention,
	Location,
	Pinned,

	kCount,
};

using MessageSearchTypes = uint32;

[[nodiscard]] constexpr MessageSearchTypes MessageSearchTypeBit(
		MessageSearchType type) {
	return 1U << static_cast<uint32>(type);
}

[[nodiscard]] constexpr bool IsStickerOnlySearch(MessageSearchTypes types) {
	return types == MessageSearchTypeBit(MessageSearchType::Sticker);
}

} // namespace Dialogs
