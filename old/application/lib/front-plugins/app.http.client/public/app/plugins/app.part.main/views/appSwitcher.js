var _s = require("underscore.string");

module.exports = require("../../../views/base").extend({
	"templateName": "app-switcher",
	"currentVersionIndex": 0,
	"initialize": function() {
		this._hidden = true;
		var self = this,
		apps = this.options.apps;

		var abv = {};

		for(var i = apps.length; i--;) {
			var app = apps[i];

			if(!abv[app.name]) abv[app.name] = [];
			abv[app.name].push(app.version);
		}

		for(var k in abv) {
			abv[k] = abv[k].sort(function(a, b) {
				return Number(String(a).split(".").slice(0, 2).join(".")) > Number(String(b).split(".").slice(0, 2).join(".")) ? 1 : -1;
			});
		}
		this.apps = abv;

		function onApp() {
			self._app = self.options.loader.options.app;
			self.currentVersionIndex = self.apps[self._app].indexOf(String(self.options.loader.options.version));
			self._setCA();
		}
		
		this.options.loader.on("loading", onApp);
		onApp();

		$(document).keyup(function(e) {
			if(e.keyCode != 16) return; //shift
			if(self._hidden) return;
			self.hide(function() {
				self._setSelectedItem();
			});
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
		if(this.options.loader._lockLoading) return;


		this._findSelected();

		if(this._hidden) {
			this._hidden = false;
			$(this.el).css({ visibility: "visible"});
			$(this.el).css({ opacity: 0 });
			$(this.el).transit({ opacity: 0.95 }, 200);
			analytics.track("Show Browser Switcher");
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
		this._syncTitle();
		this._syncFavIcon();
	},
	"_syncTitle": function(app) {
		document.title = this.apps[this._app][this.currentVersionIndex] + " - BT";
	},

	"_syncFavIcon": function() {
		// var a = document.createElement("a");
		// a.href = this._currentLocation;
		$("[type='image/x-icon']").remove();
		var link = document.createElement("link");
		link.type = "image/x-icon";
		link.rel = "shortcut icon";
		link.href = "/img/favicons/browsers/"+this._app+".ico";
		document.getElementsByTagName("head")[0].appendChild(link);
	},
	"hide": function(cb) {
		this._hidden = true;
		var $el = this.$el;
		$(this.el).transit({ opacity: 0 }, 200, function() {
			$el.css({ visibility: "hidden" });
			$el.find(".app-switcher-selected").css({ visibility: "hidden" });
			if(cb) cb();
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
		this._selectItem($(this.el).find("[data-app=\""+selected+"\"]"));
	},
	"_selectedApp": function() {
		return this._selected.attr("data-app");
	},
	"_setSelectedItem": function() {
		this.options.router.redirect("/live", { app: this._app, version: this.apps[this._app][this.currentVersionIndex] });
	}
});