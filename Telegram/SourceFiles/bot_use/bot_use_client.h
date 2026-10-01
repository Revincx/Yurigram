#pragma once

#include "base/call_delayed.h"
#include "base/weak_ptr.h"
#include "bot_use/bot_use_adapter.h"
#include "iv/iv_rich_message_serializer.h"
#include "mtproto/sender.h"

#include <deque>

namespace BotUse {

class Uploader;

class Client final : public base::has_weak_ptr {
public:
	Client(not_null<Manager*> manager, Record record);
	~Client();
	[[nodiscard]] const Record &record() const;
	[[nodiscard]] const BotInfo &info() const;
	void setAutoAuth(bool enabled);
	[[nodiscard]] bool busy() const;
	void enqueue(std::shared_ptr<Operation> operation);
	void cancel(OperationId operation);
	void stop();
	void logout();
	void resetAuthorization();
	[[nodiscard]] std::shared_ptr<const ResourceContext> resources() const;

private:
	friend class Uploader;
	using Op = std::shared_ptr<Operation>;

	template <typename Request>
	void rpc(
		Op operation,
		Request request,
		Fn<void(const typename Request::ResponseType &)> done,
		MTP::ShiftedDcId dc = 0,
		bool allowReauth = true);
	[[nodiscard]] bool active(const Op &operation) const;
	void connect();
	void pump();
	void authenticate(const Op &operation, Fn<void()> done, bool force = false);
	void authorized(const Op &operation, const MTPUser &user, Fn<void()> done);
	void begin(const Op &operation);
	void checkPeer(const Op &operation);
	void checkOwnership(const Op &operation, Fn<void()> done);
	void prepare(const Op &operation);
	void prepareMedia(const Op &operation, size_t index = 0);
	void resolveMedia(const Op &operation, size_t index, Fn<void()> done);
	void send(const Op &operation);
	void setTyping(const Op &operation);
	void toggleReaction(const Op &operation);
	void sendText(const Op &operation);
	void repeatMessage(const Op &operation);
	void sendMedia(const Op &operation);
	void edit(const Op &operation);
	void remove(const Op &operation, size_t offset = 0);
	void received(const Op &operation, const MTPUpdates &updates);
	void ingest(const MTPMessage &message);
	void ingest(const MTPMessageMedia &media);
	void ingest(const MTPPhoto &photo);
	void ingest(const MTPDocument &document);
	void ingest(const MTPmessages_Messages &messages);
	void requestMessage(
		const Op &operation,
		FullMsgId id,
		Fn<void(const MTPmessages_Messages &)> done);
	[[nodiscard]] std::vector<MTPMessage> messages(
		const MTPmessages_Messages &result) const;
	[[nodiscard]] MTPInputPeer peer(PeerId id) const;
	[[nodiscard]] MTPInputChannel channel(PeerId id) const;
	[[nodiscard]] Iv::RichMessageResources richResources() const;
	[[nodiscard]] Error prepareRich(const Op &operation);
	[[nodiscard]] Error validateNativeRich(const Op &operation);
	void refresh(const Op &operation, Fn<void()> retry);
	void failed(
		const Op &operation,
		const MTP::Error &error,
		Fn<void()> retry,
		bool allowReauth);
	void finish(
		const Op &operation,
		OperationState state = OperationState::Completed,
		Error error = {});
	void notify(const Op &operation);
	void saveKeys();

	const not_null<Manager*> _manager;
	Record _record;
	std::optional<Record> _rollback;
	std::unique_ptr<MTP::Instance> _instance;
	std::unique_ptr<MTP::Sender> _sender;
	std::unique_ptr<Uploader> _uploader;
	std::deque<Op> _queue;
	Op _active;
	std::map<PeerId, uint64> _peers;
	std::map<uint64, MTPInputPhoto> _photos;
	std::map<uint64, MTPInputDocument> _documents;
	std::map<uint64, FullMsgId> _photoOrigins;
	std::map<uint64, FullMsgId> _documentOrigins;
	std::set<uint64> _audio;
	Iv::RichMessageLimits _richLimits;
	uint64 _resourceGeneration = 0;
	bool _ready = false;
	rpl::lifetime _connectionLifetime;

};

template <typename Request>
void Client::rpc(
		Op operation,
		Request request,
		Fn<void(const typename Request::ResponseType &)> done,
		MTP::ShiftedDcId dc,
		bool allowReauth) {
	if (!active(operation)) {
		return;
	}
	const auto id = _sender->request(base::duplicate(request)
	).done([=](const typename Request::ResponseType &result, mtpRequestId id) {
		operation->requests.erase(id);
		if (active(operation)) {
			done(result);
		}
	}).fail([=](const MTP::Error &error, mtpRequestId id) {
		operation->requests.erase(id);
		if (active(operation)) {
			failed(operation, error, [=] {
				rpc(operation, request, done, dc, allowReauth);
			}, allowReauth);
		}
	}).handleAllErrors().toDC(dc).send();
	operation->requests.emplace(id);
	base::call_delayed(60000, this, [=] {
		if (active(operation) && operation->requests.contains(id)) {
			finish(operation,
				operation->submitted
					? OperationState::Unconfirmed
					: OperationState::Failed,
				{ u"REQUEST_TIMEOUT"_q });
		}
	});
}

} // namespace BotUse
