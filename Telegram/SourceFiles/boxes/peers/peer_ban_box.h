#pragma once

#include "ui/boxes/confirm_box.h"
#include "ui/wrap/vertical_layout.h"

namespace Ui {
class Radiobutton;
class RadiobuttonGroup;
class Show;
} // namespace Ui

class PeerRestrictionUntil final : public Ui::VerticalLayout {
public:
	PeerRestrictionUntil(
		QWidget *parent,
		std::shared_ptr<Ui::Show> show,
		rpl::producer<QString> title,
		TimeId until = 0);

	[[nodiscard]] TimeId value() const;

private:
	void chooseCustom();
	void setCustomUntil(TimeId until);

	const std::shared_ptr<Ui::Show> _show;
	std::shared_ptr<Ui::RadiobuttonGroup> _group;
	base::unique_qptr<Ui::Radiobutton> _customOption;
	TimeId _until = 0;

};

[[nodiscard]] object_ptr<Ui::GenericBox> MakePeerBanBox(
	Ui::ConfirmBoxArgs args,
	Fn<void(TimeId, Fn<void()>)> confirmed);
