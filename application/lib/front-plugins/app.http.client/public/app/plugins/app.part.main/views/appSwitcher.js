module.exports = require("../../../views/base").extend({
	"templateName": "app-switcher",
	"apps": {
		"opera": ["10", "11.1","11.5","11.6","11"],
		"safari": ["4","5.0.5","5.1"],
		"firefox": ["3.5","3.6","3","4","5","6","7","8","9","10","11","12"],
		"chrome": ["3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"]
	},
	"currentVersionIndex": 0,
	"initialize": function() {
		this._hidden = true;
		var self = this;

		function onApp() {
			var ap = self.options.loader.options.app.split(" ");
			self._app = ap.shift();
			self.currentVersionIndex = self.apps[self._app].indexOf(ap.pop());
			self._setCA();
		}
		this.options.loader.on("loading", onApp);
		onApp();




		$(document).keyup(function(e) {
			if(e.keyCode != 16) return; //shift
			if(self._hidden) return;
			self.hide();
			self._setSelectedItem();
		});


		$(this.el).find(".app-switcher-item").each(function(i, item) {
			$(item).mouseover(function() {
				self._selectItem($(item));
			});
		});

		module.exports.__super__.initialize.call(this);
	},
	"render": function() {
		module.exports.__super__.render.call(this);
		$(this.el).width(this.templateData().apps.length * (100 + 8));

	},
	"shift": function(position) {
		this._findSelected();

		if(this._hidden) {
			this._hidden = false;
			$(this.el).css({ visibility: "visible"});
			$(this.el).css({ opacity: 0 });
			$(this.el).transit({ opacity: 0.95 }, 200);
		}

		var apps = _.keys(this.apps),
		selectedApp = this._selectedApp(),
		versions = this.apps[selectedApp],
		self = this,
		i;

		if(/left|right/.test(position)) {
			i = apps.indexOf(selectedApp);
			if(position == "left") {
				i = i - 1;
				if(i < 0) i = apps.length -1;
			} else
			if(position == "right") {
				i = i + 1;
				if(i > apps.length - 1 ) i = 0;
			}

			this._findSelected(apps[i]);
		} else {
			i = this.currentVersionIndex;
			if(position == "down") {
				i = Math.min(versions.length - 1, i + 1);
			} else
			if(position == "up") {
				i = Math.max(0, i - 1);
			}

			this.currentVersionIndex = i;
		}

		this.currentVersionIndex = Math.min(this.apps[this._selectedApp()].length - 1, this.currentVersionIndex);
		self._setCA();


	},
	"_getApp": function() {
		return this._app + " " + this.apps[this._app][this.currentVersionIndex];
	},
	"_setCA": function() {
		var app = this._getApp();
		$(".current-app").text(app.substr(0,1).toUpperCase() + app.substr(1));
	},
	"hide": function() {
		this._hidden = true;
		$(this.el).transit({ opacity: 0 }, 200, function() {
			$(self.el).css({ visibility: "hidden" });
		});
	},
	"templateData": function() {
		return {
			apps: _.keys(this.apps)
		};
	},
	"_selectItem": function($item) {
		if(this._selected) this._selected.find(".app-switcher-selected").css({ visibility: "hidden" });
		$item.find(".app-switcher-selected").css({ visibility: "visible" });
		this._selected = $item;
	},
	"_findSelected": function(app) {
		var selected = app ? this._app = app : this._app;
		console.log(selected)
		this._selectItem($(this.el).find("[data-app=\""+selected+"\"]"));
	},
	"_selectedApp": function() {
		return this._selected.attr("data-app");
	},
	"_setSelectedItem": function() {
		this.options.router.redirect("/live", { app: this._getApp() });
	}
});