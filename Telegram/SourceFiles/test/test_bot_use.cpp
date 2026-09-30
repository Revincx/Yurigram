#include "test/test_bot_use.h"

#ifdef _DEBUG

#include "api/api_send_progress.h"
#include "bot_use/bot_use_adapter.h"
#include "bot_use/bot_use_chat_state.h"
#include "bot_use/bot_use_manager.h"
#include "bot_use/bot_use_sending.h"
#include "core/application.h"
#include "data/data_session.h"
#include "data/data_document.h"
#include "data/data_photo_media.h"
#include "data/data_document_media.h"
#include "data/data_message_reactions.h"
#include "history/history.h"
#include "history/history_item.h"
#include "iv/editor/iv_editor_session.h"
#include "iv/editor/iv_editor_widget.h"
#include "iv/iv_rich_message_serializer.h"
#include "lang/lang_keys.h"
#include "main/main_account.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "main/main_session_settings.h"
#include "mtproto/facade.h"
#include "storage/localimageloader.h"
#include "test/test_agent.h"
#include "test/test_log.h"
#include "test/test_rpc_fixture.h"
#include "test/test_runner.h"
#include "test/test_widgets.h"
#include "ui/widgets/buttons.h"
#include "window/window_session_controller.h"

#include <QtWidgets/QApplication>
#include <QtCore/QBuffer>

#include <map>

namespace Test {
namespace {

using Respond = Fn<void(QPointer<MTP::Instance>, mtpRequestId, mtpBuffer)>;
Respond Responder;

template <typename Value>
Value Decode(const mtpBuffer &buffer) {
	auto result = Value();
	auto from = buffer.constData();
	const auto valid = result.read(from, from + buffer.size());
	Check(valid && from == buffer.constData() + buffer.size(), u"BotUse fixture decodes completely"_q);
	Expects(valid);
	return result;
}

template <typename Value>
Value Read(const mtpPrime *&from, const mtpPrime *end) {
	auto result = Value();
	const auto valid = result.read(from, end);
	Check(valid, u"BotUse request field decodes"_q);
	Expects(valid);
	return result;
}

template <typename Request>
void Reply(QPointer<MTP::Instance> instance, mtpRequestId id,
		const typename Request::ResponseType &value) {
	if (instance && instance->hasCallback(id)) {
		const auto result = DeliverControlledRpcSuccess<Request>(instance.data(), id, value);
		Check(result.diagnosis.isEmpty(), u"BotUse RPC delivery"_q, result.diagnosis);
	}
}

MTPUser User(uint64 id, bool bot = true) {
	auto buffer = mtpBuffer{ mtpPrime(mtpc_user), mtpPrime(1024 | 2 | (bot ? 16384 : 0)), 0 };
	MTP_long(id).write(buffer);
	MTP_string("BotUse fixture").write(buffer);
	if (bot) { MTP_int(0).write(buffer); }
	return Decode<MTPUser>(buffer);
}

MTPChat Channel(uint64 id) {
	auto buffer = mtpBuffer{ mtpPrime(mtpc_channel), mtpPrime(8192 | (id == 100 ? 32 : 256)), 0 };
	MTP_long(id).write(buffer);
	MTP_long(9876).write(buffer);
	MTP_string("BotUse fixture channel").write(buffer);
	MTPChatPhoto(MTP_chatPhotoEmpty()).write(buffer);
	MTP_int(1).write(buffer);
	return Decode<MTPChat>(buffer);
}

MTPMessage Message(int id, uint64 peer, uint64 author,
		std::optional<MTPRichMessage> rich = {},
		QString text = u"fixture message"_q,
		std::optional<MTPMessageMedia> media = {}) {
	auto buffer = mtpBuffer{
		mtpPrime(mtpc_message), mtpPrime(256 | (media ? 512 : 0)),
		mtpPrime(rich ? 8192 : 0) };
	MTP_int(id).write(buffer);
	MTPPeer(MTP_peerUser(MTP_long(author))).write(buffer);
	MTPPeer(MTP_peerChannel(MTP_long(peer))).write(buffer);
	MTP_int(1).write(buffer);
	MTP_string(text).write(buffer);
	if (media) { media->write(buffer); }
	if (rich) { rich->write(buffer); }
	return Decode<MTPMessage>(buffer);
}

MTPmessages_Messages Messages(const std::vector<MTPMessage> &messages) {
	return MTP_messages_messages(
		MTP_vector<MTPMessage>(QVector<MTPMessage>(messages.begin(), messages.end())),
		MTP_vector<MTPForumTopic>(), MTP_vector<MTPChat>(), MTP_vector<MTPUser>());
}

MTPPhoto RichPhoto(const QByteArray &reference) {
	return MTP_photo(
		MTP_flags(0), MTP_long(9200), MTP_long(9201), MTP_bytes(reference),
		MTP_int(1), MTP_vector<MTPPhotoSize>(1, MTP_photoSize(
			MTP_string("x"), MTP_int(32), MTP_int(32), MTP_int(512))),
		MTP_vector<MTPVideoSize>(), MTP_int(2));
}

Iv::Editor::Widget *FindRichEditor() {
	for (const auto window : QApplication::topLevelWidgets()) {
		if (const auto editor = FindFirst<Iv::Editor::Widget>(window)) {
			if (!editor->isHidden()) {
				return editor;
			}
		}
	}
	return nullptr;
}

void SaveRichEditor(not_null<Iv::Editor::Widget*> editor) {
	const auto activation = ForceWindowActive(editor->window());
	Check(activation.refusal.isEmpty(), u"Rich editor window activates"_q);
	for (const auto button : FindAll<Ui::AbstractButton>(editor->window())) {
		if (button->accessibleName() == tr::lng_settings_save(tr::now)) {
			Click(button);
			return;
		}
	}
	Fail(u"Rich editor Save button is available"_q);
}

struct Fixture {
	BotUse::Manager *manager = nullptr;
	BotUse::BotId a = 0;
	BotUse::BotId b = 0;
	BotUse::OperationId operation = 0;
	std::optional<BotUse::Result> result;
	std::map<MTP::Instance*, uint64> users;
	std::map<uint64, int> randoms;
	std::map<int, MTPMessage> messages;
	std::set<uint64> failedRandoms;
	int nextMessage = 1000;
	int deletes = 0;
	int edits = 0;
	bool preparedEdited = false;
	bool preparedDone = false;
	int editBefore = 0;
	uint64 editUser = 0;
	bool editRich = false;
	bool omitEditUpdate = false;
	uint64 richReadUser = 0;
	int richReadId = 0;
	QByteArray richEditReference;
	int auths = 0;
	int parts = 0;
	int uploads = 0;
	int typings = 0;
	int reactionsSent = 0;
	uint64 reactionUser = 0;
	uint64 reactionPeer = 0;
	int reactionMessage = 0;
	bool reactionRemoved = false;
	bool reactionAddedToRecent = false;
	int typingBefore = 0;
	uint64 typingUser = 0;
	uint64 typingPeer = 0;
	int typingTop = 0;
	mtpTypeId typingAction = 0;
	FullMsgId local;
	FullMsgId expectedReal;
	FullMsgId editTarget;
	std::shared_ptr<const Iv::RichPage> editOriginal;
	bool delayedBotResult = false;
	QPointer<MTP::Instance> delayedInstance;
	mtpRequestId delayedRequest = 0;
	std::optional<MTPUpdates> delayedUpdates;
	bool retryNext = false;
	bool rejectNext = false;
	bool hold = false;
	std::vector<mtpBuffer> sent;
	std::vector<bool> textNoForwards;
	std::vector<bool> mediaNoForwards;
	std::vector<BotUse::UploadProgress> uploadProgress;

