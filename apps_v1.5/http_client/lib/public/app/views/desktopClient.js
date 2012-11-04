var service = require("../business/desktopService"),
_ = require("underscore"),
wkmEvents = require("./events"),
Url = require("url"),
EventEmitter = require("events").EventEmitter;

var DesktopPlayer = require("./flashPlayer").extend({
	"source": "/swf/DesktopPlayer.swf",
	"elementId": "desktop-player",
	"init": function() {
		this._super();
		this.set("params", Ember.Object.create({
			host: "http://localhost",
			debug: true
		}));
		this.get("params").addObserver("host", this, "_onRtmpUrlChange");
	},
	"_onRtmpUrlChange": function() {
		this.render();
	}
});

module.exports  = Ember.ContainerView.extend({

	/**
	 */

	"templateName": "desktop-client",

	"classNames": ["desktop-client"],

	/**
	 */

	"init": function() {
		this._super();
		this._query = Url.parse(String(window.location), true).query;
		this._createChildViews();
		// this._connect();
		this._createListeners();
		this._video = {};
	},

	/**
	 */

	"_createChildViews": function() {
		this.get("childViews").pushObject(this._player = DesktopPlayer.create());
	},

	/**
	 */

	"_browser": function() {
		return this._query.browser || "chrome 19";
	},

	/**
	 */

	"_browserParts": function() {
		var parts = this._browser().split(" ");
		return { version: parts.pop(), name: parts.join(" ") };
	},

	/**
	 */

	"connect": function() {
		var self = this;
		self._loading = true;
		this.get("notifications").updateBrowserInfo(this._browserParts());
		this.get("notifications").showNotification();
		this._service = service.connect(this.get("service"), function(err, puppet) {
			if(err) return alert(err.message);
			self._onPuppet(puppet);
		});
	},

	/**
	 */

	"_onPuppet": function(puppet) {
		this._puppet = puppet;
		this._player.set("params.host", puppet.rtmp.host);
		this._onResize();
		var self = this;
		puppet.browsers.open(this._query.url || "http://google.com", this._browser(), function(err, browser) {

			self._client = null;
			browser.getClient(function() {
				self._onClient.apply(self, arguments);
			});

			console.log("browser open");
			self._loading = false;
			self.get("notifications").hideNotification();
			self._onResize();
		});
	},

	/**
	 */

	"_onClient": function(err, client) {
		this._client = client;
		console.log("browser proxy connected");
	},

	/**
	 */

	"_createListeners": function() {
		var self = this,
		win = jQuery(window);

		window.__browsertap = new EventEmitter();

		win.mousedown(function(e) {
			// if(!$(e.target).closest('#desktop-player').length) return;
			self._mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTDOWN : wkmEvents.mouse.MOUSEEVENTF_RIGHTDOWN);
			if(e.button === 0) return; //only block right click
			e.preventDefault();
			e.stopPropagation();
		});

		win.mouseup(function(e) {
			self._mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTUP : wkmEvents.mouse.MOUSEEVENTF_RIGHTUP);
		});

		window.desktopEvents = {
			mouseMove: _.throttle(function(coords) {
				self._mouseEvent(wkmEvents.mouse.MOUSEEVENTF_ABSOLUTE | wkmEvents.mouse.MOUSEEVENTF_MOVE, coords);
			}, 10),
			keyDown: function(data) {
				self._keyboardEvent(data.keyCode, 0, 0);
			},
			keyUp: function(data) {
				self._keyboardEvent(data.keyCode, 0, wkmEvents.keyboard.KEYEVENTF_KEYUP);
			},
			/*mouseWheel: _.throttle(function(coords) {
				self._mouseEvent(wkmEvents.mouse.MOUSEEVENTF_WHEEL, coords, coords.delta);
			}, 1),*/
			resize: _.debounce(function(data) {
				self._onResize(data.width, data.height);
			}, 250)
		}

		setInterval(function() {
			if(self._client)
			self._client.getScrollBounds(function(err, bounds) {
				$("#v-scrollbar").height(bounds.height || 0);
				console.log(bounds.height);
			});
		}, 2000);

		win.scroll(_.throttle(function() {
			if(!self._client) return;
			self._client.scrollTo(0, win.scrollTop());
		}, 50));

		window.__browsertap.on("refresh", function() {
			// alert("REFRESH");
		})
	},

	/**
	 */

	"_onResize": function(width, height) {
		this._width = width || this._width || jQuery(window).width();
		this._height = height || this._height || jQuery(window).height();
		if(!this._puppet) return;
		this._reset();

	},

	"didInsertElement": function() {
		this._super();
		this.connect();
	},

	/**
	 */

	"_mouseEvent": function(code, coords, data) {

		if(coords) {
			this._prevCoords = coords;
		} else {
			coords = this._prevCoords;
		}

		if(!this._puppet || this._loading) return;

		this._puppet.mouse.sendEvent(code, coords.x, coords.y, data);
	},

	"_keyboardEvent": function(key, mods, dwFlags) {
		if(!this._puppet || this._loading) return;
		this._puppet.keyboard.sendEvent(key, mods, dwFlags);
	},

	"_reset": function() {
		if(this._loading) return;
		this._puppet.desktop.restart(_.extend(this._query, {
			width: this._width,
			height: this._height,
		}));
	}

});


/*var PuppetController = Ember.Object.extend({
	"init": function() {
		this._super();


	},
})*/