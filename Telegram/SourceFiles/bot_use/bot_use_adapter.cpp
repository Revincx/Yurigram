#include "bot_use/bot_use_adapter.h"

#include "api/api_media.h"
#include "api/api_text_entities.h"
#include "data/data_channel.h"
#include "data/data_document.h"
#include "data/data_document_media.h"
#include "data/data_photo.h"
#include "data/data_photo_media.h"
#include "history/history.h"
#include "storage/localimageloader.h"
#include "ui/text/text_utilities.h"

namespace BotUse {
namespace {

void CollectMedia(
		uint64 &id,
		PhotoData *photo,
		DocumentData *document,
		bool isPhoto,
		std::map<std::pair<bool, uint64>, MediaSource> &sources) {
	if (photo) {
		id = photo->id;
	} else if (document) {
		id = document->id;
	}
	const auto key = std::make_pair(isPhoto, id);
	if (sources.contains(key)) {
		return;
	}
	auto source = MediaSource{ .id = id, .photo = isPhoto };
	if (photo) {
		source.bytes = photo->createMediaView()->imageBytes(Data::PhotoSize::Large);
		source.location = photo->location(true);
		source.name = u"photo.jpg"_q;
		source.mime = u"image/jpeg"_q;
	} else if (document) {
		source.bytes = document->createMediaView()->bytes();
		source.location = document->location(true);
		source.mime = document->mimeString();
		source.attributes = Api::ComposeSendingDocumentAttributes(document).v;
		source.name = document->filename();
		source.audio = Iv::RichDocumentIsAudio(document);
	}
	sources.emplace(key, std::move(source));
}

Error SnapshotBlocks(
		std::vector<Iv::RichPage::Block> &blocks,
		std::map<std::pair<bool, uint64>, MediaSource> &sources) {
	using Kind = Iv::RichPage::BlockKind;
	for (auto &block : blocks) {
		switch (block.kind) {
		case Kind::Unsupported:
		case Kind::AuthorDate:
		case Kind::Embed:
		case Kind::EmbedPost:
		case Kind::Channel:
		case Kind::RelatedArticles:
			return { u"RICH_BLOCK_UNSUPPORTED"_q };
		default:
			break;
		}
		if (block.kind == Kind::Photo) {
			CollectMedia(block.photoId, block.photo, nullptr, true, sources);
		} else if (block.kind == Kind::Video
			|| block.kind == Kind::Audio
			|| block.kind == Kind::File) {
			CollectMedia(block.documentId, nullptr, block.document, false, sources);
			if (block.kind == Kind::Audio) {
				sources[{ false, block.documentId }].audio = true;
			}
		}
		for (auto &item : block.mediaItems) {
			if (item.kind == Kind::Photo) {
				CollectMedia(item.photoId, item.photo, nullptr, true, sources);
			} else if (item.kind == Kind::Video) {
				CollectMedia(item.documentId, nullptr, item.document, false, sources);
			} else {
				return { u"RICH_BLOCK_UNSUPPORTED"_q };
			}
			item.photo = nullptr;
			item.document = nullptr;
		}
		block.photo = nullptr;
		block.document = nullptr;
		block.peer = nullptr;
		block.accessHash = 0;
		if (const auto error = SnapshotBlocks(block.blocks, sources)) {
			return error;
		}
		for (auto &item : block.listItems) {
			if (const auto error = SnapshotBlocks(item.blocks, sources)) {
				return error;
			}
		}
	}
	return {};
}

} // namespace

Error ValidateTarget(PeerId peer) {
	return peerIsChannel(peer) && peerToChannel(peer)
		? Error()
		: Error{ u"UNSUPPORTED_PEER"_q };
}

Error SnapshotAction(const Api::SendAction &from, Action &to) {
	to.peer = from.history->peer->id;
	to.reply = from.replyTo;
	to.options = from.options;
	if (const auto error = ValidateTarget(to.peer)) {
		return error;
	} else if (const auto error = ValidateOptions(to.options)) {
		return error;
	} else if (to.reply.storyId
		|| to.reply.monoforumPeerId
		|| to.reply.todoItemId
		|| !to.reply.pollOption.isEmpty()
		|| (to.reply.messageId.peer && to.reply.messageId.peer != to.peer)
		|| (to.reply.messageId.msg && !IsServerMsgId(to.reply.messageId.msg))
		|| (to.reply.topicRootId && !IsServerMsgId(to.reply.topicRootId))) {
		return { u"UNSUPPORTED_REPLY"_q };
	}
	return {};
}

TextWithEntities SnapshotText(const TextWithTags &text) {
	return { text.text, TextUtilities::ConvertTextTagsToEntities(text.tags) };
}

Error SnapshotMedia(const FilePrepareResult &from, MediaSource &to) {
	to.id = from.id;
	to.photo = from.type == SendMediaType::Photo;
	to.spoiler = from.spoiler;
	to.forceFile = from.forceFile;
	to.location = Core::FileLocation(from.filepath);
	to.bytes = from.content;
	if (to.bytes.isEmpty() && !from.fileparts.empty()) {
		for (const auto &part : from.fileparts) {
			to.bytes.append(part);
		}
	}
	to.thumbnail = from.thumbbytes;
	if (to.thumbnail.isEmpty()) {
		for (const auto &part : from.thumbparts) {
			to.thumbnail.append(part);
		}
	}
	to.name = from.filename;
	to.mime = from.filemime;
	to.caption = SnapshotText(from.caption);
	if (from.document.type() == mtpc_document) {
		to.attributes = from.document.c_document().vattributes().v;
		for (const auto &attribute : to.attributes) {
			to.audio |= attribute.type() == mtpc_documentAttributeAudio;
		}
	}
	if (from.type != SendMediaType::Photo
		&& from.type != SendMediaType::File
		&& from.type != SendMediaType::Audio
		&& from.type != SendMediaType::Round) {
		return { u"UNSUPPORTED_MEDIA"_q };
	}
	return to.bytes.isEmpty() && to.location.isEmpty()
		? Error{ u"MEDIA_SOURCE_MISSING"_q }
		: Error();
}

Error SnapshotRich(
		const Iv::RichPage &page,
		const std::vector<RichMediaSource> &sources,
		Operation &operation) {
	if (page.part) {
		return { u"RICH_MESSAGE_INCOMPLETE"_q };
	} else if (Iv::ValidateRichMessage(page, Iv::RichMessageLimits())) {
		return { u"RICH_MESSAGE_LIMIT"_q };
	}
	auto media = std::map<std::pair<bool, uint64>, MediaSource>();
	for (const auto &source : sources) {
		auto value = MediaSource();
		if (source.file) {
			if (const auto error = SnapshotMedia(*source.file, value)) {
				return error;
			}
		}
		value.id = source.id;
		value.photo = source.photo;
		value.origin = source.origin;
		value.uploadedPhoto = source.uploadedPhoto;
		value.uploadedDocument = source.uploadedDocument;
		media.emplace(std::make_pair(source.photo, source.id), std::move(value));
	}
	operation.page = std::make_shared<Iv::RichPage>(page);
	if (const auto error = SnapshotBlocks(operation.page->blocks, media)) {
		return error;
	}
	for (auto &[key, source] : media) {
		if (!source.id) {
			return { u"RICH_MEDIA_ID_INVALID"_q };
		}
		operation.media.push_back(std::move(source));
	}
	return {};
}

MTPVector<MTPMessageEntity> EntitiesToMTP(
		const EntitiesInText &entities,
		UserId bot) {
	return Api::EntitiesToMTP(entities, [=](const QString &data)
			-> std::optional<MTPInputUser> {
		const auto id = TextUtilities::MentionNameDataToFields(data).userId;
		return !id
			? std::nullopt
			: std::make_optional(MTPInputUser((id == bot.bare)
				? MTP_inputUserSelf()
				: MTP_inputUser(MTP_long(id), MTP_long(0))));
	}, Api::ConvertOption::SkipLocal);
}

MTPInputReplyTo ReplyToMTP(const Action &action, UserId bot) {
	const auto &reply = action.reply;
	using Flag = MTPDinputReplyToMessage::Flag;
	auto flags = MTPDinputReplyToMessage::Flags();
	if (reply.topicRootId) {
		flags |= Flag::f_top_msg_id;
	}
	if (!reply.quote.empty()) {
		flags |= Flag::f_quote_text | Flag::f_quote_offset;
		if (!reply.quote.entities.empty()) {
			flags |= Flag::f_quote_entities;
		}
	}
	return MTP_inputReplyToMessage(
		MTP_flags(flags),
		MTP_int(reply.messageId.msg ? reply.messageId.msg.bare : reply.topicRootId.bare),
		MTP_int(reply.topicRootId.bare),
		MTPInputPeer(),
		MTP_string(reply.quote.text),
		EntitiesToMTP(reply.quote.entities, bot),
		MTP_int(reply.quoteOffset),
		MTPInputPeer(),
		MTPint(),
		MTPbytes());
}

MTPInputMedia WebPageToMTP(const Data::WebPageDraft &page) {
	using Flag = MTPDinputMediaWebPage::Flag;
	return MTP_inputMediaWebPage(
		MTP_flags((page.forceLargeMedia ? Flag::f_force_large_media : Flag())
			| (page.forceSmallMedia ? Flag::f_force_small_media : Flag())),
		MTP_string(page.url));
}

} // namespace BotUse
