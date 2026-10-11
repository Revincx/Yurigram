/*
This file is part of Telegram Desktop,
the official desktop application for the Telegram messaging service.

For license and copyright information please follow this link:
https://github.com/telegramdesktop/tdesktop/blob/master/LEGAL
*/
#include "core/update_checker.h"

#include "base/platform/base_platform_file_utilities.h"
#include "base/platform/base_platform_info.h"
#include "base/timer.h"
#include "base/unixtime.h"
#include "core/application.h"
#include "core/changelogs.h"
#include "core/click_handler_types.h"
#include "core/update_channel.h"
#include "core/update_keys.h"
#include "core/update_unpack.h"
#include "core/update_verify.h"
#include "core/version.h"
#include "info/info_controller.h"
#include "info/info_memento.h"
#include "main/main_account.h"
#include "main/main_domain.h"
#include "main/main_session.h"
#include "platform/platform_specific.h"
#include "settings/sections/settings_advanced.h"
#include "settings/settings_intro.h"
#include "storage/localstorage.h"
#include "ui/layers/box_content.h"
#include "window/window_controller.h"
#include "window/window_session_controller.h"
#include "mainwindow.h"

#include <QtCore/QCryptographicHash>
#include <QtCore/QJsonDocument>
#include <QtCore/QJsonObject>
#include <QtCore/QSaveFile>

#include <array>
#include <utility>

#include <ksandbox.h>

#if !defined Q_OS_WIN && !defined Q_OS_MAC
#include "platform/linux/update_install_linux.h"
#endif // !Q_OS_WIN && !Q_OS_MAC

extern "C" {
#include <openssl/bio.h>
#include <openssl/err.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
} // extern "C"

#ifndef Q_OS_WIN
#include <unistd.h>
#endif // !Q_OS_WIN

namespace Core {
namespace {

constexpr auto kUpdaterTimeout = 10 * crl::time(1000);
constexpr auto kMaxResponseSize = 1024 * 1024;

// Alpha and canary builds are published far more often than the eight hours
// a stable build waits, so they ask every ten to fifteen minutes instead.
constexpr auto kFrequentUpdateDelayConstPart = 600;
constexpr auto kFrequentUpdateDelayRandPart = 300;

// tdata/version marker for installed v2 canary packages, holding the full
// 64-bit (base << 32 | counter) version. 0x7FFFFFFF is the alpha marker.
constexpr auto kVersionFileCanaryMarker = quint32(0x7FFFFFFE);

#ifdef TDESKTOP_DISABLE_AUTOUPDATE
bool UpdaterIsDisabled = true;
#else // TDESKTOP_DISABLE_AUTOUPDATE
bool UpdaterIsDisabled = false;
#endif // TDESKTOP_DISABLE_AUTOUPDATE

std::weak_ptr<Updater> UpdaterInstance;

using Progress = UpdateChecker::Progress;
using State = UpdateChecker::State;

#ifdef Q_OS_WIN
using VersionInt = DWORD;
using VersionChar = WCHAR;
#else // Q_OS_WIN
using VersionInt = int;
using VersionChar = wchar_t;
#endif // Q_OS_WIN

using Loader = MTP::AbstractDedicatedLoader;

struct UpdateInfo {
	quint64 version = 0;
	Updates::Channel channel = Updates::Channel::Stable;
	int postId = 0;
};

struct CheckResult {
	std::shared_ptr<Loader> loader;
	UpdateInfo info;
};

struct BIODeleter {
	void operator()(BIO *value) {
		BIO_free(value);
	}
};

inline auto MakeBIO(const void *buf, int len) {
	return std::unique_ptr<BIO, BIODeleter>{
		BIO_new_mem_buf(buf, len),
	};
}

class Checker : public base::has_weak_ptr {
public:
	virtual void start() = 0;

	rpl::producer<CheckResult> ready() const;
	rpl::producer<> failed() const;

	rpl::lifetime &lifetime();

	virtual ~Checker() = default;

protected:
	void done(CheckResult result);
	void fail();

private:
	rpl::event_stream<CheckResult> _ready;
	rpl::event_stream<> _failed;

	rpl::lifetime _lifetime;

};

struct Implementation {
	std::unique_ptr<Checker> checker;
	CheckResult result;
	bool failed = false;
};

class MtpChecker : public Checker {
public:
	MtpChecker(base::weak_ptr<Main::Session> session);

	void start() override;

private:
	using FileLocation = MTP::DedicatedLoader::Location;

	using Checker::fail;
	Fn<void(const MTP::Error &error)> failHandler();

	void requestMetadata(const MTPInputChannel &channel, int messageId);
	void gotMessage(
		const MTPInputChannel &channel,
		const MTPmessages_Messages &result,
		int messageId);
	void parseMetadata(
		const MTPInputChannel &channel,
		const QByteArray &text);