	void respond(QPointer<MTP::Instance> instance, mtpRequestId id, mtpBuffer body);
	BotUse::Completion completion();
	Api::MessageToSend text(uint64 channel = 100);
};

BotUse::Completion Fixture::completion() {
	result.reset();
	return [this](const BotUse::Result &value) { result = value; };
}

Api::MessageToSend Fixture::text(uint64 channel) {
	const auto session = Core::App().domain().active().maybeSession();
	const auto peer = session->data().processChat(Channel(channel));
	auto result = Api::MessageToSend(Api::SendAction(session->data().history(peer)));
	result.textWithTags.text = u"BotUse fixture text"_q;
	return result;
}

void Fixture::respond(QPointer<MTP::Instance> instance, mtpRequestId id, mtpBuffer body) {
	if (!instance || !instance->hasCallback(id)) { return; }
	Check(body.size() > 1 && body.front() == mtpc_invokeWithoutUpdates,
		u"Every bot RPC is wrapped without updates"_q);
	if (body.size() < 2) { return; }
	body.removeFirst();
	sent.push_back(body);
	switch (mtpTypeId(body.front())) {
	case mtpc_auth_importBotAuthorization: {
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		const auto flags = Read<MTPint>(from, end);
		const auto apiId = Read<MTPint>(from, end);
		const auto apiHash = Read<MTPstring>(from, end);
		const auto botToken = Read<MTPstring>(from, end);
		Check(!flags.v && from == end && apiId.v == manager->apiId()
			&& instance->apiId() == manager->apiId(),
			u"All bots use the manager API ID in authentication and transport"_q);
		Check(qs(apiHash) == u"0123456789abcdef0123456789abcdef"_q,
			u"Bot authentication uses shared API hash"_q);
		const auto token = qs(botToken);
		if (token == u"fixture-invalid"_q) {
			const auto delivered = DeliverControlledRpcError(
				instance.data(), id, 400, u"ACCESS_TOKEN_INVALID"_q);
			Check(delivered.diagnosis.isEmpty(),
				u"Invalid bot token RPC delivery"_q,
				delivered.diagnosis);
			break;
		}
		const auto user = token == u"fixture-a"_q ? 11 : token == u"fixture-b"_q ? 22 : 33;
		users[instance.data()] = user;
		++auths;
		Reply<MTPauth_ImportBotAuthorization>(instance, id,
			MTP_auth_authorization(MTP_flags(0), MTPint(), MTPint(), MTPbytes(), User(user)));
	} break;
	case mtpc_users_getUsers:
		Reply<MTPusers_GetUsers>(instance, id, MTP_vector<MTPUser>(1, User(users.at(instance.data()))));
		break;
	case mtpc_channels_getChannels: {
		auto from = body.constData() + 1;
		const auto channels = Read<MTPVector<MTPInputChannel>>(from, body.constData() + body.size());
		const auto channel = channels.v.front().c_inputChannel().vchannel_id().v;
		Reply<MTPchannels_GetChannels>(instance, id, MTP_messages_chats(MTP_vector<MTPChat>(1, Channel(channel))));
	} break;
	case mtpc_messages_sendMessage: {
		if (hold) { return; }
		if (rejectNext) {
			rejectNext = false;
			const auto delivered = DeliverControlledRpcError(
				instance.data(), id, 400, u"CHAT_WRITE_FORBIDDEN"_q);
			Check(delivered.diagnosis.isEmpty(),
				u"Rejected bot send returns RPC error"_q, delivered.diagnosis);
			return;
		}
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		const auto flags = Read<MTPint>(from, end).v;
		textNoForwards.push_back(flags & (1 << 14));
		const auto peer = Read<MTPInputPeer>(from, end);
		if (flags & 1) { Read<MTPInputReplyTo>(from, end); }
		const auto text = Read<MTPstring>(from, end);
		const auto random = Read<MTPlong>(from, end).v;
		const auto channel = peer.c_inputPeerChannel().vchannel_id().v;
		const auto [i, added] = randoms.emplace(random, nextMessage++);
		if (retryNext) {
			retryNext = false;
			failedRandoms.emplace(random);
			const auto delivered = DeliverControlledRpcError(instance.data(), id, 500, u"BOTUSE_RETRY_FIXTURE"_q);
			Check(delivered.invokedProcessCallback, u"Retry fixture reached RPC error path"_q);
			return;
		}
		if (!failedRandoms.empty()) {
			Check(!added && failedRandoms.contains(random), u"Retry preserves random_id"_q);
			failedRandoms.clear();
		}
		auto rich = std::optional<MTPRichMessage>();
		if (flags & (1 << 23)) {
			const auto value = Read<MTPInputRichMessage>(from, end);
			Check(value.type() == mtpc_inputRichMessage, u"Rich request uses existing TL structure"_q);
			rich = MTP_richMessage(MTP_flags(0), value.c_inputRichMessage().vblocks(),
				MTP_vector<MTPPhoto>(), MTP_vector<MTPDocument>());
		}
		const auto message = Message(i->second, channel, users.at(instance.data()), rich);
		messages.emplace(i->second, message);
		auto updates = QVector<MTPUpdate>();
		updates.push_back(MTP_updateMessageID(MTP_int(i->second), MTP_long(random)));
		updates.push_back(MTP_updateNewChannelMessage(message, MTP_int(1), MTP_int(1)));
		auto response = MTP_updates(
			MTP_vector<MTPUpdate>(updates), MTP_vector<MTPUser>(), MTP_vector<MTPChat>(),
			MTP_int(1), MTP_int(1));
		if (delayedBotResult) {
			delayedBotResult = false;
			delayedInstance = instance;
			delayedRequest = id;
			delayedUpdates = response;
		} else {
			Reply<MTPmessages_SendMessage>(instance, id, response);
		}
	} break;
	case mtpc_messages_editMessage: {
		++edits;
		editUser = users.at(instance.data());
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		const auto flags = Read<MTPint>(from, end).v;
		const auto peer = Read<MTPInputPeer>(from, end);
		const auto messageId = Read<MTPint>(from, end);
		const auto text = (flags & (1 << 11))
			? qs(Read<MTPstring>(from, end)) : u"fixture message"_q;
		auto replacement = std::optional<MTPMessageMedia>();
		if (flags & (1 << 14)) {
			const auto input = Read<MTPInputMedia>(from, end);
			if (input.type() == mtpc_inputMediaPhoto) {
				replacement = MTP_messageMediaPhoto(
					MTP_flags(MTPDmessageMediaPhoto::Flag::f_photo),
					RichPhoto("fixture-reference"), MTPint(), MTPDocument());
			}
		}
		if (flags & (1 << 2)) { Read<MTPReplyMarkup>(from, end); }
		if (flags & (1 << 3)) { Read<MTPVector<MTPMessageEntity>>(from, end); }
		if (flags & (1 << 15)) { Read<MTPint>(from, end); }
		if (flags & (1 << 18)) { Read<MTPint>(from, end); }
		if (flags & (1 << 17)) { Read<MTPint>(from, end); }
		editRich = flags & (1 << 23);
		Check(!editRich || !(flags & (1 << 14)),
			u"Rich edits do not replace the outer message media"_q);
		auto rich = std::optional<MTPRichMessage>();
		if (editRich) {
			const auto input = Read<MTPInputRichMessage>(from, end);
			const auto &content = input.c_inputRichMessage();
			if (const auto photos = content.vphotos()) {
				richEditReference = photos->v.front()
					.c_inputPhoto().vfile_reference().v;
			}
			rich = MTP_richMessage(
				MTP_flags(0),
				content.vblocks(),
				content.vphotos()
					? MTP_vector<MTPPhoto>(1, RichPhoto("bot-fixture-reference"))
					: MTP_vector<MTPPhoto>(),
				MTP_vector<MTPDocument>());
		}
		Check(from == end, u"Bot rich edit request decodes completely"_q);
		if (rejectNext) {
			rejectNext = false;
			const auto delivered = DeliverControlledRpcError(
				instance.data(), id, 400, u"CHAT_ADMIN_REQUIRED"_q);
			Check(delivered.diagnosis.isEmpty(), u"Bot edit failure is delivered"_q);
			return;
		}
		const auto channel = peer.c_inputPeerChannel().vchannel_id().v;
		const auto message = Message(
			messageId.v, channel, editUser, rich, text, replacement);
		messages.insert_or_assign(messageId.v, message);
		if (base::take(omitEditUpdate)) {
			Reply<MTPmessages_EditMessage>(instance, id, MTP_updates(
				MTP_vector<MTPUpdate>(), MTP_vector<MTPUser>(),
				MTP_vector<MTPChat>(), MTP_int(1), MTP_int(1)));
		} else {
			Reply<MTPmessages_EditMessage>(instance, id, MTP_updateShort(
			MTP_updateEditChannelMessage(message,
				MTP_int(1), MTP_int(1)), MTP_int(1)));
		}
	} break;
	case mtpc_messages_getRichMessage: {
		Fail(u"BotUse avoids user-only rich message fetches"_q);
	} break;
	case mtpc_channels_getMessages: {
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		const auto channel = Read<MTPInputChannel>(from, end);
		const auto requested = Read<MTPVector<MTPInputMessage>>(from, end);
		auto result = std::vector<MTPMessage>();
		for (const auto &item : requested.v) {
			const auto mid = item.c_inputMessageID().vid().v;
			const auto i = messages.find(mid);
			if (i != messages.end()
				&& i->second.type() == mtpc_message
				&& i->second.c_message().vrich_message()) {
				richReadId = mid;
				richReadUser = users.at(instance.data());
			}
			result.push_back(i == messages.end()
				? Message(mid, channel.c_inputChannel().vchannel_id().v, 77)
				: i->second);
		}
		Reply<MTPchannels_GetMessages>(instance, id, Messages(result));
	} break;
	case mtpc_channels_deleteMessages:
		++deletes;
		Reply<MTPchannels_DeleteMessages>(instance, id, MTP_messages_affectedMessages(MTP_int(1), MTP_int(1)));
		break;
	case mtpc_upload_saveFilePart:
		++parts;
		Reply<MTPupload_SaveFilePart>(instance, id, MTP_boolTrue());
		break;
	case mtpc_upload_saveBigFilePart:
		++parts;
		Reply<MTPupload_SaveBigFilePart>(instance, id, MTP_boolTrue());
		break;
	case mtpc_messages_uploadMedia: {
		++uploads;
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		Read<MTPint>(from, end);
		Read<MTPInputPeer>(from, end);
		const auto media = Read<MTPInputMedia>(from, end);
		Check(media.type() == mtpc_inputMediaUploadedPhoto, u"Bot uploader creates native photo input"_q);
		Reply<MTPmessages_UploadMedia>(instance, id, MTP_messageMediaPhoto(
			MTP_flags(MTPDmessageMediaPhoto::Flag::f_photo),
			MTP_photo(MTP_flags(0), MTP_long(8000), MTP_long(8100), MTP_bytes("fixture-reference"),
				MTP_int(1), MTP_vector<MTPPhotoSize>(), MTP_vector<MTPVideoSize>(), MTP_int(2)),
			MTPint(), MTPDocument()));
	} break;
	case mtpc_messages_setTyping: {
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		const auto flags = Read<MTPint>(from, end).v;
		const auto peer = Read<MTPInputPeer>(from, end);
		const auto top = (flags & 1) ? Read<MTPint>(from, end).v : 0;
		const auto actionType = mtpTypeId(*from++);
		auto action = MTPsendMessageAction();
		const auto actionValid = action.read(from, end, actionType);
		Check(actionValid && from == end,
			u"Bot typing request decodes completely"_q);
		++typings;
		typingUser = users.at(instance.data());
		typingPeer = peer.c_inputPeerChannel().vchannel_id().v;
		typingTop = top;
		typingAction = actionType;
		Reply<MTPmessages_SetTyping>(instance, id, MTP_boolTrue());
	} break;
	case mtpc_messages_sendReaction: {
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		const auto flags = Read<MTPint>(from, end).v;
		const auto peer = Read<MTPInputPeer>(from, end);
		const auto message = Read<MTPint>(from, end).v;
		const auto chosen = (flags & 1)
			? Read<MTPVector<MTPReaction>>(from, end).v
			: QVector<MTPReaction>();
		Check(from == end && peer.type() == mtpc_inputPeerChannel,
			u"Bot reaction request decodes completely"_q);
		Check(chosen.size() <= 1
			&& (chosen.empty() || !Data::ReactionFromMTP(chosen.front()).custom()),
			u"Bot sends only ordinary reactions"_q);
		++reactionsSent;
		reactionUser = users.at(instance.data());
		reactionPeer = peer.c_inputPeerChannel().vchannel_id().v;
		reactionMessage = message;
		reactionRemoved = chosen.empty();
		reactionAddedToRecent = flags & (1 << 2);
		Reply<MTPmessages_SendReaction>(instance, id, MTP_updates(
			MTP_vector<MTPUpdate>(), MTP_vector<MTPUser>(),
			MTP_vector<MTPChat>(), MTP_int(1), MTP_int(1)));
	} break;
	case mtpc_messages_sendMedia: {
		auto from = body.constData() + 1;
		const auto end = body.constData() + body.size();
		const auto flags = Read<MTPint>(from, end).v;
		mediaNoForwards.push_back(flags & (1 << 14));
		const auto request = Decode<MTPmessages_SendMedia>(body);
		Reply<MTPmessages_SendMedia>(instance, id, MTP_updateShortSentMessage(
			MTP_flags(0), MTP_int(nextMessage++), MTP_int(1), MTP_int(1), MTP_int(1),
			MTPMessageMedia(), MTP_vector<MTPMessageEntity>(), MTPint()));
	} break;
	case mtpc_auth_logOut:
		Reply<MTPauth_LogOut>(instance, id, MTP_auth_loggedOut(MTP_flags(0), MTPbytes()));
		break;
	case mtpc_help_getConfig:
		break;
	default:
		Fail(u"Unexpected bot RPC"_q, QString::number(body.front(), 16));
	}
}

} // namespace

void ObserveBotUseRequest(
		not_null<MTP::Instance*> instance,
		mtpRequestId id,
		const MTP::details::SerializedRequest &request) {
	if (!Active() || !Responder || !instance->isBotUse()) { return; }
	const auto body = request->mid(MTP::details::SerializedRequest::kMessageBodyPosition);
	const auto weak = QPointer<MTP::Instance>(instance);
	crl::on_main(instance, [=] { if (Responder) { Responder(weak, id, body); } });
}

void AppendBotUseSelfTest(not_null<Runner*> runner) {
	const auto state = std::make_shared<Fixture>();
	runner->add({ .name = u"botuse setup"_q, .run = [=] {
		MTP::details::pause();
		state->manager = &Core::App().domain().botUse();
		state->manager->reset();
		const auto error = state->manager->setApiCredentials({ 12345, u"0123456789abcdef0123456789abcdef"_q });
		Check(!error, u"Configure shared application credentials"_q, error.type);
		state->a = state->manager->addBot(u"fixture-a"_q);
		state->b = state->manager->addBot(u"fixture-b"_q);
		Check(state->a && state->b && state->a != state->b, u"Independent bot records"_q);
		Responder = [=](auto instance, auto id, auto body) { state->respond(instance, id, std::move(body)); };
		const auto account = &Core::App().domain().active();
		Expects(!account->maybeSession());
		account->createSession(User(999000, false));
	} });
	runner->onFinish([=] {
		Iv::Editor::CloseAllWindows();
		Responder = nullptr;
		state->manager->reset();
	});
	const auto add = [&](QString name, Fn<void()> action, Fn<void()> check) {
		runner->add({ .name = name, .run = std::move(action),
			.until = [=] { return state->result.has_value(); }, .then = std::move(check) });
	};
	add(u"authenticate bot A"_q, [=] {
		state->operation = state->manager->authenticate(state->a, state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed, u"Bot A authenticated"_q); });
	add(u"authenticate bot B"_q, [=] {
		state->operation = state->manager->authenticate(state->b, state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed && state->users.size() == 2,
		u"Bot B has an independent instance"_q); });
	add(u"supergroup bot reaction add"_q, [=] {
		const auto peer = state->text(101).action.history->peer->id;
		state->operation = state->manager->toggleReaction(
			state->a, FullMsgId(peer, MsgId(901)),
			Data::ReactionId{ u"👍"_q }, false, true,
			state->completion());
	}, [=] {
		Check(state->result->state == BotUse::OperationState::Completed
			&& state->reactionsSent == 1
			&& state->reactionUser == 11
			&& state->reactionPeer == 101
			&& state->reactionMessage == 901
			&& !state->reactionRemoved
			&& state->reactionAddedToRecent,
			u"Selected bot sends an ordinary reaction"_q);
	});
	add(u"supergroup bot reaction remove"_q, [=] {
		const auto peer = state->text(101).action.history->peer->id;
		state->operation = state->manager->toggleReaction(
			state->b, FullMsgId(peer, MsgId(901)),
			Data::ReactionId{ u"👍"_q }, true, false,
			state->completion());
	}, [=] {
		Check(state->result->state == BotUse::OperationState::Completed
			&& state->reactionsSent == 2
			&& state->reactionUser == 22
			&& state->reactionRemoved,
			u"Selected bot removes its reaction"_q);
	});
	add(u"supergroup bot custom reaction rejected"_q, [=] {
		const auto peer = state->text(101).action.history->peer->id;
		state->operation = state->manager->toggleReaction(
			state->a, FullMsgId(peer, MsgId(901)),
			Data::ReactionId{ DocumentId(12345) }, false, false,
			state->completion());
	}, [=] {
		Check(state->result->state == BotUse::OperationState::Failed
			&& state->result->error.type == u"UNSUPPORTED_REACTION"_q
			&& state->reactionsSent == 2,
			u"Custom emoji cannot reach bot reaction RPC"_q);
	});
	runner->add({ .name = u"bot reaction on human message"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto history = state->text(101).action.history;
		session->data().processUser(User(77, false));
		const auto item = session->data().addNewMessage(
			Message(903, 101, 77), MessageFlags(), NewMessageType::Existing);
		Expects(item != nullptr);
		session->botUseChats().choose(history->peer->id, state->a);
		const auto emoji = Data::ReactionId{ u"👍"_q };
		item->toggleReaction(emoji, HistoryReactionSource::Selector);
		const auto &recent = item->recentReactions();
		const auto found = recent.find(emoji);
		Check(found != end(recent) && !found->second.empty()
			&& found->second.front().peer->id == peerFromUser(UserId(11)),
			u"Local reaction immediately shows bot avatar"_q);
		item->toggleReaction(Data::ReactionId{ DocumentId(12345) },
			HistoryReactionSource::Selector);
		Check(state->reactionsSent == 2
			&& item->chosenReactions() == std::vector<Data::ReactionId>{ emoji },
			u"Custom reaction is ignored in bot mode"_q);
	}, .until = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto peer = peerFromChannel(ChannelId(101));
		const auto item = session->data().message(peer, MsgId(903));
		return item && state->reactionsSent == 3
			&& !session->data().reactions().sending(item);
	}, .then = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto peer = peerFromChannel(ChannelId(101));
		const auto item = session->data().message(peer, MsgId(903));
		const auto emoji = Data::ReactionId{ u"👍"_q };
		const auto &recent = item->recentReactions();
		const auto found = recent.find(emoji);
		Check(state->reactionUser == 11
			&& state->reactionMessage == 903
			&& !state->reactionRemoved,
			u"Human message reaction reaches bot send without a list read"_q);
		Check(ranges::contains(item->reactions(), emoji,
				&Data::MessageReaction::id)
			&& found != end(recent) && !found->second.empty()
			&& found->second.front().peer->id == peerFromUser(UserId(11)),
			u"Bot reaction remains visible after send completes"_q);
		item->updateReactions(nullptr);
		Check(item->reactions().empty()
			&& ranges::contains(item->reactionsWithLocal(), emoji,
				&Data::MessageReaction::id)
			&& item->chosenReactions() == std::vector<Data::ReactionId>{ emoji },
			u"Stale account update cannot hide a sent bot reaction"_q);
		session->botUseChats().setReactionChoices(
			state->b, item->fullId(), { emoji });
		session->botUseChats().choose(peer, state->b);
		const auto forBotB = item->reactionsWithLocal();
		Check(forBotB.size() == 1
			&& forBotB.front().id == emoji
			&& forBotB.front().count == 2
			&& forBotB.front().my,
			u"Switching bots retains both known reactions"_q);
		session->botUseChats().clear(peer);
		const auto forUser = item->reactionsWithLocal();
		Check(forUser.size() == 1
			&& forUser.front().id == emoji
			&& forUser.front().count == 2
			&& !forUser.front().my,
			u"Switching to user preserves bot reactions without choosing them"_q);
		session->botUseChats().forgetReactionChoices(state->b, item->fullId());
		session->botUseChats().choose(peer, state->a);
	} });
	runner->add({ .name = u"bot reaction toggles off"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto peer = state->text(101).action.history->peer->id;
		const auto item = session->data().message(peer, MsgId(903));
		Expects(item != nullptr);
		item->toggleReaction(Data::ReactionId{ u"👍"_q },
			HistoryReactionSource::Existing);
		Check(item->chosenReactions().empty(),
			u"Second click clears bot reaction locally"_q);
	}, .until = [=] { return state->reactionsSent == 4; }, .then = [=] {
		Check(state->reactionUser == 11
			&& state->reactionMessage == 903
			&& state->reactionRemoved,
			u"Second click sends an empty bot reaction vector"_q);
	} });
	runner->add({ .name = u"supergroup bot message actions"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto history = state->text(101).action.history;
		session->data().processUser(User(11));
		session->data().processUser(User(22));
		const auto own = session->data().addNewMessage(
			Message(901, 101, 11), MessageFlags(), NewMessageType::Existing);
		const auto other = session->data().addNewMessage(
			Message(902, 101, 22), MessageFlags(), NewMessageType::Existing);
		Expects(own && other);
		session->botUseChats().clear(history->peer->id);
		Check(!BotUse::EditBot(own) && !BotUse::DeleteBot(own),
			u"Inactive BotUse hides bot message actions"_q);
		session->botUseChats().choose(history->peer->id, state->a);
		Check(BotUse::EditBot(own) == state->a
			&& BotUse::DeleteBot(own) == state->a,
			u"Selected bot owns supergroup actions"_q);
		Check(!BotUse::EditBot(other) && !BotUse::DeleteBot(other),
			u"Another bot's message has no bot actions"_q);
		session->botUseChats().choose(history->peer->id, state->b);
		Check(!BotUse::EditBot(own) && BotUse::EditBot(other) == state->b,
			u"Switching bot changes eligible messages"_q);
		session->botUseChats().choose(history->peer->id, state->a);
	} });
	add(u"supergroup bot edit"_q, [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto item = session->data().message(
			peerFromChannel(ChannelId(101)), MsgId(901));
		Expects(item != nullptr);
		state->messages.insert_or_assign(901, Message(901, 101, 11));
		state->operation = BotUse::SubmitEdit(
			item, state->a,
			BotUse::Edit{
				.message = item->fullId(),
				.text = TextWithEntities{ u"edited by bot"_q },
			},
			state->completion());
	}, [=] {
		Check(state->result->state == BotUse::OperationState::Completed
			&& state->editUser == 11,
			u"Supergroup edit uses selected bot RPC"_q);
	});
	runner->add({ .name = u"supergroup bot media replacement"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		state->preparedEdited = false;
		state->preparedDone = false;
		auto descriptor = FilePrepareDescriptor{
			.id = uint64(701236),
			.type = SendMediaType::Photo,
			.to = FileLoadTo(peerFromChannel(ChannelId(101)),
				Api::SendOptions(), {}, MsgId(901)),
		};
		auto file = std::make_shared<FilePrepareResult>(std::move(descriptor));
		auto image = QImage(16, 16, QImage::Format_ARGB32);
		image.fill(Qt::red);
		auto bytes = QByteArray();
		auto buffer = QBuffer(&bytes);
		Check(buffer.open(QIODevice::WriteOnly) && image.save(&buffer, "PNG"),
			u"Replacement fixture has a local image"_q);
		file->content = bytes;
		file->photo = MTP_photoEmpty(MTP_long(file->id));
		file->filename = u"replacement.jpg"_q;
		file->filemime = u"image/png"_q;
		file->to.botUse = state->a;
		file->to.botUseEditDone = std::make_shared<Fn<void(bool, QString)>>(
			[=](bool success, QString) {
				state->preparedEdited = success;
				state->preparedDone = true;
			});
		Check(BotUse::EditPrepared(state->a, session, file),
			u"Prepared replacement enters bot edit route"_q);
		const auto item = session->data().message(
			peerFromChannel(ChannelId(101)), MsgId(901));
		const auto photo = item && item->media()
			? item->media()->photo() : nullptr;
		Check(item && item->isEditingMedia()
			&& photo && photo->id == PhotoId(file->id)
			&& photo->uploadingData
			&& photo->createMediaView()->image(Data::PhotoSize::Large) != nullptr,
			u"Replacement displays bot local upload preview"_q);
	}, .until = [=] { return state->preparedDone; }, .then = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto item = session->data().message(
			peerFromChannel(ChannelId(101)), MsgId(901));
		const auto photo = item && item->media()
			? item->media()->photo() : nullptr;
		Check(state->preparedEdited && state->editUser == 11
			&& item && !item->isEditingMedia()
			&& photo && photo->id == PhotoId(9200)
			&& photo->createMediaView()->image(Data::PhotoSize::Large) != nullptr
			&& session->data().photo(PhotoId(701236))->progress() > 0,
			u"Bot replacement retains preview and reports upload progress"_q);
	} });
	add(u"supergroup bot rich edit"_q, [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto rich = MTP_richMessage(
			MTP_flags(0),
			MTP_vector<MTPPageBlock>(1, MTP_pageBlockHeader(
				MTP_textPlain(MTP_string("Before")))),
			MTP_vector<MTPPhoto>(), MTP_vector<MTPDocument>());
		const auto source = Message(904, 101, 11, rich);
		state->messages.insert_or_assign(904, source);
		const auto item = session->data().addNewMessage(
			source, MessageFlags(), NewMessageType::Existing);
		Expects(item != nullptr);
		Check(BotUse::RichEditBot(item) == state->a,
			u"Selected bot can edit supergroup rich message"_q);
		auto page = std::make_shared<Iv::RichPage>();
		auto block = Iv::RichPage::Block();
		block.kind = Iv::RichPage::BlockKind::Paragraph;
		block.text.text = TextWithEntities{ u"After"_q };
		page->blocks.push_back(block);
		state->operation = state->manager->editRichMessage(
			state->a, item->fullId(), page, {}, state->completion());
	}, [=] {
		Check(state->result->state == BotUse::OperationState::Completed
			&& state->editRich && state->editUser == 11,
			u"Supergroup rich edit uses selected bot RPC"_q);
	});
	add(u"supergroup bot batch delete"_q, [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto first = session->data().message(
			peerFromChannel(ChannelId(101)), MsgId(901));
		const auto second = session->data().message(
			peerFromChannel(ChannelId(101)), MsgId(904));
		Expects(first && second);
		Check(BotUse::CanDeleteAs(first, state->a)
			&& BotUse::CanDeleteAs(second, state->a),
			u"Same bot owns every batch item"_q);
		state->operation = state->manager->deleteMessages(
			state->a, { first->fullId(), second->fullId() },
			state->completion());
	}, [=] {
		Check(state->result->state == BotUse::OperationState::Completed
			&& state->result->messages.size() == 2,
			u"Supergroup batch deletion uses bot RPC"_q);
	});
	add(u"set bot typing"_q, [=] {
		state->operation = state->manager->setTyping(
			state->a,
			peerFromChannel(ChannelId(101)),
			MsgId(42),
			MTP_sendMessageRecordAudioAction(),
			state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed
		&& state->typings == 1
		&& state->typingUser == 11
		&& state->typingPeer == 101
		&& state->typingTop == 42
		&& state->typingAction == mtpc_sendMessageRecordAudioAction,
		u"Bot manager sends native typing actions"_q); });
	add(u"reject broadcast typing"_q, [=] {
		state->operation = state->manager->setTyping(
			state->a,
			peerFromChannel(ChannelId(100)),
			MsgId(),
			MTP_sendMessageTypingAction(),
			state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Failed
		&& state->result->error.type == u"UNSUPPORTED_PEER"_q
		&& state->typings == 1,
		u"Bot typing is limited to supergroups"_q); });
	runner->add({ .name = u"botuse typing follows selected identity"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto history = state->text(101).action.history;
		session->botUseChats().choose(history->peer->id, state->a);
		state->typingBefore = state->typings;
		session->sendProgressManager().update(
			history,
			MsgId(43),
			Api::SendProgressType::Typing);
	}, .until = [=] { return state->typings > state->typingBefore; }, .then = [=] {
		Check(state->typingUser == 11
			&& state->typingTop == 43
			&& state->typingAction == mtpc_sendMessageTypingAction,
			u"Selected BotUse identity owns the typing request"_q);
	} });
	runner->add({ .name = u"botuse typing switches identity immediately"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto history = state->text(101).action.history;
		session->botUseChats().choose(history->peer->id, state->b);
		state->typingBefore = state->typings;
		session->sendProgressManager().update(
			history,
			MsgId(43),
			Api::SendProgressType::Typing);
	}, .until = [=] { return state->typings > state->typingBefore; }, .then = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto history = state->text(101).action.history;
		Check(state->typingUser == 22,
			u"Changing BotUse identity bypasses the old typing throttle"_q);
		session->sendProgressManager().update(
			history,
			MsgId(43),
			Api::SendProgressType::Typing,
			-1);
	} });
	add(u"reject unverified bot"_q, [=] {
		state->operation = state->manager->addAuthenticatedBot(
			u"fixture-invalid"_q, state->completion());
		Check(state->manager->bots().size() == 2,
			u"Pending bot stays out of the visible list"_q);
	}, [=] { Check(state->result->state == BotUse::OperationState::Failed
		&& state->result->error.type == u"ACCESS_TOKEN_INVALID"_q
		&& state->manager->bots().size() == 2,
		u"Failed bot authentication leaves no stored record"_q); });
	add(u"commit authenticated bot"_q, [=] {
		state->operation = state->manager->addAuthenticatedBot(
			u"fixture-c"_q, state->completion());
		Check(state->manager->bots().size() == 2,
			u"Successful bot stays pending until authentication"_q);
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed
		&& state->manager->bots().size() == 3,
		u"Authenticated bot becomes visible after encrypted save"_q); });
	add(u"reject duplicate token"_q, [=] {
		state->operation = state->manager->addAuthenticatedBot(
			u"fixture-c"_q, state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Failed
		&& state->result->error.type == u"BOT_ALREADY_ADDED"_q
		&& state->manager->bots().size() == 3,
		u"Duplicate token does not add a bot"_q); });
	add(u"reject duplicate identity"_q, [=] {
		state->operation = state->manager->addAuthenticatedBot(
			u"fixture-other"_q, state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Failed
		&& state->result->error.type == u"BOT_ALREADY_ADDED"_q
		&& state->manager->bots().size() == 3,
		u"Duplicate bot identity does not add a record"_q); });
	add(u"send with retry"_q, [=] {
		state->retryNext = true;
		state->operation = state->manager->sendText(state->a, state->text(), state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed
		&& state->result->messages.size() == 1, u"Text result resolves without update subscription"_q); });
	add(u"send protected text"_q, [=] {
		auto message = state->text();
		message.action.options.noForwards = true;
		state->operation = state->manager->sendText(
			state->a,
			message,
			state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed
		&& state->textNoForwards.back(),
		u"Protected text uses the noforwards request flag"_q); });
	add(u"foreign bot deletion"_q, [=] {
		const auto target = state->result->messages;
		state->operation = state->manager->deleteMessages(state->b, target, state->completion());
	}, [=] { Check(state->result->error.type == u"OWNERSHIP_UNKNOWN"_q && state->deletes == 0,
		u"Another bot cannot delete the message"_q); });
	add(u"channel edit"_q, [=] {
		state->editBefore = state->edits;
		auto edit = BotUse::Edit();
		edit.message = FullMsgId(peerFromChannel(ChannelId(100)), MsgId(900));
		edit.text = TextWithEntities{ u"changed"_q };
		state->operation = state->manager->editMessage(state->a, edit, state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed
		&& state->edits == state->editBefore + 1,
		u"Channel edit uses bot management permissions"_q); });
	add(u"supergroup edit ownership"_q, [=] {
		state->editBefore = state->edits;
		auto edit = BotUse::Edit();
		edit.message = FullMsgId(peerFromChannel(ChannelId(101)), MsgId(900));
		edit.text = TextWithEntities{ u"changed"_q };
		state->operation = state->manager->editMessage(state->a, edit, state->completion());
	}, [=] { Check(state->result->error.type == u"OWNERSHIP_UNKNOWN"_q
		&& state->edits == state->editBefore,
		u"Supergroup edit does not reach RPC for another author"_q); });
	add(u"rich message"_q, [=] {
		auto page = std::make_shared<Iv::RichPage>();
		auto block = Iv::RichPage::Block();
		block.kind = Iv::RichPage::BlockKind::Paragraph;
		block.text.text = { u"Rich fixture"_q, { EntityInText(EntityType::Bold, 0, 4) } };
		page->blocks.push_back(block);
		auto action = state->text().action;
		action.options.noForwards = true;
		state->operation = state->manager->sendRichMessage(
			state->a,
			page,
			action,
			state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed
		&& !state->result->data.empty()
		&& bool(state->result->data.front().c_message().vrich_message())
		&& state->textNoForwards.back(),
		u"RichPage roundtrip preserves the native rich result"_q); });
	add(u"own deletion"_q, [=] {
		const auto target = state->result->messages;
		state->operation = state->manager->deleteMessages(state->a, target, state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed && state->deletes == 2,
		u"Own message receipt authorizes deletion"_q); });
	add(u"token replacement mismatch"_q, [=] {
		state->operation = state->manager->replaceBotToken(state->a, u"fixture-other"_q, state->completion());
	}, [=] { Check(state->result->error.type == u"BOT_IDENTITY_MISMATCH"_q
		&& state->manager->bots().front().userId == UserId(11), u"Failed token replacement preserves identity"_q); });
	add(u"upload photo"_q, [=] {
		state->uploadProgress.clear();
		auto descriptor = FilePrepareDescriptor{ .id = uint64(5000), .type = SendMediaType::Photo };
		auto file = std::make_shared<FilePrepareResult>(std::move(descriptor));
		file->content = QByteArray(600000, 'x');
		file->filename = u"fixture.jpg"_q;
		auto message = state->text();
		message.action.options.noForwards = true;
		state->operation = state->manager->sendMedia(
			state->a,
			message,
			file,
			state->completion(),
			[=](const BotUse::UploadProgress &progress) {
				state->uploadProgress.push_back(progress);
			});
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed && state->parts == 2,
		u"Media uses bot chunk upload and native message result"_q);
		Check(state->uploadProgress.size() == 2
			&& state->uploadProgress.front().id == 5000
			&& state->uploadProgress.front().photo
			&& state->uploadProgress.front().offset == 512 * 1024
			&& state->uploadProgress.back().offset == 600000
			&& state->uploadProgress.back().size == 600000,
			u"Bot media upload reports exact per-file progress"_q);
		Check(state->mediaNoForwards.back(),
			u"Protected media uses the noforwards request flag"_q); });
	runner->add({ .name = u"botuse local media preview"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		auto photo = std::make_shared<FilePrepareResult>(FilePrepareDescriptor{
			.id = uint64(701234), .type = SendMediaType::Photo });
		photo->photo = MTP_photo(
			MTP_flags(0), MTP_long(photo->id), MTP_long(0), MTP_bytes(),
			MTP_int(1),
			MTP_vector<MTPPhotoSize>(1, MTP_photoSize(
				MTP_string("y"), MTP_int(2), MTP_int(2), MTP_int(0))),
			MTP_vector<MTPVideoSize>(), MTP_int(1));
		auto image = QImage(2, 2, QImage::Format_RGB32);
		image.fill(Qt::red);
		photo->photoThumbs.emplace('y', PreparedPhotoThumb{ .image = image });
		BotUse::PrepareLocalMediaPreview(session, photo);
		Check(session->data().photo(PhotoId(photo->id))->uploading(),
			u"Bot photo preview starts in uploading state"_q);
		BotUse::ApplyLocalMediaUploadProgress(session, {
			.id = photo->id,
			.photo = true,
			.offset = 3,
			.size = 4,
		});
		const auto photoMedia = session->data().photo(PhotoId(photo->id))
			->createMediaView();
		Check(photoMedia->image(Data::PhotoSize::Large) != nullptr,
			u"Bot photo preview is available before upload"_q);
		Check(session->data().photo(PhotoId(photo->id))->progress() == 0.75,
			u"Bot photo preview exposes upload progress"_q);
		auto document = std::make_shared<FilePrepareResult>(FilePrepareDescriptor{
			.id = uint64(701235), .type = SendMediaType::File });
		document->document = MTP_document(
			MTP_flags(0), MTP_long(document->id), MTP_long(0), MTP_bytes(),
			MTP_int(1), MTP_string("application/octet-stream"), MTP_long(7),
			MTP_vector<MTPPhotoSize>(), MTP_vector<MTPVideoSize>(), MTP_int(1),
			MTP_vector<MTPDocumentAttribute>());
		document->content = "preview";
		BotUse::PrepareLocalMediaPreview(session, document);
		Check(session->data().document(DocumentId(document->id))->uploading(),
			u"Bot document preview starts in uploading state"_q);
		BotUse::ApplyLocalMediaUploadProgress(session, {
			.id = document->id,
			.offset = 5,
			.size = 10,
		});
		const auto documentMedia = session->data().document(DocumentId(document->id))
			->createMediaView();
		Check(documentMedia->bytes() == document->content,
			u"Bot document preview uses local bytes before upload"_q);
		Check(session->data().document(DocumentId(document->id))->progress() == 0.5,
			u"Bot document preview exposes upload progress"_q);
	} });
	add(u"upload rich editor photo before send"_q, [=] {
		auto descriptor = FilePrepareDescriptor{
			.id = uint64(5001), .type = SendMediaType::Photo };
		auto file = std::make_shared<FilePrepareResult>(std::move(descriptor));
		file->content = QByteArray(1200, 'x');
		file->filename = u"rich-fixture.jpg"_q;
		state->operation = state->manager->uploadMedia(state->a,
			peerFromChannel(ChannelId(100)), file, state->completion());
	}, [=] { Check(state->result->state == BotUse::OperationState::Completed
		&& state->result->media
		&& state->result->media->type() == mtpc_messageMediaPhoto
		&& state->uploads >= 2,
	u"Rich editor media uses Bot upload before send"_q); });
	for (const auto mode : { 0, 1, 2, 3 }) {
		runner->add({ .name = u"open channel rich editor %1"_q.arg(mode), .run = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			const auto history = state->text().action.history;
			auto blocks = QVector<MTPPageBlock>{ MTP_pageBlockHeader(
				MTP_textPlain(MTP_string("Original heading"))) };
			if (mode == 0) {
				blocks.push_back(MTP_pageBlockPhoto(
					MTP_flags(0), MTP_long(9200),
					MTP_pageCaption(MTP_textEmpty(), MTP_textEmpty()),
					MTPstring(), MTPlong()));
			}
			const auto rich = MTP_richMessage(
				MTP_flags(0),
				MTP_vector<MTPPageBlock>(blocks),
				mode == 0
					? MTP_vector<MTPPhoto>(1, RichPhoto("user-fixture-reference"))
					: MTP_vector<MTPPhoto>(),
				MTP_vector<MTPDocument>());
			const auto item = session->data().addNewMessage(
				Message(9500 + mode, 100, 77, rich),
				MessageFlags(), NewMessageType::Existing);
			Expects(item != nullptr);
			state->editTarget = item->fullId();
			state->editOriginal = item->richPage();
			state->editBefore = state->edits;
			if (mode == 0) {
				state->messages.insert_or_assign(9500, Message(9500, 100, 77,
					MTP_richMessage(
						MTP_flags(0), MTP_vector<MTPPageBlock>(blocks),
						MTP_vector<MTPPhoto>(1, RichPhoto("bot-fixture-reference")),
						MTP_vector<MTPDocument>())));
			}
			session->botUseChats().clear(history->peer->id);
			Check(!BotUse::RichEditBot(item),
				u"Personal identity does not enable Bot rich editing"_q);
			session->botUseChats().choose(history->peer->id, state->a);
			Check(BotUse::RichEditBot(item) == state->a && !session->premium(),
				u"Selected Bot permits channel rich editing without Premium"_q);
			const auto controller = session->tryResolveWindow(history->peer);
			Expects(controller != nullptr);
			Iv::Editor::ShowEditBox(controller, item);
		}, .until = [=] { return FindRichEditor() != nullptr; }, .then = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			const auto editor = FindRichEditor();
			Expects(editor != nullptr);
			editor->applyExternalRichPageMutation([=](Iv::RichPage &page) {
				page.blocks.front().text.text.text = u"Bot editor saved"_q;
				if (mode == 1) {
					page.blocks.front().kind = Iv::RichPage::BlockKind::Paragraph;
				}
				return true;
			});
			if (mode == 0) {
				session->botUseChats().choose(state->editTarget.peer, state->b);
				state->omitEditUpdate = true;
			} else if (mode == 1) {
				session->botUseChats().clear(state->editTarget.peer);
			} else if (mode == 2) {
				state->rejectNext = true;
			}
			SaveRichEditor(editor);
		} });
		runner->add({ .name = u"save channel rich editor %1"_q.arg(mode), .until = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			const auto item = session->data().message(state->editTarget);
			if (state->edits <= state->editBefore
				|| state->manager->busy()
				|| Iv::Editor::HasEditWindowFor(session, state->editTarget)) {
				return false;
			}
			return mode == 2
				|| (mode == 1 && !item->richPage()
					&& item->originalText().text == u"Bot editor saved"_q)
				|| ((mode == 0 || mode == 3) && item->richPage()
					&& item->richPage()->blocks.front().text.text.text
						== u"Bot editor saved"_q);
		}, .then = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			const auto item = session->data().message(state->editTarget);
			Check(state->editUser == 11 && state->edits == state->editBefore + 1
				&& state->editRich == (mode != 1),
				u"Rich editor saves through its original Bot identity"_q);
			if (mode == 0) {
				Check(state->richReadUser == 11 && state->richReadId == 9500
					&& state->richEditReference == "bot-fixture-reference"
					&& item->richPage()->blocks.size() == 2
					&& item->richPage()->blocks.back().kind
						== Iv::RichPage::BlockKind::Photo
					&& item->richPage()->blocks.back().photoId == 9200,
					u"Retained rich media uses Bot references instead of user credentials"_q);
			}
			if (mode == 2) {
				Check(item->richPage() == state->editOriginal,
					u"Rejected Bot edit preserves the original channel content"_q);
			}
		} });
	}
	runner->add({ .name = u"personal rich editor keeps user path"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto item = session->data().message(state->editTarget);
		session->botUseChats().clear(item->history()->peer->id);
		state->editBefore = state->edits;
		Iv::Editor::ShowEditBox(session->tryResolveWindow(item->history()->peer), item);
	}, .until = [=] { return FindRichEditor() != nullptr; }, .then = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto editor = FindRichEditor();
		Expects(editor != nullptr);
		session->botUseChats().choose(state->editTarget.peer, state->a);
		SaveRichEditor(editor);
		Check(state->edits == state->editBefore
			&& Iv::Editor::HasEditWindowFor(session, state->editTarget),
			u"Personal editor retains the Premium check after BotUse is enabled"_q);
		Iv::Editor::CloseAllWindows();
	} });
	for (const auto channel : { uint64(100), uint64(101) }) {
		runner->add({ .name = channel == 100
			? u"botuse channel local message"_q
			: u"botuse supergroup local message"_q, .run = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			auto message = state->text(channel);
			message.action.options.noForwards = (channel == 100);
			const auto history = message.action.history;
			session->botUseChats().choose(history->peer->id, state->a);
			state->local = FullMsgId(history->peer->id,
				session->data().nextLocalMessageId());
			state->expectedReal = FullMsgId(history->peer->id,
				MsgId(state->nextMessage));
			const auto sent = BotUse::SendText(state->a, message, state->local.msg);
			const auto item = session->data().message(state->local);
			Check(sent && item && item->isSending()
				&& item->from()->id == peerFromUser(UserId(11))
				&& !item->out()
				&& (item->forbidsForward() == (channel == 100)),
				u"Bot local message has its own sender and sharing state"_q);
		}, .until = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			return session && session->data().message(state->expectedReal);
		}, .then = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			const auto item = session->data().message(state->expectedReal);
			Check(item && !item->isSending() && !item->isLocal()
				&& item->from()->id == peerFromUser(UserId(11))
				&& !session->data().message(state->local),
				u"Bot result confirms the original local item"_q);
		} });
	}
	runner->add({ .name = u"botuse user update wins race"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto message = state->text(101);
		const auto history = message.action.history;
		session->botUseChats().choose(history->peer->id, state->a);
		state->local = FullMsgId(history->peer->id,
			session->data().nextLocalMessageId());
		state->expectedReal = FullMsgId(history->peer->id,
			MsgId(state->nextMessage));
		state->delayedBotResult = true;
		Check(BotUse::SendText(state->a, message, state->local.msg),
			u"Race fixture starts Bot send"_q);
	}, .until = [=] { return state->delayedUpdates.has_value(); }, .then = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto server = state->messages.at(state->expectedReal.msg.bare);
		Check(session->botUseChats().deferIncoming(server)
			&& !session->data().message(state->expectedReal)
			&& session->data().message(state->local),
			u"User update waits for the Bot local item"_q);
		Reply<MTPmessages_SendMessage>(state->delayedInstance,
			state->delayedRequest, *state->delayedUpdates);
		state->delayedUpdates.reset();
	} });
	runner->add({ .name = u"botuse race reconciled"_q,
		.until = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			return session && session->data().message(state->expectedReal);
		}, .then = [=] {
			const auto session = Core::App().domain().active().maybeSession();
			Check(session->data().message(state->expectedReal)
				&& !session->data().message(state->local),
				u"Bot local item is promoted after user update"_q);
		} });
	runner->add({ .name = u"botuse local send failure"_q, .run = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto message = state->text();
		state->local = FullMsgId(message.action.history->peer->id,
			session->data().nextLocalMessageId());
		state->rejectNext = true;
		const auto sent = BotUse::SendText(state->a, message, state->local.msg);
		Check(sent, u"Failed send starts with a Bot local item"_q);
	}, .until = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto item = session ? session->data().message(state->local) : nullptr;
		return item && item->hasFailed();
	}, .then = [=] {
		const auto session = Core::App().domain().active().maybeSession();
		const auto item = session->data().message(state->local);
		Check(item && item->from()->id == peerFromUser(UserId(11))
			&& item->hasFailed(), u"Failure retains the Bot local item"_q);
	} });
	runner->add({ .name = u"botuse rejects unsupported options"_q, .run = [=] {
		auto message = state->text();
		message.action.options.scheduled = 123;
		const auto previous = state->nextMessage;
		Check(!BotUse::SendText(state->a, message)
			&& state->nextMessage == previous,
			u"Unsupported Bot options cannot send as the user"_q);
	} });
	add(u"cancel and credential boundary"_q, [=] {
		state->hold = true;
		state->operation = state->manager->sendText(state->a, state->text(), state->completion());
		Check(state->manager->setApiCredentials({ 54321, u"0123456789abcdef0123456789abcdef"_q }).type
			== u"BOT_MANAGER_BUSY"_q, u"Shared credentials cannot change during queued operations"_q);
		state->manager->cancel(state->operation);
	}, [=] { Check(state->result->state == BotUse::OperationState::Cancelled, u"Queued cancellation completes"_q); });
	runner->add({ .name = u"botuse validation and storage"_q, .run = [=] {
		const auto before = state->manager->bots();
		state->manager->finish();
		state->manager->start();
		Check(state->manager->bots().size() == before.size() && state->manager->apiId() == 12345
			&& !state->manager->storageError(), u"Global encrypted bot store restores identities and API ID"_q);
		auto partial = Iv::RichPage();
		partial.part = true;
		auto operation = BotUse::Operation();
		Check(BotUse::SnapshotRich(partial, {}, operation).type == u"RICH_MESSAGE_INCOMPLETE"_q,
			u"Partial rich content cannot replace complete content"_q);
		Check(bool(BotUse::ValidateTarget(peerFromChat(ChatId(1)))), u"Basic groups are rejected"_q);
		const auto session = Core::App().domain().active().maybeSession();
		Expects(session != nullptr);
		auto &choices = session->botUseChats();
		const auto first = peerFromChannel(ChannelId(101));
		const auto second = peerFromChannel(ChannelId(102));
		choices.choose(first, state->a);
		choices.choose(second, state->b);
		Check(choices.choice(first) == BotUse::ChatChoice{ true, state->a }
			&& choices.choice(second) == BotUse::ChatChoice{ true, state->b },
			u"Bot identities stay separate by chat"_q);
		const auto firstHistory = session->data().history(first);
		auto protectedDraft = std::make_unique<Data::Draft>();
		protectedDraft->noForwards = true;
		firstHistory->setLocalDraft(std::move(protectedDraft));
		choices.clear(first);
		const auto clearedDraft = firstHistory->localDraft(MsgId(), PeerId());
		Check(!choices.choice(first).enabled
			&& choices.choice(first).bot == 0
			&& choices.choice(second).bot == state->b
			&& (!clearedDraft || !clearedDraft->noForwards),
			u"Using the personal account clears its protected draft"_q);
	} });
}

} // namespace Test

#else

namespace Test {

void ObserveBotUseRequest(
		not_null<MTP::Instance*>,
		mtpRequestId,
		const MTP::details::SerializedRequest &) {
}

void AppendBotUseSelfTest(not_null<Runner*>) {
}

} // namespace Test

#endif
