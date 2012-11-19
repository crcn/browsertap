module.exports = require("../../../views/base").extend({
	"templateName": "app-switcher",
	"apps": {
		"opera": "opera 10",
		"safari": "safari 5.0.5",
		"firefox": "firefox 9",
		"chrome": "chrome 19"
	},
	"render": function() {
		this._hidden = true;
		module.exports.__super__.render.call(this);
		$(this.el).width(this.templateData().apps.length * (100 + 8));


		var self = this;
		$(this.el).find(".app-switcher-item").each(function(i, item) {
			$(item).mouseover(function() {
				self._selectItem($(item));
			});
		});

		$(document).mousedown(function() {
			if(self._hidden) return;
			self.toggleShow();
			self._setSelectedItem();
		});
	},
	"toggleShow": function() {

		this._hidden = !this._hidden;
		$(this.el).css({ visibility: "visible"});

		var self = this;
		if(!this._hidden) {
			$(this.el).css({ opacity: 0 });
			$(this.el).transit({ opacity: 0.95 }, 200);
			this._findSelected();
		} else {
			$(this.el).transit({ opacity: 0 }, 200, function() {
				$(self.el).css({ visibility: "hidden" });
			});
		}
	},
	"templateData": function() {
		return {
			apps: ["chrome", "firefox", "safari", "opera"]
		}
	},
	"_selectItem": function($item) {
		if(this._selected) this._selected.find(".app-switcher-selected").css({ visibility: "hidden" });
		$item.find(".app-switcher-selected").css({ visibility: "visible" });
		this._selected = $item;
	},
	"_findSelected": function() {
		var selected = this.options.loader._app.split(" ").shift();
		this._selectItem($(this.el).find("[data-app=\""+selected+"\"]"));

	},
	"_setSelectedItem": function() {
		var app = this._selected.attr("data-app");
		this.options.router.redirect("/live", { app: this.apps[app] || "chrome 19" });
	}
});