	MTP::WeakInstance _mtp;

};

std::shared_ptr<Updater> GetUpdaterInstance() {
	if (const auto result = UpdaterInstance.lock()) {
		return result;
	}
	const auto result = std::make_shared<Updater>();
	UpdaterInstance = result;
	return result;
}

[[nodiscard]] int UpdateMetadataMessageId() {
	const auto platform = Platform::AutoUpdateKey();
	constexpr auto messages = std::array{
		std::pair{ "win64", 10 },
		std::pair{ "winarm", 11 },
		std::pair{ "mac", 12 },
		std::pair{ "armac", 13 },
		std::pair{ "linux", 14 },
		std::pair{ "linuxarm", 15 },
	};
	for (const auto &[key, messageId] : messages) {
		if (platform == QLatin1String(key)) {
			return messageId;
		}
	}
	return 0;
}

[[nodiscard]] std::optional<quint32> ReadMetadataInteger(
		const QJsonValue &value) {
	if (!value.isDouble()) {
		return std::nullopt;
	}
	const auto number = value.toDouble();
	if (!(number >= 0.) || !(number <= 4294967295.)) {
		return std::nullopt;
	}
	const auto result = quint32(number);
	if (double(result) != number) {
		return std::nullopt;
	}
	return result;
}

[[nodiscard]] std::optional<UpdateInfo> ReadUpdateInfo(
		const QJsonObject &entry,
		Updates::Channel channel,
		const QString &platform) {
	const auto base = ReadMetadataInteger(entry.value(u"base"_q));
	const auto counter = ReadMetadataInteger(entry.value(u"counter"_q));
	const auto posts = entry.value(u"posts"_q);
	const auto postId = ReadMetadataInteger(posts.toObject().value(platform));
	const auto canary = (channel == Updates::Channel::CanaryPublic)
		|| (channel == Updates::Channel::CanaryPrivate);
	if (!base || !*base || *base > quint32(0x7FFFFFFD)
		|| !counter || (canary != (*counter > 0))
		|| !posts.isObject()
		|| !postId || !*postId || *postId > quint32(0x7FFFFFFF)) {
		return std::nullopt;
	}
	return UpdateInfo{
		Updates::MakeUpdateVersion(*base, *counter),
		channel,
		int(*postId),
	};
}

QString UpdatesFolder() {
	return cWorkingDir() + u"tupdates"_q;
}

void ClearAll() {
#if !defined Q_OS_WIN && !defined Q_OS_MAC
	if (!KSandbox::isInside()) {
		auto error = QString();
		if (!Platform::ClearUpdateData(cWorkingDir(), error)) {
			LOG(("Update Error: %1").arg(error));
		}
		return;
	}
#endif // !Q_OS_WIN && !Q_OS_MAC
	base::Platform::DeleteDirectory(UpdatesFolder());
}

QString FindUpdateFile() {
	QDir updates(UpdatesFolder());
	if (!updates.exists()) {
		return QString();
	}
	const auto list = updates.entryInfoList(QDir::Files);
	for (const auto &info : list) {
		static const auto RegExpV2 = QRegularExpression(
			"^td-update-(win|mac|linux)-(x86|x64|arm)-\\d+"
			"(-beta|-canary-\\d+(-private)?)?$",
			QRegularExpression::CaseInsensitiveOption
		);
		if (RegExpV2.match(info.fileName()).hasMatch()) {
			return info.absoluteFilePath();
		}
	}
	return QString();
}

[[nodiscard]] std::optional<Updates::Manifest> HeldManifest() {
	auto error = QString();
	auto result = Updates::ParseVerifiedManifest(
		Updates::EmbeddedManifest(),
		Updates::EmbeddedManifestSignature(),
		Updates::RootPublicKeyPem(),
		&error);
	if (!result) {
		LOG(("Update Error: Bad embedded manifest: %1").arg(error));
	}
	auto manifest = QByteArray();
	auto signature = QByteArray();
	if (Local::readUpdateManifest(&manifest, &signature)) {
		auto persisted = Updates::ParseVerifiedManifest(
			manifest,
			signature,
			Updates::RootPublicKeyPem());
		if (persisted && (!result || persisted->version > result->version)) {
			result = std::move(persisted);
		}
	}
	return result;
}

void AdoptManifest(const Updates::Manifest &manifest) {
	const auto held = HeldManifest();
	if (!held || manifest.version > held->version) {
		LOG(("Update Info: Adopting manifest version %1."
			).arg(manifest.version));
		Local::writeUpdateManifest(manifest.bytes, manifest.signature);
	}
}

[[nodiscard]] bool PrepareUpdateStorage() {
	const auto root = Updates::RootPublicKeyPem();
	auto error = QString();
	if (!Updates::ParseVerifiedManifest(
			Updates::EmbeddedManifest(),
			Updates::EmbeddedManifestSignature(),
			root,
			&error)) {
		LOG(("Update Error: Invalid embedded trust configuration: %1").arg(error));
		return false;
	}
	const auto fingerprint = QCryptographicHash::hash(
		root,
		QCryptographicHash::Sha256).toHex();
	const auto markerPath = cWorkingDir() + u"tdata/update-trust"_q;
	auto marker = QFile(markerPath);
	if (marker.open(QIODevice::ReadOnly)
		&& marker.read(fingerprint.size() + 1) == fingerprint) {
		return true;
	}
	marker.close();
	const auto pending = QFileInfo(UpdatesFolder());
	if (pending.exists() || pending.isSymLink()) {
		ClearAll();
		const auto remaining = QFileInfo(UpdatesFolder());
		if (remaining.exists() || remaining.isSymLink()) {
			LOG(("Update Error: Could not clear updates from the previous trust root."));
			return false;
		}
	}
	auto saved = QSaveFile(markerPath);
	if (!saved.open(QIODevice::WriteOnly)
		|| saved.write(fingerprint) != fingerprint.size()
		|| !saved.commit()) {
		LOG(("Update Error: Could not save the update trust marker."));
		return false;
	}
	return true;
}

#ifndef TDESKTOP_DISABLE_AUTOUPDATE

enum class ManifestAdoption {
	Queued,
	Immediate,
};

[[nodiscard]] bool MatchesUpdateInfo(
		const Updates::Envelope &envelope,
		const UpdateInfo &info) {
	if (envelope.version != info.version || envelope.channel != info.channel) {
		LOG(("Update Error: Package does not match the metadata candidate."));
		return false;
	}
	return true;
}

[[nodiscard]] bool WriteUpdateVersionFile(
		QDir &tempDir,
		const QString &tempDirPath,
		quint32 version,
		quint64 canaryVersion) {
	// create tdata/version file
	tempDir.mkdir(QDir(tempDirPath + u"/tdata"_q).absolutePath());
	std::wstring versionString = FormatVersionDisplay(version).toStdWString();

	const auto versionNum = canaryVersion
		? VersionInt(kVersionFileCanaryMarker)
		: VersionInt(version);
	const auto versionLen = VersionInt(versionString.size() * sizeof(VersionChar));
	VersionChar versionStr[32];
	memcpy(versionStr, versionString.c_str(), versionLen);

	QFile fVersion(tempDirPath + u"/tdata/version"_q);
	if (!fVersion.open(QIODevice::WriteOnly)) {
		LOG(("Update Error: cant write version file '%1'").arg(tempDirPath + u"/version"_q));
		return false;
	}
	fVersion.write((const char*)&versionNum, sizeof(VersionInt));
	if (canaryVersion) {
		fVersion.write((const char*)&canaryVersion, sizeof(quint64));
	} else {
		fVersion.write((const char*)&versionLen, sizeof(VersionInt));
		fVersion.write((const char*)&versionStr[0], versionLen);
	}
	fVersion.close();
	return true;
}

[[nodiscard]] bool WriteUpdateReadyFile(const QString &readyFilePath) {
	QFile readyFile(readyFilePath);
	if (readyFile.open(QIODevice::WriteOnly)) {
		if (readyFile.write("1", 1)) {
			readyFile.close();
		} else {
			LOG(("Update Error: cant write ready file '%1'").arg(readyFilePath));
			return false;
		}
	} else {
		LOG(("Update Error: cant create ready file '%1'").arg(readyFilePath));
		return false;
	}
	return true;
}

[[nodiscard]] bool UnpackUpdateV2(
		const QString &filepath,
		const QByteArray &content,
		ManifestAdoption adoption,
		std::optional<UpdateInfo> expected = std::nullopt) {
	// The expected target follows the feed key, not the build: an x64
	// build under Rosetta asks for armac and must accept that package.
	const auto target = Updates::TargetFromPlatformKey(
		Platform::AutoUpdateKey().toLatin1());
	if (!target) {
		LOG(("Update Error: No v2 target for platform key '%1'."
			).arg(Platform::AutoUpdateKey()));
		return false;
	}

	// The full verification happens before any decompression, so no
	// unauthenticated bytes ever reach the LZMA or QDataStream parsers.
	auto error = QString();
	const auto verified = Updates::VerifyUpdate(
		content,
		BuildUpdateChannel,
		AppBetaVersion || cInstallBetaVersion(),
		*target,
		RunningUpdateVersion(),
		HeldManifest(),
		Updates::RootPublicKeyPem(),
		base::unixtime::now(),
		&error);
	if (!verified) {
		LOG(("Update Error: v2 update rejected: %1").arg(error));
		return false;
	}
	if (expected && !MatchesUpdateInfo(verified->envelope, *expected)) {
		return false;
	}
	if (verified->adoptManifest) {
		if (adoption == ManifestAdoption::Immediate) {
			AdoptManifest(verified->manifest);
		} else {
			crl::on_main([manifest = verified->manifest] {
				AdoptManifest(manifest);
			});
		}
	}

	const auto tempDirPath = cWorkingDir() + u"tupdates/temp"_q;
	const auto readyFilePath = cWorkingDir() + u"tupdates/temp/ready"_q;
	base::Platform::DeleteDirectory(tempDirPath);

	QDir tempDir(tempDirPath);
	if (tempDir.exists() || QFile(readyFilePath).exists()) {
		LOG(("Update Error: cant clear tupdates/temp dir!"));
		return false;
	}

	const auto uncompressed = Updates::DecompressUpdatePayload(
		*verified,
		&error);
	if (!uncompressed) {
		LOG(("Update Error: %1").arg(error));
		return false;
	}

	tempDir.mkdir(tempDir.absolutePath());

	const auto canary
		= (verified->envelope.channel == Updates::Channel::CanaryPublic)
		|| (verified->envelope.channel == Updates::Channel::CanaryPrivate);
	if (!Updates::ExtractUpdateFiles(
			*uncompressed,
			verified->envelope.version,
			tempDirPath,
			&error)) {
		LOG(("Update Error: %1").arg(error));
		return false;
	}
	if (!WriteUpdateVersionFile(
			tempDir,
			tempDirPath,
			Updates::UpdateVersionBase(verified->envelope.version),
			canary ? verified->envelope.version : 0)) {
		return false;
	}

	if (!WriteUpdateReadyFile(readyFilePath)) {
		return false;
	}
	QFile(filepath).remove();

	return true;
}

#endif // !TDESKTOP_DISABLE_AUTOUPDATE

bool UnpackUpdate(const QString &filepath, const UpdateInfo &expected) {
#ifndef TDESKTOP_DISABLE_AUTOUPDATE
	if (filepath.isEmpty()) {
		return true;
	}

#if !defined Q_OS_WIN && !defined Q_OS_MAC
	auto error = QString();
	const auto mode = KSandbox::isInside()
		? Platform::UpdateInstallMode::Writable
		: Platform::GetUpdateInstallMode(cExeDir() + cExeName(), error);
	if (mode == Platform::UpdateInstallMode::Refused) {
		LOG(("Update Error: %1").arg(error));
		return false;
	}
	const auto content = Platform::ReadUpdatePackage(filepath, error);
	if (!content) {
		LOG(("Update Error: %1").arg(error));
		return false;
	} else if (mode == Platform::UpdateInstallMode::Protected) {
		const auto envelope = Updates::ParseEnvelope(*content, &error);
		if (!envelope) {
			LOG(("Update Error: %1").arg(error));
			return false;
		} else if (!MatchesUpdateInfo(*envelope, expected)) {
			return false;
		}
		if (!Platform::PrepareProtectedUpdate(
				cWorkingDir(),
				filepath,
				*content,
				cInstallBetaVersion(),
				error)) {
			LOG(("Update Error: %1").arg(error));
			return false;
		}
		return true;
	}
	const auto &compressed = *content;
#else // !Q_OS_WIN && !Q_OS_MAC
	QFile input(filepath);
	if (!input.open(QIODevice::ReadOnly)) {
		LOG(("Update Error: cant read updates file!"));
		return false;
	} else if (input.size() > Loader::kMaxFileSize) {
		LOG(("Update Error: updates file is too large: %1").arg(input.size()));
		return false;
	}

	QByteArray compressed = input.readAll();
	input.close();
#endif // Q_OS_WIN || Q_OS_MAC

	if (!Updates::IsV2UpdateFile(compressed)) {
		LOG(("Update Error: unsupported update format (missing v2 magic)."));
		return false;
	}
	return UnpackUpdateV2(
		filepath,
		compressed,
		ManifestAdoption::Queued,
		expected);
#else // !TDESKTOP_DISABLE_AUTOUPDATE
	return false;
#endif // TDESKTOP_DISABLE_AUTOUPDATE
}

rpl::producer<CheckResult> Checker::ready() const {
	return _ready.events();
}

rpl::producer<> Checker::failed() const {
	return _failed.events();
}

void Checker::done(CheckResult result) {
	_ready.fire(std::move(result));
}

void Checker::fail() {
	_failed.fire({});
}

rpl::lifetime &Checker::lifetime() {
	return _lifetime;
}

MtpChecker::MtpChecker(base::weak_ptr<Main::Session> session)
: _mtp(session) {
}

void MtpChecker::start() {
	if (!_mtp.valid()) {
		LOG(("Update Info: MTP is unavailable."));
		crl::on_main(this, [=] { fail(); });
		return;
	}
	const auto messageId = UpdateMetadataMessageId();
	if (!messageId) {
		LOG(("Update Error: No metadata message for platform '%1'."
			).arg(Platform::AutoUpdateKey()));
		crl::on_main(this, [=] { fail(); });
		return;
	}
	MTP::ResolveChannel(&_mtp, u"rua_files"_q, [=](
			const MTPInputChannel &channel) {
		requestMetadata(channel, messageId);
	}, [=] { fail(); });
}

void MtpChecker::requestMetadata(
		const MTPInputChannel &channel,
		int messageId) {
	_mtp.send(
		MTPchannels_GetMessages(
			channel,
			MTP_vector<MTPInputMessage>(
				1,
				MTP_inputMessageID(MTP_int(messageId)))),
		[=](const MTPmessages_Messages &result) {
			gotMessage(channel, result, messageId);
		},
		failHandler());
}

void MtpChecker::gotMessage(
		const MTPInputChannel &channel,
		const MTPmessages_Messages &result,
		int messageId) {
	const auto message = MTP::GetMessagesElement(result, messageId);
	if (!message || message->type() != mtpc_message) {
		LOG(("Update Error: Metadata message %1 not found.").arg(messageId));
		fail();
		return;
	}
	parseMetadata(channel, message->c_message().vmessage().v);
}

void MtpChecker::parseMetadata(
		const MTPInputChannel &channel,
		const QByteArray &text) {
	if (text.isEmpty() || text.size() > kMaxResponseSize) {
		LOG(("Update Error: Bad metadata size."));
		fail();
		return;
	}
	auto parseError = QJsonParseError();
	const auto document = QJsonDocument::fromJson(text, &parseError);
	if (parseError.error != QJsonParseError::NoError
		|| !document.isObject()) {
		LOG(("Update Error: Could not parse metadata JSON."));
		fail();
		return;
	}
	const auto object = document.object();
	const auto format = object.value(u"format"_q);
	const auto channelsValue = object.value(u"channels"_q);
	if (!format.isDouble() || format.toDouble() != 1.
		|| !channelsValue.isObject()) {
		LOG(("Update Error: Unsupported metadata format."));
		fail();
		return;
	}

	const auto decode = [](const QJsonValue &value) {
		if (!value.isString()) {
			return QByteArray();
		}
		const auto decoded = QByteArray::fromBase64Encoding(
			value.toString().toLatin1(),
			QByteArray::AbortOnBase64DecodingErrors);
		return decoded ? decoded.decoded : QByteArray();
	};
	const auto manifestValue = object.value(u"manifest"_q);
	const auto signatureValue = object.value(u"manifest_sig"_q);
	if (!manifestValue.isUndefined() || !signatureValue.isUndefined()) {
		const auto manifest = decode(manifestValue);
		const auto signature = decode(signatureValue);
		auto error = QString();
		const auto parsed = Updates::ParseVerifiedManifest(
			manifest,
			signature,
			Updates::RootPublicKeyPem(),
			&error);
		if (!parsed) {
			LOG(("Update Error: Bad metadata manifest: %1").arg(error));
			fail();
			return;
		}
		AdoptManifest(*parsed);
	}

	const auto channels = channelsValue.toObject();
	const auto platform = Platform::AutoUpdateKey();
	auto best = UpdateInfo();
	for (const auto candidateChannel : {
			Updates::Channel::Stable,
			Updates::Channel::Beta,
			Updates::Channel::CanaryPublic,
			Updates::Channel::CanaryPrivate }) {
		const auto name = Updates::ChannelName(candidateChannel);
		const auto value = channels.value(QLatin1String(name));
		if (value.isUndefined()) {
			continue;
		}
		const auto info = value.isObject()
			? ReadUpdateInfo(value.toObject(), candidateChannel, platform)
			: std::nullopt;
		if (!info) {
			LOG(("Update Error: Invalid metadata for '%1:%2'."
				).arg(platform, QString::fromLatin1(name)));
			fail();
			return;
		}
		if (info->version > best.version
			&& Updates::ChannelPolicyAllows(
				BuildUpdateChannel,
				AppBetaVersion || cInstallBetaVersion(),
				info->channel,
				info->version,
				RunningUpdateVersion())) {
			best = *info;
		}
	}
	if (!best.version || best.version <= RunningUpdateVersion()) {
		done({});
		return;
	}
	auto location = FileLocation();
	location.channelId = uint64(channel.c_inputChannel().vchannel_id().v);
	location.accessHash = uint64(channel.c_inputChannel().vaccess_hash().v);
	location.postId = best.postId;
	MTP::StartDedicatedLoader(
		&_mtp,
		location,
		UpdatesFolder(),
		[=](std::unique_ptr<MTP::DedicatedLoader> loader) {
			if (loader) {
				done({ std::move(loader), best });
			} else {
				fail();
			}
		});
}

Fn<void(const MTP::Error &error)> MtpChecker::failHandler() {
	return [=](const MTP::Error &error) {
		LOG(("Update Error: MTP check failed with '%1'"
			).arg(QString::number(error.code()) + ':' + error.type()));
		fail();
	};
}

} // namespace

bool UpdaterDisabled() {
	return UpdaterIsDisabled || KSandbox::isInside();
}

void SetUpdaterDisabledAtStartup() {
	Expects(UpdaterInstance.lock() == nullptr);

	UpdaterIsDisabled = true;
}

class Updater : public base::has_weak_ptr {
public:
	Updater();

