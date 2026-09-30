#include "bot_use/bot_use_uploader.h"

#include "base/random.h"
#include "bot_use/bot_use_client.h"

#include <QtCore/QCryptographicHash>
#include <QtCore/QFile>

namespace BotUse {
namespace {

constexpr auto kPartSize = 512 * 1024;
constexpr auto kBigFile = int64(10) * 1024 * 1024;

} // namespace

struct Uploader::File {
	std::shared_ptr<Operation> operation;
	Core::FileLocation location;
	QFile file;
	QByteArray bytes;
	QString name;
	Fn<void(MTPInputFile)> done;
	QCryptographicHash hash{ QCryptographicHash::Md5 };
	uint64 id = base::RandomValue<uint64>();
	int64 size = 0;
	int64 uploaded = 0;
	uint64 mediaId = 0;
	int next = 0;
	int parts = 0;
	int pending = 0;
	bool photo = false;
	bool access = false;
	bool completed = false;
	~File();
};

Uploader::File::~File() {
	file.close();
	if (access) {
		location.accessDisable();
	}
}

Uploader::Uploader(not_null<Client*> client) : _client(client) {
}

void Uploader::upload(
		std::shared_ptr<Operation> operation,
		const MediaSource &source,
		Fn<void(MTPInputMedia)> done) {
	uploadFile(
		operation,
		source.location,
		source.bytes,
		source.name,
		source.id,
		source.photo,
		[=](MTPInputFile file) {
			mediaReady(operation, source, std::move(file), done);
		});
}

void Uploader::uploadFile(
		std::shared_ptr<Operation> operation,
		Core::FileLocation location,
		QByteArray bytes,
		QString name,
		uint64 mediaId,
		bool photo,
		Fn<void(MTPInputFile)> done) {
	auto state = std::make_shared<File>();
	state->operation = operation;
	state->location = std::move(location);
	state->bytes = std::move(bytes);
	state->name = name.isEmpty() ? u"file"_q : name;
	state->mediaId = mediaId;
	state->photo = photo;
	state->done = std::move(done);
	if (!state->bytes.isEmpty()) {
		state->size = state->bytes.size();
	} else {
		state->access = state->location.accessEnable();
		state->file.setFileName(state->location.name());
		if (!state->file.open(QIODevice::ReadOnly)) {
			_client->finish(operation, OperationState::Failed, { u"FILE_OPEN_FAILED"_q });
			return;
		}
		state->size = state->file.size();
	}
	if (state->size <= 0 || state->size > int64(kPartSize) * 4000) {
		_client->finish(operation, OperationState::Failed, { u"FILE_SIZE_INVALID"_q });
		return;
	}
	state->parts = int((state->size + kPartSize - 1) / kPartSize);
	operation->result.total += state->size;
	sendParts(state);
}

void Uploader::sendParts(std::shared_ptr<File> file) {
	if (!_client->active(file->operation) || file->completed) {
		return;
	}
	if (file->next == file->parts && !file->pending) {
		file->completed = true;
		const auto input = file->size > kBigFile
			? MTPInputFile(MTP_inputFileBig(
				MTP_long(file->id), MTP_int(file->parts), MTP_string(file->name)))
			: MTPInputFile(MTP_inputFile(
				MTP_long(file->id), MTP_int(file->parts), MTP_string(file->name),
				MTP_string(QString::fromLatin1(file->hash.result().toHex()))));
		file->done(input);
		return;
	}
	while (file->pending < 4 && file->next < file->parts) {
		const auto part = file->next++;
		const auto size = int(std::min(int64(kPartSize), file->size - int64(part) * kPartSize));
		const auto bytes = file->bytes.isEmpty()
			? file->file.read(size)
			: file->bytes.mid(qsizetype(part) * kPartSize, size);
		if (bytes.size() != size) {
			_client->finish(file->operation, OperationState::Failed, { u"FILE_CHANGED"_q });
			return;
		}
		if (file->size <= kBigFile) {
			file->hash.addData(bytes);
		}
		++file->pending;
		const auto done = Fn<void(const MTPBool &)>([=](const MTPBool &result) {
			partDone(file, size, result);
		});
		if (file->size > kBigFile) {
			_client->rpc(file->operation, MTPupload_SaveBigFilePart(
				MTP_long(file->id), MTP_int(part), MTP_int(file->parts), MTP_bytes(bytes)),
				done, MTP::uploadDcId(0));
		} else {
			_client->rpc(file->operation, MTPupload_SaveFilePart(
				MTP_long(file->id), MTP_int(part), MTP_bytes(bytes)),
				done, MTP::uploadDcId(0));
		}
	}
}

void Uploader::partDone(
		std::shared_ptr<File> file,
		int size,
		const MTPBool &result) {
	if (result.type() != mtpc_boolTrue) {
		_client->finish(file->operation, OperationState::Failed, { u"UPLOAD_PART_REJECTED"_q });
		return;
	}
	--file->pending;
	file->uploaded += size;
	file->operation->result.uploaded += size;
	if (file->mediaId && file->operation->progress) {
		file->operation->progress({
			.id = file->mediaId,
			.photo = file->photo,
			.offset = file->uploaded,
			.size = file->size,
		});
	}
	_client->notify(file->operation);
	sendParts(file);
}

void Uploader::mediaReady(
		std::shared_ptr<Operation> operation,
		MediaSource source,
		MTPInputFile file,
		Fn<void(MTPInputMedia)> done) {
	if (source.photo) {
		using Flag = MTPDinputMediaUploadedPhoto::Flag;
		done(MTP_inputMediaUploadedPhoto(
			MTP_flags(source.spoiler ? Flag::f_spoiler : Flag()),
			file, MTPVector<MTPInputDocument>(), MTPint(), MTPInputDocument()));
		return;
	}
	const auto finish = [=](std::optional<MTPInputFile> thumb) {
		using Flag = MTPDinputMediaUploadedDocument::Flag;
		done(MTP_inputMediaUploadedDocument(
			MTP_flags((source.spoiler ? Flag::f_spoiler : Flag())
				| (source.forceFile ? Flag::f_force_file : Flag())
				| (thumb ? Flag::f_thumb : Flag())),
			file,
			thumb.value_or(MTPInputFile()),
			MTP_string(source.mime.isEmpty() ? u"application/octet-stream"_q : source.mime),
			MTP_vector<MTPDocumentAttribute>(source.attributes),
			MTPVector<MTPInputDocument>(), MTPInputPhoto(), MTPint(), MTPint()));
	};
	if (source.thumbnail.isEmpty()) {
		finish(std::nullopt);
	} else {
		uploadFile(operation, {}, source.thumbnail, u"thumb.jpg"_q, 0, false,
			[=](MTPInputFile thumb) { finish(std::move(thumb)); });
	}
}

} // namespace BotUse
