#pragma once

#include "base/weak_ptr.h"
#include "bot_use/bot_use_adapter.h"

namespace BotUse {

class Client;

class Uploader final : public base::has_weak_ptr {
public:
	explicit Uploader(not_null<Client*> client);
	void upload(
		std::shared_ptr<Operation> operation,
		const MediaSource &source,
		Fn<void(MTPInputMedia)> done);

private:
	struct File;
	void uploadFile(
		std::shared_ptr<Operation> operation,
		Core::FileLocation location,
		QByteArray bytes,
		QString name,
		Fn<void(MTPInputFile)> done);
	void sendParts(std::shared_ptr<File> file);
	void partDone(std::shared_ptr<File> file, int size, const MTPBool &result);
	void mediaReady(
		std::shared_ptr<Operation> operation,
		MediaSource source,
		MTPInputFile file,
		Fn<void(MTPInputMedia)> done);

	const not_null<Client*> _client;

};

} // namespace BotUse