	rpl::producer<> checking() const;
	rpl::producer<> isLatest() const;
	rpl::producer<Progress> progress() const;
	rpl::producer<> failed() const;
	rpl::producer<> ready() const;

	void start(bool forceWait);
	void stop();
	void test();

	State state() const;
	int already() const;
	int size() const;
	bool percent() const;

	void setMtproto(base::weak_ptr<Main::Session> session);

	~Updater();

private:
	enum class Action {
		Waiting,
		Checking,
		Loading,
		Unpacking,
		Ready,
	};
	void check();
	void startImplementation(
		not_null<Implementation*> which,
		std::unique_ptr<Checker> checker);
	bool tryLoaders();
	void handleTimeout();
	void checkerDone(
		not_null<Implementation*> which,
		CheckResult result);
	void checkerFail(not_null<Implementation*> which);

	void finalize(QString filepath);
	void unpackDone(bool ready);
	void handleChecking();
	void handleProgress();
	void handleLatest();
	void handleFailed();
	void handleReady();
	void scheduleNext();

	Action _action = Action::Waiting;
	base::Timer _timer;
	base::Timer _retryTimer;
	rpl::event_stream<> _checking;
	rpl::event_stream<> _isLatest;
	rpl::event_stream<Progress> _progress;
	rpl::event_stream<> _failed;
	rpl::event_stream<> _ready;
	Implementation _mtpImplementation;
	std::shared_ptr<Loader> _activeLoader;
	base::weak_ptr<Main::Session> _session;

