var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
logger = require("winston").loggers.get("clientWindows"),
sprintf = require("sprintf").sprintf,
sift = require("sift");

module.exports = structr(EventEmitter, {

	/**
	 */

	"publicKeys": ["add"],

	/**
	 */

	"__construct": function(client, con) {
		var self = this;
		this.nativeWindows = client.controller.nativeWindows;
		this._clientWindows = [];
		con.on("end", function() {
			logger.info("client window closed, removing native");
			console.log(self._clientWindows.length)
			self._closeAllNativeWindows();
		});
	},

	/**
	 */

	"popupWindow": function(window) {
		console.log("popup window %s", window)
		if(!this._clientWindows.length) return false;
		this._clientWindows[0].popup(window);
		return true;
	},

	/**
	 */

	"setClipboard": function(data) {
		if(!this._clientWindows.length) return false;
		this._clientWindows[0].setClipboard(data);
		return true;
	},

	/**
	 */

	"bindNativeWindow": function(window) {
		for(var i = this._clientWindows.length; i--;) {
			var wb = this._clientWindows[i];
			if(wb.bindNativeWindow(window)) return true;
		}
		return false;
	},

	/**
	 */

	"add": function(window) {
		logger.info("add client window");
		var wb = new WindowBridge(this, window);
		this._clientWindows.push(wb);
		this.nativeWindows.tryBindingNativeWindow(wb);
		this.emit("window", window);
	},

	/**
	 */

	"_closeAllNativeWindows": function() {
		for(var i = this._clientWindows.length; i--;) {
			this._clientWindows[i].close();
		}
	}
});



var WindowBridge = structr(EventEmitter, {
	"__construct": function(clientWindows, clientWindow) {
		this._clientWindow = clientWindows;
		this._clientWindow = clientWindow;
	},
	"testNativeWindow": function(window) {
		console.log("test native window");
		return !this._nativeWindow && !!window.app && (!this._clientWindow.search || sift(this._clientWindow.search).test(window));
	},
	"bindNativeWindow": function(window) {

		logger.info(sprintf("trying to bind window %s", window.id));

		if(!this.testNativeWindow(window)) return false;


		logger.info(sprintf("bound window %s", window.id));
		this._nativeWindow = window;
		var self = this;
		window.once("close", function() {
			self._nativeWindow = null;
			console.log("native window close, closing client");
			if(self._clientWindow.close) self._clientWindow.close();
		});

		this._clientWindow.setNativeWindow(window);

		return true;
	},
	"setClipboard": function(data) {
		this._clientWindow.setClipboard(data);
	},
	"popup": function(winProps) {
		this._clientWindow.popupWindow(winProps);
	},
	"close": function() {
		console.log("closing client window");
		if(this._nativeWindow) this._nativeWindow.close();
	}
})