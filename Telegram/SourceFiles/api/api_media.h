/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#pragma once

class HistoryItem;
class DocumentData;

namespace Api {

struct RemoteFileInfo;

[[nodiscard]] MTPVector<MTPDocumentAttribute> ComposeSendingDocumentAttributes(
	not_null<DocumentData*> document);

MTPInputMedia PrepareUploadedPhoto(
	not_null<HistoryItem*> item,
	RemoteFileInfo info);

MTPInputMedia PrepareUploadedDocument(
	not_null<HistoryItem*> item,
	RemoteFileInfo info);

bool HasAttachedStickers(MTPInputMedia media);

} // namespace Api
