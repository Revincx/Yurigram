#include "bot_use/bot_use_settings.h"

#include "lang/lang_keys.h"

#include <QtCore/QDataStream>
#include <QtCore/QSet>

#include <type_traits>

namespace BotUse::Settings {
namespace {

constexpr auto kRegistryVersion = quint32(1);
constexpr auto kMaximumRegistrySize = 1024 * 1024;
constexpr auto kMaximumRegistryEntries = quint32(1024);

enum class ValueTag : quint8 {
	Boolean = 1,
	Integer = 2,
	String = 3,
};

Descriptor Bool(
		OptionId id,
		std::string_view storageKey,
		const tr::phrase<> *title,
		std::string_view controlId,
		bool defaultValue = false) {
	return {
		.id = id,
		.storageKey = storageKey,
		.controlId = controlId,
		.title = title,
		.defaultValue = defaultValue,
	};
}

const DescriptorList &DescriptorData() {
	static const auto result = DescriptorList{
		Bool(
			OptionId::DisableTypingStatus,
			"disable_typing_status",
			&tr::lng_bot_use_disable_typing_status,
			"bot-use/disable-typing-status"),
	};
	return result;
}

std::size_t Index(OptionId id) {
	const auto result = static_cast<std::size_t>(id);
	Expects(result < kOptionCount);
	return result;
}

QString FromUtf8(std::string_view value) {
	return QString::fromUtf8(value.data(), int(value.size()));
}

std::array<StoredValue, kOptionCount> DefaultValues() {
	auto result = std::array<StoredValue, kOptionCount>();
	for (const auto &descriptor : DescriptorData()) {
		result[Index(descriptor.id)] = descriptor.defaultValue;
	}
	return result;
}

const Descriptor *DescriptorByStorageKey(const QString &key) {
	for (const auto &descriptor : DescriptorData()) {
		if (FromUtf8(descriptor.storageKey) == key) {
			return &descriptor;
		}
	}
	return nullptr;
}

QByteArray SerializeValue(const StoredValue &value) {
	auto result = QByteArray();
	auto stream = QDataStream(&result, QIODevice::WriteOnly);
	stream.setVersion(QDataStream::Qt_5_1);
	std::visit([&](const auto &current) {
		using Type = std::decay_t<decltype(current)>;
		if constexpr (std::is_same_v<Type, bool>) {
			stream << quint8(ValueTag::Boolean) << current;
		} else if constexpr (std::is_same_v<Type, int>) {
			stream << quint8(ValueTag::Integer) << qint32(current);
		} else {
			stream << quint8(ValueTag::String) << current;
		}
	}, value);
	return result;
}

std::optional<StoredValue> DeserializeValue(
		const Descriptor &descriptor,
		const QByteArray &data) {
	auto stream = QDataStream(data);
	stream.setVersion(QDataStream::Qt_5_1);
	auto tag = quint8();
	stream >> tag;
	auto result = std::optional<StoredValue>();
	if (std::holds_alternative<bool>(descriptor.defaultValue)
		&& tag == quint8(ValueTag::Boolean)) {
		auto value = false;
		stream >> value;
		result = value;
	} else if (std::holds_alternative<int>(descriptor.defaultValue)
		&& tag == quint8(ValueTag::Integer)) {
		auto value = qint32();
		stream >> value;
		result = int(value);
	} else if (std::holds_alternative<QString>(descriptor.defaultValue)
		&& tag == quint8(ValueTag::String)) {
		auto value = QString();
		stream >> value;
		result = std::move(value);
	}
	return result
		&& stream.atEnd()
		&& stream.status() == QDataStream::Ok
		? result
		: std::nullopt;
}

} // namespace

const DescriptorList &Descriptors() {
	return DescriptorData();
}

const Descriptor &DescriptorFor(OptionId id) {
	return DescriptorData()[Index(id)];
}

QString StorageKey(OptionId id) {
	return FromUtf8(DescriptorFor(id).storageKey);
}

QString ControlId(OptionId id) {
	return FromUtf8(DescriptorFor(id).controlId);
}

QString OptionTitle(OptionId id) {
	const auto title = DescriptorFor(id).title;
	return title ? (*title)(tr::now) : QString();
}

Registry::Registry() : _values(DefaultValues()) {
}

const StoredValue &Registry::value(OptionId id) const {
	return _values[Index(id)];
}

rpl::producer<> Registry::changes(OptionId id) const {
	return _changes.events()
		| rpl::filter([=](OptionId changed) { return changed == id; })
		| rpl::map_to(rpl::empty);
}

QByteArray Registry::serialize() const {
	auto result = QByteArray();
	auto stream = QDataStream(&result, QIODevice::WriteOnly);
	stream.setVersion(QDataStream::Qt_5_1);
	stream << kRegistryVersion
		<< quint32(kOptionCount + std::size_t(_unknown.size()));
	for (const auto &descriptor : DescriptorData()) {
		stream << FromUtf8(descriptor.storageKey)
			<< SerializeValue(value(descriptor.id));
	}
	for (auto i = _unknown.cbegin(); i != _unknown.cend(); ++i) {
		stream << i.key() << i.value();
	}
	return result;
}

bool Registry::deserialize(const QByteArray &data) {
	if (data.size() > kMaximumRegistrySize) {
		return false;
	}
	auto stream = QDataStream(data);
	stream.setVersion(QDataStream::Qt_5_1);
	auto version = quint32();
	auto count = quint32();
	stream >> version >> count;
	if (version != kRegistryVersion || count > kMaximumRegistryEntries) {
		return false;
	}
	auto values = DefaultValues();
	auto unknown = QMap<QString, QByteArray>();
	auto keys = QSet<QString>();
	for (auto i = quint32(); i != count; ++i) {
		auto key = QString();
		auto encoded = QByteArray();
		stream >> key >> encoded;
		if (key.isEmpty()
			|| encoded.size() > kMaximumRegistrySize
			|| keys.contains(key)) {
			return false;
		}
		keys.insert(key);
		if (const auto descriptor = DescriptorByStorageKey(key)) {
			const auto decoded = DeserializeValue(*descriptor, encoded);
			if (!decoded) {
				return false;
			}
			values[Index(descriptor->id)] = *decoded;
		} else {
			unknown.insert(std::move(key), std::move(encoded));
		}
	}
	if (!stream.atEnd() || stream.status() != QDataStream::Ok) {
		return false;
	}
	_values = std::move(values);
	_unknown = std::move(unknown);
	return true;
}

bool Registry::assign(OptionId id, StoredValue value) {
	const auto index = Index(id);
	Expects(value.index() == DescriptorFor(id).defaultValue.index());
	if (_values[index] == value) {
		return false;
	}
	_values[index] = std::move(value);
	return true;
}

void Registry::notify(OptionId id) {
	_changes.fire_copy(id);
}

void Registry::reset() {
	const auto defaults = DefaultValues();
	_unknown.clear();
	for (auto i = std::size_t(); i != kOptionCount; ++i) {
		if (_values[i] != defaults[i]) {
			_values[i] = defaults[i];
			notify(static_cast<OptionId>(i));
		}
	}
}

} // namespace BotUse::Settings
