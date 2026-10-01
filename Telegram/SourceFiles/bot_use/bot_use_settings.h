#pragma once

#include "rpl/event_stream.h"

#include <QtCore/QByteArray>
#include <QtCore/QMap>
#include <QtCore/QString>

#include <array>
#include <cstddef>
#include <optional>
#include <string_view>
#include <variant>

namespace tr {
template <typename... Tags>
struct phrase;
} // namespace tr

namespace BotUse {

class Manager;

namespace Settings {

enum class OptionId {
	DisableTypingStatus,
	AutoSwitchRichEditor,
	AllowReplyAndRepeatBots,
	Count,
};

inline constexpr auto kOptionCount = static_cast<std::size_t>(OptionId::Count);

template <typename Value>
struct Key {
	OptionId id = OptionId::Count;
};

namespace Option {
inline constexpr auto DisableTypingStatus
	= Key<bool>{ OptionId::DisableTypingStatus };
inline constexpr auto AutoSwitchRichEditor
	= Key<bool>{ OptionId::AutoSwitchRichEditor };
inline constexpr auto AllowReplyAndRepeatBots
	= Key<bool>{ OptionId::AllowReplyAndRepeatBots };
} // namespace Option

using StoredValue = std::variant<bool, int, QString>;

struct Descriptor {
	OptionId id = OptionId::Count;
	std::string_view storageKey;
	std::string_view controlId;
	const tr::phrase<> *title = nullptr;
	StoredValue defaultValue;
};

using DescriptorList = std::array<Descriptor, kOptionCount>;

[[nodiscard]] const DescriptorList &Descriptors();
[[nodiscard]] const Descriptor &DescriptorFor(OptionId id);
[[nodiscard]] QString StorageKey(OptionId id);
[[nodiscard]] QString ControlId(OptionId id);
[[nodiscard]] QString OptionTitle(OptionId id);

class Registry final {
public:
	Registry();

	[[nodiscard]] const StoredValue &value(OptionId id) const;
	[[nodiscard]] rpl::producer<> changes(OptionId id) const;
	[[nodiscard]] QByteArray serialize() const;
	[[nodiscard]] bool deserialize(const QByteArray &data);

	template <typename Value>
	[[nodiscard]] const Value &get(Key<Value> key) const {
		return std::get<Value>(value(key.id));
	}

private:
	friend class ::BotUse::Manager;

	[[nodiscard]] bool assign(OptionId id, StoredValue value);
	void notify(OptionId id);
	void reset();

	std::array<StoredValue, kOptionCount> _values;
	QMap<QString, QByteArray> _unknown;
	rpl::event_stream<OptionId> _changes;
};

} // namespace Settings
} // namespace BotUse
