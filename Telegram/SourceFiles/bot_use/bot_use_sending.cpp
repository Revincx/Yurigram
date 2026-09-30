#include "bot_use/bot_use_sending.h"

#include "apiwrap.h"
#include "api/api_media.h"
#include "bot_use/bot_use_adapter.h"
#include "bot_use/bot_use_chat_state.h"
#include "bot_use/bot_use_manager.h"
#include "chat_helpers/message_field.h"
#include "data/data_changes.h"
#include "data/data_document.h"
#include "data/data_document_media.h"
#include "data/data_media_types.h"
#include "data/data_file_origin.h"
#include "data/data_photo.h"
#include "data/data_photo_media.h"
#include "data/data_premium_limits.h"
#include "data/data_session.h"
#include "data/data_user.h"
#include "history/history.h"
#include "history/history_item.h"
#include "history/history_item_components.h"
#include "history/history_item_helpers.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "mtproto/mtp_instance.h"
#include "storage/localimageloader.h"
#include "base/random.h"
#include "base/unixtime.h"
#include "ui/image/image_location_factory.h"
#include "ui/item_text_options.h"
#include "ui/text/text_utilities.h"
#include "window/window_session_controller.h"

namespace BotUse {
namespace {

[[nodiscard]] BotInfo FindBot(not_null<History*> history, BotId bot) {
	for (const auto &info : history->session().domain().botUse().bots()) {
		if (info.id == bot) {
			return info;
		}
	}
	return {};
}

[[nodiscard]] MessageFlags LocalFlags(const Api::SendAction &action) {
	auto flags = NewMessageFlags(action.history->peer);
	flags &= ~MessageFlag::Outgoing;
	flags |= MessageFlag::HasFromId;
	if (action.replyTo) {
		flags |= MessageFlag::HasReplyInfo;
	}
	if (action.options.silent) {
		flags |= MessageFlag::Silent;
	}
	if (action.options.noForwards) {
		flags |= MessageFlag::NoForwards;
	}
	if (action.history->peer->isBroadcast()) {
		flags |= MessageFlag::Post
			| MessageFlag::HasViews
			| MessageFlag::HasPostAuthor;
	}
	if (action.options.invertCaption) {
		flags |= MessageFlag::InvertMedia;
	}
	return flags;
}

[[nodiscard]] HistoryItemCommonFields LocalFields(
		const Api::SendAction &action,
		UserId bot,
		MsgId id,
		uint64 groupedId = 0) {
	return {
		.id = id,
		.flags = LocalFlags(action),
		.from = peerFromUser(bot),
		.replyTo = action.replyTo,
		.date = NewMessageDate(action.options),
		.postAuthor = action.history->peer->isBroadcast()
			? action.history->session().data().user(bot)->name()
			: QString(),
		.groupedId = groupedId,
	};
}

void NotifySent(not_null<History*> history) {
	history->session().data().sendHistoryChangeNotifications();
	history->session().changes().historyUpdated(
		history, Data::HistoryUpdate::Flag::MessageSent);
}

void Complete(
		base::weak_ptr<Main::Session> weak,
		PeerId peer,
		std::vector<FullMsgId> locals,
		const Result &result) {
	const auto session = weak.get();
	if (!session) {
		return;
	}
	auto &owner = session->data();
	if (result.state != OperationState::Completed
		|| result.messages.size() != locals.size()) {
		for (const auto &id : locals) {
			if (const auto item = owner.message(id); item && item->isSending()) {
				item->sendFailed();
			}
			session->botUseChats().finishSend(id);
		}
		if (const auto history = owner.historyLoaded(peer)) {
			ShowSendError(history, result.error
				? result.error : Error{ u"MESSAGE_RESULT_INCOMPLETE"_q });
		}
		return;
	}
	for (auto i = size_t(); i != locals.size(); ++i) {
		const auto real = result.messages[i];
		if (real.peer != peer || !IsServerMsgId(real.msg)) {
			session->botUseChats().finishSend(locals[i]);
			continue;
		}
		const auto found = ranges::find_if(result.data, [&](const MTPMessage &message) {
			return message.type() == mtpc_message
				&& message.c_message().vid().v == real.msg.bare
				&& peerFromMTP(message.c_message().vpeer_id()) == peer;
		});
		if (found == end(result.data)) {
			session->botUseChats().finishSend(locals[i]);
			continue;
		}
		if (const auto local = owner.message(locals[i])) {
			if (const auto media = local->media()) {
				if (const auto server = found->c_message().vmedia()) {
					server->match([&](const MTPDmessageMediaPhoto &data) {
						if (const auto source = media->photo()) {
							if (const auto photo = data.vphoto()) {
								owner.processPhoto(*photo)->collectLocalData(source);
							}
						}
					}, [&](const MTPDmessageMediaDocument &data) {
						if (const auto source = media->document()) {
							if (const auto document = data.vdocument()) {
								owner.processDocument(*document)->collectLocalData(source);
							}
						}
					}, [&](const auto &) {});
				}
			}
			if (const auto existing = owner.message(real); existing && existing != local) {
				existing->destroy();
			}
			local->setRealId(real.msg);
			owner.updateExistingMessage(found->c_message());
		} else if (!owner.message(real)) {
			session->botUseChats().finishSend(locals[i], real);
			owner.addNewMessage(*found, MessageFlags(), NewMessageType::Unread);
			continue;
		}
		session->botUseChats().finishSend(locals[i], real);
	}
	owner.sendHistoryChangeNotifications();
}

[[nodiscard]] Completion CompletionFor(
		not_null<History*> history,
		std::vector<FullMsgId> locals,
		Completion done = {}) {
	return [weak = base::make_weak(&history->session()),
			peer = history->peer->id,
			locals = std::move(locals),
			done = std::move(done)](const Result &result) {
		Complete(weak, peer, locals, result);
		if (done) {
			done(result);
		}
	};
}

[[nodiscard]] MTPMessageMedia LocalMedia(const FilePrepareResult &file) {
	if (file.type == SendMediaType::Photo) {
		using Flag = MTPDmessageMediaPhoto::Flag;
		return MTP_messageMediaPhoto(
			MTP_flags(Flag::f_photo | (file.spoiler ? Flag::f_spoiler : Flag())),
			file.photo, MTPint(), MTPDocument());
	}
	using Flag = MTPDmessageMediaDocument::Flag;
	return MTP_messageMediaDocument(
		MTP_flags(Flag::f_document | (file.spoiler ? Flag::f_spoiler : Flag())
			| (file.type == SendMediaType::Audio ? Flag::f_voice : Flag())
			| (file.type == SendMediaType::Round ? Flag::f_round : Flag())),
		file.document, MTPVector<MTPDocument>(), MTPPhoto(), MTPint(), MTPint());
}

struct LocalUploadTarget {
	uint64 id = 0;
	bool photo = false;
	FullMsgId message;
};

[[nodiscard]] UploadCallback LocalUploadProgress(
		not_null<Main::Session*> session,
		std::vector<LocalUploadTarget> targets) {
	return [weak = base::make_weak(session),
			targets = std::move(targets)](const UploadProgress &progress) {
		const auto session = weak.get();
		if (!session) {
			return;
		}
		ApplyLocalMediaUploadProgress(session, progress);
		const auto i = ranges::find_if(targets, [&](const auto &target) {
			return target.id == progress.id && target.photo == progress.photo;
		});
		if (i != end(targets)) {
			if (const auto item = session->data().message(i->message)) {
				session->data().requestItemRepaint(item);
			}
		}
	};
}

} // namespace

BotId Selected(not_null<History*> history) {
	const auto peer = history->peer;
	const auto choice = history->session().botUseChats().choice(peer->id);
	return choice.enabled && (peer->isMegagroup() || peer->isBroadcast())
		? choice.bot : 0;
}

bool CanEditAs(not_null<HistoryItem*> item, BotId bot) {
	const auto peer = item->history()->peer;
	if (!bot || !peer->isMegagroup()) {
		return false;
	}
	const auto info = FindBot(item->history(), bot);
	return info.userId
		&& item->from()->id == peerFromUser(info.userId)
		&& item->isRegular()
		&& !item->isSponsored()
		&& !item->isEphemeral()
		&& !item->isService()
		&& IsServerMsgId(item->id)
		&& !item->isScheduled()
		&& !item->isSending()
		&& !item->hasFailed()
		&& !item->isEditingMedia()
		&& !item->Get<HistoryMessageVia>()
		&& !item->Get<HistoryMessageForwarded>()
		&& !IsAnchoredEphemeral(item)
		&& item->paidType() == PaidPostType::None
		&& (!item->media() || item->media()->allowsEdit());
}

bool CanDeleteAs(not_null<HistoryItem*> item, BotId bot) {
	const auto peer = item->history()->peer;
	if (!bot || !peer->isMegagroup()) {
		return false;
	}
	const auto info = FindBot(item->history(), bot);
	return info.userId
		&& item->from()->id == peerFromUser(info.userId)
		&& item->isRegular()
		&& !item->isSponsored()
		&& !item->isEphemeral()
		&& !item->isService()
		&& IsServerMsgId(item->id)
		&& item->id != MsgId(1)
		&& item->topicRootId() != item->id
		&& !item->isScheduled()
		&& !item->isSending()
		&& !item->hasFailed()
		&& !IsAnchoredEphemeral(item);
}

BotId EditBot(not_null<HistoryItem*> item) {
	const auto bot = Selected(item->history());
	return CanEditAs(item, bot) ? bot : 0;
}

BotId DeleteBot(not_null<HistoryItem*> item) {
	const auto bot = Selected(item->history());
	return CanDeleteAs(item, bot) ? bot : 0;
}

BotId RichEditBot(not_null<HistoryItem*> item) {
	if (item->history()->peer->isMegagroup()) {
		return item->richPage() ? EditBot(item) : 0;
	}
	return item->history()->peer->isBroadcast()
		&& item->richPage()
		&& item->isRegular()
		&& IsServerMsgId(item->id)
		&& !item->isScheduled()
		&& !item->isSending()
		&& !item->hasFailed()
		&& !item->isEditingMedia()
		&& !IsAnchoredEphemeral(item)
		&& item->paidType() == PaidPostType::None
		? Selected(item->history()) : 0;
}

std::optional<MTPInputMedia> ExistingEditMedia(
		not_null<HistoryItem*> item,
		bool spoilered,
		const Api::VideoCoverEdit &videoCover) {
	const auto media = item->media();
	if (!media || (!videoCover && spoilered == media->hasSpoiler())) {
		return std::nullopt;
	}
	if (const auto photo = media->photo()) {
		using Flag = MTPDinputMediaPhoto::Flag;
		return MTP_inputMediaPhoto(
			MTP_flags((spoilered ? Flag::f_spoiler : Flag())
				| (media->ttlSeconds() ? Flag::f_ttl_seconds : Flag())),
			photo->mtpInput(), MTP_int(media->ttlSeconds()), MTPInputDocument());
	} else if (const auto document = media->document()) {
		using Flag = MTPDinputMediaDocument::Flag;
		const auto cover = videoCover.photo ? videoCover.photo
			: videoCover.cleared ? nullptr : media->videoCover();
		const auto timestamp = media->videoTimestamp();
		return MTP_inputMediaDocument(
			MTP_flags((spoilered ? Flag::f_spoiler : Flag())
				| (media->ttlSeconds() ? Flag::f_ttl_seconds : Flag())
				| (timestamp ? Flag::f_video_timestamp : Flag())
				| (cover ? Flag::f_video_cover : Flag())),
			document->mtpInput(),
			cover ? cover->mtpInput() : MTPInputPhoto(),
			MTP_int(media->ttlSeconds()), MTP_int(timestamp), MTPstring());
	}
	return std::nullopt;
}

OperationId SubmitEdit(
		not_null<HistoryItem*> item,
		BotId bot,
		const Edit &edit,
		Completion done,
		const std::shared_ptr<FilePrepareResult> &preview) {
	const auto history = item->history();
	if (item->fullId() != edit.message || !CanEditAs(item, bot)) {
		ShowSendError(history, { u"BOT_MESSAGE_NOT_EDITABLE"_q });
		return 0;
	}
	const auto id = item->fullId();
	const auto weak = base::make_weak(&history->session());
	const auto progress = preview
		? LocalUploadProgress(&history->session(), { LocalUploadTarget{
			.id = preview->id,
			.photo = preview->type == SendMediaType::Photo,
			.message = id,
		} })
		: UploadCallback();
	const auto operation = history->session().domain().botUse().editMessage(
		bot, edit, [weak, id, preview,
			done = std::move(done)](const Result &result) {
			if (const auto session = weak.get()) {
				auto &owner = session->data();
				const auto item = owner.message(id);
				if (result.state == OperationState::Completed) {
					for (const auto &message : result.data) {
						if (preview && item && message.type() == mtpc_message
							&& message.c_message().vid().v == id.msg.bare
							&& peerFromMTP(message.c_message().vpeer_id()) == id.peer) {
							if (const auto media = item->media()) {
								if (const auto server = message.c_message().vmedia()) {
									server->match([&](const MTPDmessageMediaPhoto &data) {
										if (const auto source = media->photo()) {
											if (const auto photo = data.vphoto()) {
												owner.processPhoto(*photo)->collectLocalData(source);
											}
										}
									}, [&](const MTPDmessageMediaDocument &data) {
										if (const auto source = media->document()) {
											if (const auto document = data.vdocument()) {
												owner.processDocument(*document)->collectLocalData(source);
											}
										}
									}, [&](const auto &) {});
								}
							}
						}
						if (preview && item && item->isEditingMedia()) {
							item->removeFromSharedMediaIndex();
							item->clearSavedMedia();
							item->addToSharedMediaIndex();
							item->setIsLocalUpdateMedia(true);
						}
						owner.updateEditedMessage(message);
						if (preview && item) {
							item->setIsLocalUpdateMedia(false);
						}
					}
				} else if (preview) {
					if (item) {
						item->returnSavedMedia();
					}
					FailLocalMediaUpload(session, preview->id,
						preview->type == SendMediaType::Photo);
				}
				owner.sendHistoryChangeNotifications();
			}
			if (done) {
				done(result);
			}
		}, progress);
	if (operation && preview) {
		PrepareLocalMediaPreview(&history->session(), preview);
		const auto media = LocalMedia(*preview);
		auto edition = HistoryMessageEdition();
		edition.mtpMedia = &media;
		edition.textWithEntities = edit.text.value_or(TextWithEntities());
		edition.invertMedia = edit.options.invertCaption;
		edition.useSameViews = true;
		edition.useSameForwards = true;
		edition.useSameMarkup = true;
		edition.useSameReplies = true;
		edition.useSameReactions = true;
		edition.useSameSuggest = true;
		edition.savePreviousMedia = true;
		item->applyEdition(std::move(edition));
		history->session().data().sendHistoryChangeNotifications();
	}
	return operation;
}

bool EditPrepared(
		BotId bot,
		not_null<Main::Session*> session,
		const std::shared_ptr<FilePrepareResult> &file) {
	if (!file || !file->to.replaceMediaOf) {
		return false;
	}
	const auto item = session->data().message(
		file->to.peer, file->to.replaceMediaOf);
	const auto done = file->to.botUseEditDone;
	if (!item || !CanEditAs(item, bot)) {
		if (const auto history = session->data().historyLoaded(file->to.peer)) {
			ShowSendError(history, { u"BOT_MESSAGE_NOT_EDITABLE"_q });
		}
		if (done) {
			(*done)(false, u"BOT_MESSAGE_NOT_EDITABLE"_q);
		}
		return false;
	}
	const auto operation = SubmitEdit(
		item,
		bot,
		Edit{
			.message = item->fullId(),
			.text = SnapshotText(file->caption),
			.media = file,
			.options = file->to.options,
		},
		[weak = base::make_weak(session.get()), done](const Result &result) {
			if (done) {
				(*done)(result.state == OperationState::Completed,
					result.error.type);
			} else if (result.state != OperationState::Completed) {
				if (const auto session = weak.get()) {
					if (const auto history = session->data().historyLoaded(result.peer)) {
						ShowSendError(history, result.error);
					}
				}
			}
		},
		file);
	if (!operation && done) {
		(*done)(false, u"BOT_EDIT_FAILED"_q);
	} else if (!operation) {
		ShowSendError(item->history(), { u"BOT_EDIT_FAILED"_q });
	}
	return operation != 0;
}

BotId RichDraftBot(not_null<History*> history, const FullReplyTo &reply) {
	return history->session().botUseChats().richDraftBot(
		history->peer->id,
		reply.topicRootId,
		reply.monoforumPeerId).value_or(0);
}

Completion RichDraftCompletion(
		const Api::SendAction &action,
		std::shared_ptr<const Iv::RichPage> expected) {
	if (!action.clearDraft) {
		return {};
	}
	const auto history = action.history;
	const auto peer = history->peer->id;
	const auto topicRootId = action.replyTo.topicRootId;
	const auto monoforumPeerId = action.replyTo.monoforumPeerId;
	const auto draft = history->cloudDraft(topicRootId, monoforumPeerId);
	if (!expected) {
		expected = draft ? draft->richMessage : nullptr;
	}
	if (!expected) {
		return {};
	}
	return [weak = base::make_weak(&history->session()),
			peer, topicRootId, monoforumPeerId, expected](const Result &result) {
		if (result.state != OperationState::Completed) {
			return;
		}
		const auto session = weak.get();
		const auto history = session
			? session->data().historyLoaded(peer) : nullptr;
		if (!history) {
			return;
		}
		const auto current = history->cloudDraft(topicRootId, monoforumPeerId);
		if (current && current->richMessage != expected) {
			return;
		}
		session->botUseChats().clearRichDraft(
			peer, topicRootId, monoforumPeerId);
		history->clearCloudDraft(topicRootId, monoforumPeerId);
		if (const auto thread = history->threadFor(
				topicRootId, monoforumPeerId)) {
			const auto cleared = history->createCloudDraft(
				topicRootId, monoforumPeerId, nullptr);
			if (cleared) {
				session->api().saveDraftToCloud(not_null{ thread }, *cleared);
			}
		}
		history->applyCloudDraft(topicRootId, monoforumPeerId);
	};
}

Error ValidateSend(BotId bot, const Api::SendAction &action) {
	const auto history = action.history;
	if (!bot) {
		return { u"BOT_NOT_SELECTED"_q };
	}
	if (action.replaceMediaOf) {
		return { u"UNSUPPORTED_SEND_OPTIONS"_q };
	}
	if (!history->forwardDraft(action.replyTo.topicRootId,
			action.replyTo.monoforumPeerId).ids.empty()) {
		return { u"UNSUPPORTED_FORWARD"_q };
	}
	const auto info = FindBot(history, bot);
	if (!info.userId
		|| info.environment != history->session().mtp().environment()) {
		return { u"BOT_NOT_AVAILABLE"_q };
	}
	auto snapshot = Action();
	return SnapshotAction(action, snapshot);
}

void ShowSendError(not_null<History*> history, const Error &error) {
	if (error.silent()) {
		return;
	}
	if (const auto window = history->session().tryResolveWindow(history->peer)) {
		window->showToast(error.type.isEmpty()
			? u"BotUse send failed"_q
			: error.type);
	}
}

void PrepareLocalMediaPreview(
		not_null<Main::Session*> session,
		const std::shared_ptr<FilePrepareResult> &file) {
	if (!file) {
		return;
	}
	if (file->type == SendMediaType::Photo) {
		const auto photo = file->photoThumbs.empty()
			? session->data().processPhoto(file->photo)
			: session->data().processPhoto(file->photo, file->photoThumbs);
		photo->uploadingData = std::make_unique<Data::UploadState>(
			file->partssize > 0 ? file->partssize : file->content.size());
		auto media = photo->createMediaView();
		const auto best = [&]() -> const PreparedPhotoThumb* {
			for (const auto level : { 'y', 'w', 'x', 'm', 'c', 'b', 'a' }) {
				if (const auto i = file->photoThumbs.find(level);
					i != end(file->photoThumbs) && !i->second.image.isNull()) {
					return &i->second;
				}
			}
			return nullptr;
		}();
		const auto bytes = best && !best->bytes.isEmpty()
			? best->bytes
			: !file->content.isEmpty()
			? file->content : file->thumbbytes;
		const auto image = best
			? best->image
			: !file->thumb.isNull()
			? file->thumb : QImage::fromData(bytes);
		if (!image.isNull()) {
			for (const auto size : { Data::PhotoSize::Small,
					Data::PhotoSize::Thumbnail, Data::PhotoSize::Large }) {
				media->set(size, Data::PhotoSize::Large, image, bytes);
			}
		}
		session->data().keepAlive(std::move(media));
		return;
	}
	const auto thumbnail = file->thumb.isNull()
		? ImageWithLocation()
		: Images::FromImageInMemory(
			file->thumb,
			"JPG",
			file->thumbbytes);
	const auto document = session->data().processDocument(
		file->document, thumbnail);
	document->uploadingData = std::make_unique<Data::UploadState>(
		file->filesize > 0 ? file->filesize : file->content.size());
	auto media = document->createMediaView();
	if (!file->thumb.isNull()) {
		media->setThumbnail(file->thumb);
	}
	if (!file->goodThumbnail.isNull()) {
		media->setGoodThumbnail(file->goodThumbnail);
	}
	if (!file->content.isEmpty()) {
		media->setBytes(file->content);
		document->setDataAndCache(file->content);
	}
	if (!file->filepath.isEmpty()) {
		document->setLocation(Core::FileLocation(file->filepath));
	}
	session->data().keepAlive(std::move(media));
}

void ApplyLocalMediaUploadProgress(
		not_null<Main::Session*> session,
		const UploadProgress &progress) {
	const auto size = std::max(progress.size, int64(0));
	const auto offset = std::clamp(progress.offset, int64(0), size);
	if (progress.photo) {
		const auto photo = session->data().photo(PhotoId(progress.id));
		if (!photo->uploadingData) {
			photo->uploadingData = std::make_unique<Data::UploadState>(size);
		}
		photo->uploadingData->size = size;
		photo->uploadingData->offset = offset;
	} else {
		const auto document = session->data().document(DocumentId(progress.id));
		if (!document->uploadingData) {
			document->uploadingData = std::make_unique<Data::UploadState>(size);
		}
		document->uploadingData->size = size;
		document->uploadingData->offset = offset;
	}
}

void FailLocalMediaUpload(
		not_null<Main::Session*> session,
		uint64 id,
		bool photo) {
	if (photo) {
		session->data().photo(PhotoId(id))->uploadingData = nullptr;
	} else {
		const auto document = session->data().document(DocumentId(id));
		document->uploadingData = nullptr;
		document->status = FileUploadFailed;
	}
}

bool SendText(BotId bot, Api::MessageToSend message, std::optional<MsgId> localId) {
	const auto history = message.action.history;
	if (const auto error = ValidateSend(bot, message.action)) {
		ShowSendError(history, error);
		return false;
	}
	const auto info = FindBot(history, bot);
	auto left = SnapshotText(message.textWithTags);
	TextUtilities::PrepareForSending(left,
		Ui::ItemTextOptions(history, history->session().user()).flags);
	auto sending = TextWithEntities();
	auto locals = std::vector<FullMsgId>();
	const auto limit = Data::PremiumLimits(&history->session()).messageLengthDefault();
	const auto web = !message.webPage.url.isEmpty();
	auto first = true;
	while (TextUtilities::CutPart(sending, left, limit) || (first && web)) {
		TextUtilities::Trim(sending);
		const auto id = FullMsgId(history->peer->id,
			localId ? std::exchange(localId, std::nullopt).value()
				: history->session().data().nextLocalMessageId());
		locals.push_back(id);
		const auto part = TextWithTags{
			sending.text,
			TextUtilities::ConvertEntitiesToTextTags(sending.entities),
		};
		auto current = message;
		current.textWithTags = part;
		if (!left.empty()) {
			current.webPage = {};
		}
		history->addNewLocalMessage(
			LocalFields(current.action, info.userId, id.msg),
			sending, MTP_messageMediaEmpty());
		history->session().botUseChats().beginSend(id, info.userId);
		history->session().api().sendAction(current.action);
		const auto completion = CompletionFor(history, { id });
		const auto operation = history->session().domain().botUse().sendText(
			bot, current, completion);
		if (!operation) {
			return false;
		}
		first = false;
	}
	if (!locals.empty()) {
		NotifySent(history);
	}
	return true;
}

bool SendRich(
		BotId bot,
		std::shared_ptr<const Iv::RichPage> page,
		Api::SendAction action,
		const std::vector<RichMediaSource> &sources,
		Completion done) {
	const auto history = action.history;
	if (const auto error = ValidateSend(bot, action)) {
		ShowSendError(history, error);
		return false;
	}
	if (!page) {
		ShowSendError(history, { u"RICH_MESSAGE_EMPTY"_q });
		return false;
	}
	auto probe = Operation();
	if (const auto error = SnapshotRich(*page, sources, probe)) {
		ShowSendError(history, error);
		return false;
	}
	const auto id = FullMsgId(history->peer->id,
		history->session().data().nextLocalMessageId());
	const auto info = FindBot(history, bot);
	auto targets = std::vector<LocalUploadTarget>();
	for (const auto &source : sources) {
		if (source.file) {
			PrepareLocalMediaPreview(&history->session(), source.file);
			targets.push_back({
				.id = source.file->id,
				.photo = source.file->type == SendMediaType::Photo,
				.message = id,
			});
		}
	}
	const auto item = history->addNewLocalMessage(
		LocalFields(action, info.userId, id.msg),
		TextWithEntities(), MTP_messageMediaEmpty());
	item->applyLocalRichPage(page);
	history->session().botUseChats().beginSend(id, info.userId);
	history->session().api().sendAction(action);
	const auto operation = history->session().domain().botUse().sendRichMessage(
		bot, page, action,
		CompletionFor(history, { id }, std::move(done)),
		sources,
		LocalUploadProgress(&history->session(), std::move(targets)));
	if (!operation) {
		return false;
	}
	NotifySent(history);
	return true;
}

bool SendPrepared(
		BotId bot,
		not_null<Main::Session*> session,
		const std::shared_ptr<FilePrepareResult> &file,
		std::optional<MsgId> localId) {
	if (!file) {
		return false;
	}
	const auto history = session->data().history(file->to.peer);
	auto action = Api::SendAction(history, file->to.options);
	action.replyTo = file->to.replyTo;
	action.clearDraft = false;
	action.originWindow = file->to.originWindow;
	if (const auto error = ValidateSend(bot, action)) {
		ShowSendError(history, error);
		return false;
	}
	auto files = std::vector<std::shared_ptr<FilePrepareResult>>();
	const auto album = file->album.lock();
	if (album) {
		const auto item = ranges::find(album->items, file->taskId, &SendingAlbum::Item::taskId);
		if (item == end(album->items)) {
			return false;
		}
		item->prepared = file;
		if (!ranges::all_of(album->items, [](const SendingAlbum::Item &item) {
			return bool(item.prepared);
		})) {
			return true;
		}
		if (album->sent) {
			return true;
		}
		album->sent = true;
		for (const auto &entry : album->items) {
			files.push_back(entry.prepared);
		}
	} else {
		files.push_back(file);
	}
	for (const auto &prepared : files) {
		auto source = MediaSource();
		if (const auto error = SnapshotMedia(*prepared, source)) {
			ShowSendError(history, error);
			return false;
		}
		PrepareLocalMediaPreview(session, prepared);
	}
	const auto info = FindBot(history, bot);
	auto locals = std::vector<FullMsgId>();
	auto targets = std::vector<LocalUploadTarget>();
	for (const auto &prepared : files) {
		const auto id = FullMsgId(history->peer->id,
			localId ? std::exchange(localId, std::nullopt).value()
				: session->data().nextLocalMessageId());
		locals.push_back(id);
		targets.push_back({
			.id = prepared->id,
			.photo = prepared->type == SendMediaType::Photo,
			.message = id,
		});
		auto caption = SnapshotText(prepared->caption);
		TextUtilities::Trim(caption);
		const auto itemAction = Api::SendAction(history, action.options);
		history->addNewLocalMessage(
			LocalFields(itemAction, info.userId, id.msg,
				(files.size() > 1 && album) ? album->groupId : 0),
			caption, LocalMedia(*prepared));
		session->botUseChats().beginSend(id, info.userId);
	}
	session->api().sendAction(action);
	const auto completion = CompletionFor(history, locals);
	auto operation = OperationId();
	if (files.size() > 1) {
		operation = session->domain().botUse().sendAlbum(
			bot,
			action,
			files,
			completion,
			LocalUploadProgress(session, std::move(targets)));
	} else {
		auto message = Api::MessageToSend(action);
		message.textWithTags = files.front()->caption;
		operation = session->domain().botUse().sendMedia(
			bot,
			message,
			files.front(),
			completion,
			LocalUploadProgress(session, std::move(targets)));
	}
	if (!operation) {
		return false;
	}
	NotifySent(history);
	return true;
}

bool SendExisting(
		BotId bot,
		Api::MessageToSend message,
		PhotoData *photo,
		DocumentData *document,
		std::optional<MsgId> localId) {
	const auto history = message.action.history;
	if (const auto error = ValidateSend(bot, message.action)) {
		ShowSendError(history, error);
		return false;
	}
	if (!photo && !document) {
		return false;
	}
	const auto available = photo
		? (!photo->createMediaView()->imageBytes(Data::PhotoSize::Large).isEmpty()
			|| !photo->location(true).isEmpty())
		: (!document->createMediaView()->bytes().isEmpty()
			|| !document->location(true).isEmpty());
	if (!available) {
		const auto lifetime = std::make_shared<rpl::lifetime>();
		const auto weak = base::make_weak(&history->session());
		const auto resume = [=] {
			if (!weak.get()) {
				lifetime->destroy();
				return;
			}
			const auto ready = photo
				? (!photo->createMediaView()->imageBytes(Data::PhotoSize::Large).isEmpty()
					|| !photo->location(true).isEmpty())
				: (!document->createMediaView()->bytes().isEmpty()
					|| !document->location(true).isEmpty());
			if (ready) {
				lifetime->destroy();
				if (!SendExisting(bot, message, photo, document, localId)) {
					ShowSendError(history, { u"MEDIA_SOURCE_MISSING"_q });
				}
			} else if (photo ? photo->failed(Data::PhotoSize::Large)
				: !document->loading()) {
				lifetime->destroy();
				ShowSendError(history, { u"MEDIA_SOURCE_MISSING"_q });
			}
		};
		if (photo) {
			history->session().data().photoLoadProgress(
			) | rpl::filter([=](not_null<PhotoData*> value) {
				return value == photo;
			}) | rpl::on_next(resume, *lifetime);
			photo->load(Data::PhotoSize::Large, Data::FileOrigin());
		} else {
			history->session().data().documentLoadProgress(
			) | rpl::filter([=](not_null<DocumentData*> value) {
				return value == document;
			}) | rpl::on_next(resume, *lifetime);
			document->save(Data::FileOrigin(), QString(),
				LoadFromCloudOrLocal, true);
		}
		return true;
	}
	const auto id = base::RandomValue<uint64>();
	auto descriptor = FilePrepareDescriptor{
		.id = id,
		.type = photo ? SendMediaType::Photo : SendMediaType::File,
		.to = FileLoadTo(history->peer->id, message.action.options,
			message.action.replyTo, MsgId()),
		.caption = message.textWithTags,
	};
	descriptor.to.botUse = bot;
	auto prepared = std::make_shared<FilePrepareResult>(std::move(descriptor));
	if (photo) {
		prepared->content = photo->createMediaView()->imageBytes(Data::PhotoSize::Large);
		prepared->filepath = photo->location(true).name();
		prepared->photo = MTP_photoEmpty(MTP_long(id));
		prepared->filename = u"photo.jpg"_q;
		prepared->filemime = u"image/jpeg"_q;
	} else {
		prepared->content = document->createMediaView()->bytes();
		prepared->filepath = document->location(true).name();
		prepared->type = document->isVoiceMessage()
			? SendMediaType::Audio
			: document->isVideoMessage()
			? SendMediaType::Round
			: SendMediaType::File;
		prepared->document = MTP_document(
			MTP_flags(0), MTP_long(id), MTP_long(0), MTP_bytes(),
			MTP_int(base::unixtime::now()), MTP_string(document->mimeString()),
			MTP_long(document->size), MTPVector<MTPPhotoSize>(),
			MTPVector<MTPVideoSize>(), MTP_int(0),
			Api::ComposeSendingDocumentAttributes(document));
		prepared->filename = document->filename();
		prepared->filemime = document->mimeString();
		prepared->forceFile = document->isVideoFile();
	}
	if (prepared->content.isEmpty() && prepared->filepath.isEmpty()) {
		ShowSendError(history, { u"MEDIA_SOURCE_MISSING"_q });
		return false;
	}
	const auto fullId = FullMsgId(history->peer->id,
		localId ? *localId : history->session().data().nextLocalMessageId());
	PrepareLocalMediaPreview(&history->session(), prepared);
	const auto info = FindBot(history, bot);
	auto caption = SnapshotText(message.textWithTags);
	TextUtilities::Trim(caption);
	const auto fields = LocalFields(message.action, info.userId, fullId.msg);
	history->addNewLocalMessage(
		HistoryItemCommonFields(fields),
		caption,
		LocalMedia(*prepared));
	history->session().botUseChats().beginSend(fullId, info.userId);
	history->session().api().sendAction(message.action);
	const auto operation = history->session().domain().botUse().sendMedia(
		bot,
		message,
		prepared,
		CompletionFor(history, { fullId }),
		LocalUploadProgress(&history->session(), { LocalUploadTarget{
			.id = prepared->id,
			.photo = prepared->type == SendMediaType::Photo,
			.message = fullId,
		} }));
	if (!operation) {
		return false;
	}
	NotifySent(history);
	return true;
}

} // namespace BotUse
