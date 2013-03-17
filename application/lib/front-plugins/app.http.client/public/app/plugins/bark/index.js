var bark = require("bark-notifications");

exports.name = "bark";
exports.plugin = function() {
	var brk = bark();

	//alert system
	brk.
	register("alert").
	max(1).
	options({ ok: "OK" }).
	layout({ center: true, top: 200, width: 400 }).
	classes({ modal: "alert-modal" }).
	transitionIn({ scale: 0.75, opacity: 0 }, { scale: 1, opacity: 1 }).
	transitionOut({ }, { scale: 0.9, opacity: 0 }).
	template(bTemplates["alert-notification"]);


	brk.
	register("clickToClose", "alert").
	layout({ center: true, top: 200, width: "50%" }).
	classes({ modal: "alert-modal" }).
	transitionOut({ }, { scale: 0.9, opacity: 0 }).
	template(bTemplates["click-to-close-notification"]).
	on("openNotification", function(notification) {
		$(document).one("click", function() {
			notification.transitionOut();
		});
	}); 


	brk.
	register("confirm", "alert").
	options({ ok: "OK", cancel: "Cancel" });


	return brk;
}