	rpl::lifetime _lifetime;

};

Updater::Updater()
: _timer([=] { check(); })
, _retryTimer([=] { handleTimeout(); }) {
	checking() | rpl::on_next([=] {
		handleChecking();
	}, _lifetime);
	progress() | rpl::on_next([=] {
		handleProgress();
	}, _lifetime);
	failed() | rpl::on_next([=] {
		handleFailed();
	}, _lifetime);
	ready() | rpl::on_next([=] {
		handleReady();
	}, _lifetime);
	isLatest() | rpl::on_next([=] {
		handleLatest();
	}, _lifetime);
}

rpl::producer<> Updater::checking() const {
	return _checking.events();
}

rpl::producer<> Updater::isLatest() const {
	return _isLatest.events();
}

auto Updater::progress() const
-> rpl::producer<Progress> {
	return _progress.events();
}

rpl::producer<> Updater::failed() const {
	return _failed.events();
}

rpl::producer<> Updater::ready() const {
	return _ready.events();
}

void Updater::check() {
	start(false);
}

void Updater::handleReady() {
	stop();
	_action = Action::Ready;
	if (!Quitting()) {
		cSetLastUpdateCheck(base::unixtime::now());
		Local::writeSettings();
	}
}

void Updater::handleFailed() {
	scheduleNext();
}

void Updater::handleLatest() {
	if (const auto update = FindUpdateFile(); !update.isEmpty()) {
		QFile(update).remove();
	}
	scheduleNext();
}

void Updater::handleChecking() {
	_action = Action::Checking;
	_retryTimer.callOnce(kUpdaterTimeout);
}

void Updater::handleProgress() {
	_retryTimer.callOnce(kUpdaterTimeout);
}

void Updater::scheduleNext() {
	stop();
	if (!Quitting()) {
		cSetLastUpdateCheck(base::unixtime::now());
		Local::writeSettings();
		start(true);
	}
}

auto Updater::state() const -> State {
	if (_action == Action::Ready) {
		return State::Ready;
	} else if (_action == Action::Loading) {
		return State::Download;
	}
	return State::None;
}

int Updater::size() const {
	return _activeLoader ? _activeLoader->totalSize() : 0;
}

int Updater::already() const {
	return _activeLoader ? _activeLoader->alreadySize() : 0;
}

bool Updater::percent() const {
	return _activeLoader ? _activeLoader->preferPercent() : 0;
}

void Updater::stop() {
	_timer.cancel();
	_retryTimer.cancel();
	_mtpImplementation = Implementation();
	_activeLoader = nullptr;
	_action = Action::Waiting;
}

void Updater::start(bool forceWait) {
	if (UpdaterDisabled() || cExeName().isEmpty()) {
		return;
	}

	_timer.cancel();
	if (!cAutoUpdate() || _action != Action::Waiting) {
		return;
	}

	_retryTimer.cancel();
	const auto frequent = cAlphaVersion() || BuildIsCanary;
	const auto constDelay = frequent
		? kFrequentUpdateDelayConstPart
		: UpdateDelayConstPart;
	const auto randDelay = frequent
		? kFrequentUpdateDelayRandPart
		: UpdateDelayRandPart;
	const auto updateInSecs = cLastUpdateCheck()
		+ constDelay
		+ int(rand() % randDelay)
		- base::unixtime::now();
	auto sendRequest = (updateInSecs <= 0)
		|| (updateInSecs > constDelay + randDelay);
	if (!sendRequest && !forceWait) {
		if (!FindUpdateFile().isEmpty()) {
			sendRequest = true;
		}
	}
	if (cManyInstance() && !Logs::DebugEnabled()) {
		// Only main instance is updating.
		return;
	}

	if (sendRequest) {
		if (!PrepareUpdateStorage()) {
			_failed.fire({});
			return;
		}
		startImplementation(
			&_mtpImplementation,
			std::make_unique<MtpChecker>(_session));
		_checking.fire({});
	} else {
		_timer.callOnce((updateInSecs + 5) * crl::time(1000));
	}
}

void Updater::startImplementation(
		not_null<Implementation*> which,
		std::unique_ptr<Checker> checker) {
	checker->ready(
	) | rpl::on_next([=](CheckResult &&result) {
		checkerDone(which, std::move(result));
	}, checker->lifetime());
	checker->failed(
	) | rpl::on_next([=] {
		checkerFail(which);
	}, checker->lifetime());

	*which = Implementation{ std::move(checker) };

	crl::on_main(which->checker.get(), [=] {
		which->checker->start();
	});
}

void Updater::checkerDone(
		not_null<Implementation*> which,
		CheckResult result) {
	which->checker = nullptr;
	which->result = std::move(result);

	tryLoaders();
}

void Updater::checkerFail(not_null<Implementation*> which) {
	which->checker = nullptr;
	which->failed = true;

	tryLoaders();
}

void Updater::test() {
	cSetLastUpdateCheck(0);
	start(false);
}

void Updater::setMtproto(base::weak_ptr<Main::Session> session) {
	if (_session.get() == session.get()) {
		return;
	}
	_session = session;
	if (_action == Action::Checking || _action == Action::Loading) {
		stop();
	}
	if (_session && _action == Action::Waiting) {
		cSetLastUpdateCheck(0);
		start(false);
	}
}

void Updater::handleTimeout() {
	if (_action == Action::Checking) {
		if (base::take(_mtpImplementation.checker)) {
			_mtpImplementation.failed = true;
		}
		if (!tryLoaders()) {
			cSetLastUpdateCheck(0);
			_timer.callOnce(kUpdaterTimeout);
		}
	} else if (_action == Action::Loading) {
		_failed.fire({});
	}
}

bool Updater::tryLoaders() {
	if (_mtpImplementation.checker) {
		return true;
	}
	_retryTimer.cancel();
	if (_mtpImplementation.failed) {
		_failed.fire({});
		return false;
	}
	_activeLoader = std::move(_mtpImplementation.result.loader);
	const auto loader = _activeLoader.get();
	if (!loader) {
		_isLatest.fire({});
		return true;
	}
	_action = Action::Loading;
	loader->progress(
	) | rpl::start_to_stream(_progress, loader->lifetime());
	loader->ready(
	) | rpl::on_next([=](QString &&filepath) {
		finalize(std::move(filepath));
	}, loader->lifetime());
	loader->failed(
	) | rpl::on_next([=] {
		_failed.fire({});
	}, loader->lifetime());

	_retryTimer.callOnce(kUpdaterTimeout);
	loader->wipeFolder();
	loader->start();
	return true;
}

void Updater::finalize(QString filepath) {
	if (_action != Action::Loading) {
		return;
	}
	_retryTimer.cancel();
	_activeLoader = nullptr;
	_action = Action::Unpacking;
	const auto expected = _mtpImplementation.result.info;
	crl::async([=] {
		const auto ready = UnpackUpdate(filepath, expected);
		crl::on_main([=] {
			GetUpdaterInstance()->unpackDone(ready);
		});
	});
}

void Updater::unpackDone(bool ready) {
	if (ready) {
		_ready.fire({});
	} else {
		ClearAll();
		_failed.fire({});
	}
}

Updater::~Updater() {
	stop();
}

UpdateChecker::UpdateChecker()
: _updater(GetUpdaterInstance()) {
	if (IsAppLaunched() && Core::App().domain().started()) {
		if (const auto session = Core::App().activeAccount().maybeSession()) {
			_updater->setMtproto(session);
		}
	}
}

rpl::producer<> UpdateChecker::checking() const {
	return _updater->checking();
}

rpl::producer<> UpdateChecker::isLatest() const {
	return _updater->isLatest();
}

auto UpdateChecker::progress() const
-> rpl::producer<Progress> {
	return _updater->progress();
}

rpl::producer<> UpdateChecker::failed() const {
	return _updater->failed();
}

rpl::producer<> UpdateChecker::ready() const {
	return _updater->ready();
}

void UpdateChecker::start(bool forceWait) {
	_updater->start(forceWait);
}

void UpdateChecker::test() {
	_updater->test();
}

void UpdateChecker::setMtproto(base::weak_ptr<Main::Session> session) {
	_updater->setMtproto(session);
}

void UpdateChecker::stop() {
	_updater->stop();
}

auto UpdateChecker::state() const
-> State {
	return _updater->state();
}

int UpdateChecker::already() const {
	return _updater->already();
}

int UpdateChecker::size() const {
	return _updater->size();
}

bool UpdateChecker::percent() const {
	return _updater->percent();
}

//QString winapiErrorWrap() {
//	WCHAR errMsg[2048];
//	DWORD errorCode = GetLastError();
//	LPTSTR errorText = NULL, errorTextDefault = L"(Unknown error)";
//	FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_IGNORE_INSERTS, NULL, errorCode, MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT), (LPTSTR)&errorText, 0, 0);
//	if (!errorText) {
//		errorText = errorTextDefault;
//	}
//	StringCbPrintf(errMsg, sizeof(errMsg), L"Error code: %d, error message: %s", errorCode, errorText);
//	if (errorText != errorTextDefault) {
//		LocalFree(errorText);
//	}
//	return QString::fromWCharArray(errMsg);
//}

bool checkReadyUpdate() {
	if (UpdaterDisabled() || !PrepareUpdateStorage()) {
		return false;
	}
#if !defined Q_OS_WIN && !defined Q_OS_MAC
	if (!KSandbox::isInside()) {
		const auto packagePresent = Platform::ReadyUpdatePackagePresent(
			cWorkingDir());
		const auto temp = QFileInfo(cWorkingDir() + u"tupdates/temp"_q);
		const auto legacy = QFileInfo(cWorkingDir() + u"tupdates/ready"_q);
		if (!packagePresent
			&& !temp.exists() && !temp.isSymLink()
			&& !legacy.exists() && !legacy.isSymLink()) {
			return false;
		}
		auto error = QString();
		const auto reject = [&] {
			LOG(("Update Error: %1").arg(error));
			ClearAll();
			return false;
		};
		const auto mode = Platform::GetUpdateInstallMode(
			cExeDir() + cExeName(),
			error);
		if (mode == Platform::UpdateInstallMode::Refused) {
			return reject();
		} else if (packagePresent) {
			if (!Platform::ClearUpdateData(cWorkingDir(), error, true)) {
				return reject();
			}
			const auto package = Platform::ReadyUpdatePackagePath(cWorkingDir());
			const auto content = Platform::ReadUpdatePackage(package, error);
			if (!content) {
				return reject();
			} else if (mode == Platform::UpdateInstallMode::Protected) {
				if (!Platform::ValidateProtectedUpdate(
						*content,
						cInstallBetaVersion(),
						error)) {
					return reject();
				}
				return true;
			}
#ifndef TDESKTOP_DISABLE_AUTOUPDATE
			if (!UnpackUpdateV2(
					package,
					*content,
					ManifestAdoption::Immediate)
				|| (Platform::ReadyUpdatePackagePresent(cWorkingDir())
					&& !QFile::remove(package))) {
				error = u"Could not unpack and retire the ready update package."_q;
				return reject();
			}
#endif // !TDESKTOP_DISABLE_AUTOUPDATE
		} else if (mode == Platform::UpdateInstallMode::Protected) {
			error = u"An unpacked update cannot be installed with privilege."_q;
			return reject();
		}
	}
#endif // !Q_OS_WIN && !Q_OS_MAC
	QString readyFilePath = cWorkingDir() + u"tupdates/temp/ready"_q, readyPath = cWorkingDir() + u"tupdates/temp"_q;
	if (!QFile(readyFilePath).exists() || cExeName().isEmpty()) {
		if (QDir(cWorkingDir() + u"tupdates/ready"_q).exists() || QDir(cWorkingDir() + u"tupdates/temp"_q).exists()) {
			ClearAll();
		}
		return false;
	}

	// check ready version
	QString versionPath = readyPath + u"/tdata/version"_q;
	{
		QFile fVersion(versionPath);
		if (!fVersion.open(QIODevice::ReadOnly)) {
			LOG(("Update Error: cant read version file '%1'").arg(versionPath));
			ClearAll();
			return false;
		}
		auto versionNum = VersionInt();
		if (fVersion.read((char*)&versionNum, sizeof(VersionInt)) != sizeof(VersionInt)) {
			LOG(("Update Error: cant read version from file '%1'").arg(versionPath));
			ClearAll();
			return false;
		}
		if (versionNum == 0x7FFFFFFF) { // alpha version
			LOG(("Update Error: legacy alpha update is not supported."));
			ClearAll();
			return false;
		} else if (versionNum == kVersionFileCanaryMarker) {
			quint64 canaryVersion = 0;
			if (fVersion.read((char*)&canaryVersion, sizeof(quint64)) != sizeof(quint64)) {
				LOG(("Update Error: cant read canary version from file '%1'").arg(versionPath));
				ClearAll();
				return false;
			}
			if (!BuildIsCanary || canaryVersion <= RunningUpdateVersion()) {
				LOG(("Update Error: cant install canary version %1 having version %2").arg(canaryVersion).arg(RunningUpdateVersion()));
				ClearAll();
				return false;
			}
		} else if (BuildUpdateChannel == Updates::Channel::CanaryPrivate) {
			LOG(("Update Error: cant install a non-canary version %1 on a private canary").arg(versionNum));
			ClearAll();
			return false;
		} else if (versionNum <= AppVersion) {
			LOG(("Update Error: cant install version %1 having version %2").arg(versionNum).arg(AppVersion));
			ClearAll();
			return false;
		}
		fVersion.close();
	}

#ifdef Q_OS_WIN
	QString curUpdater = (cExeDir() + u"Updater.exe"_q);
	QFileInfo updater(cWorkingDir() + u"tupdates/temp/Updater.exe"_q);
#elif defined Q_OS_MAC // Q_OS_WIN
	QString curUpdater = (cExeDir() + cExeName() + u"/Contents/Frameworks/Updater"_q);
	QFileInfo updater(cWorkingDir() + u"tupdates/temp/Yurigram.app/Contents/Frameworks/Updater"_q);
#else // Q_OS_MAC
	QString curUpdater = (cExeDir() + u"Updater"_q);
	QFileInfo updater(cWorkingDir() + u"tupdates/temp/Updater"_q);
#endif // else for Q_OS_WIN || Q_OS_MAC
	if (!updater.exists()) {
		QFileInfo current(curUpdater);
		if (!current.exists()) {
			ClearAll();
			return false;
		}
#if !defined Q_OS_WIN && !defined Q_OS_MAC
		if (!KSandbox::isInside()) {
			if (!current.isFile() || !current.isExecutable()) {
				ClearAll();
				return false;
			}
			return true;
		}
#endif // !Q_OS_WIN && !Q_OS_MAC
		if (!QFile(current.absoluteFilePath()).copy(updater.absoluteFilePath())) {
			ClearAll();
			return false;
		}
	}
#ifdef Q_OS_WIN
	if (CopyFile(updater.absoluteFilePath().toStdWString().c_str(), curUpdater.toStdWString().c_str(), FALSE) == FALSE) {
		const auto errorCode = GetLastError();
		LOG(("Update Error: could not copy '%1' to '%2', error code: %3"
			).arg(updater.absoluteFilePath()).arg(curUpdater).arg(errorCode));
		if (errorCode == ERROR_ACCESS_DENIED) { // we are in write-protected dir, like Program Files
			cSetWriteProtected(true);
			return true;
		} else {
			ClearAll();
			return false;
		}
	}
	if (DeleteFile(updater.absoluteFilePath().toStdWString().c_str()) == FALSE) {
		ClearAll();
		return false;
	}
#elif defined Q_OS_MAC // Q_OS_WIN
	QDir().mkpath(QFileInfo(curUpdater).absolutePath());
	DEBUG_LOG(("Update Info: moving %1 to %2...").arg(updater.absoluteFilePath()).arg(curUpdater));
	if (!objc_moveFile(updater.absoluteFilePath(), curUpdater)) {
		ClearAll();
		return false;
	}
#else // Q_OS_MAC
	if (QFile::exists(curUpdater)
		&& unlink(QFile::encodeName(curUpdater).constData())) {
		DEBUG_LOG(("Update Error: could not unlink current Updater."));
		ClearAll();
		return false;
	}
	if (!linuxMoveFile(QFile::encodeName(updater.absoluteFilePath()).constData(), QFile::encodeName(curUpdater).constData())) {
		DEBUG_LOG(("Update Error: could not copy new Updater."));
		ClearAll();
		return false;
	}
#endif // else for Q_OS_WIN || Q_OS_MAC

#ifdef Q_OS_MAC
	base::Platform::RemoveQuarantine(QFileInfo(curUpdater).absolutePath());
	base::Platform::RemoveQuarantine(updater.absolutePath());
#endif // Q_OS_MAC

	return true;
}

void UpdateApplication() {
	if (UpdaterDisabled()) {
		UrlClickHandler::Open(u"https://t.me/ruadevs"_q);
	} else {
		cSetAutoUpdate(true);
		const auto window = Core::IsAppLaunched()
			? Core::App().activePrimaryWindow()
			: nullptr;
		if (window) {
			if (const auto controller = window->sessionController()) {
				controller->showSection(
					std::make_shared<Info::Memento>(
						Info::Settings::Tag{ controller->session().user() },
						::Settings::AdvancedId()),
					Window::SectionShow());
			} else {
				window->widget()->showSpecialLayer(
					Box<::Settings::LayerWidget>(window),
					anim::type::normal);
			}
			window->widget()->showFromTray();
		}
		cSetLastUpdateCheck(0);
		Core::UpdateChecker().start();
	}
}

QString countAlphaVersionSignature(uint64 version) { // duplicated in packer.cpp
	if (cAlphaPrivateKey().isEmpty()) {
		LOG(("Error: Trying to count alpha version signature without alpha private key!"));
		return QString();
	}

	QByteArray signedData = (qstr("TelegramBeta_") + QString::number(version, 16).toLower()).toUtf8();

	static const int32 shaSize = 20, keySize = 128;

	uchar sha1Buffer[shaSize];
	hashSha1(signedData.constData(), signedData.size(), sha1Buffer); // count sha1

	uint32 siglen = 0;

	RSA *prKey = [] {
		const auto bio = MakeBIO(
			const_cast<char*>(cAlphaPrivateKey().constData()),
			-1);
		return PEM_read_bio_RSAPrivateKey(bio.get(), 0, 0, 0);
	}();
	if (!prKey) {
		LOG(("Error: Could not read alpha private key!"));
		return QString();
	}
	if (RSA_size(prKey) != keySize) {
		LOG(("Error: Bad alpha private key size: %1").arg(RSA_size(prKey)));
		RSA_free(prKey);
		return QString();
	}
	QByteArray signature;
	signature.resize(keySize);
	if (RSA_sign(NID_sha1, (const uchar*)(sha1Buffer), shaSize, (uchar*)(signature.data()), &siglen, prKey) != 1) { // count signature
		LOG(("Error: Counting alpha version signature failed!"));
		RSA_free(prKey);
		return QString();
	}
	RSA_free(prKey);

	if (siglen != keySize) {
		LOG(("Error: Bad alpha version signature length: %1").arg(siglen));
		return QString();
	}

	signature = signature.toBase64(QByteArray::Base64UrlEncoding | QByteArray::OmitTrailingEquals);
	signature = signature.replace('-', '8').replace('_', 'B');
	return QString::fromUtf8(signature.mid(19, 32));
}

} // namespace Core
