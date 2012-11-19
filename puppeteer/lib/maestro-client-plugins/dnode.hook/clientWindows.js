var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
logger = require("winston").loggers.get("clientWindows"),
sprintf = require("sprintf").sprintf;

module.exports = structr(EventEmitter, {

	/**
	 */

	"publicKeys": ["addClientWindow"],

	/**
	 */

	"__construct": function(nativeWindows, con) {
		var self = this;
		this.nativeWindows = nativeWindows;
		this._clientWindows = [];
		con.on("end", function() {
			logger.info("client window closed, removing native");
			console.log(self._clientWindows.length)
			self._closeAllNativeWindows();
			self.emit("close");
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

	"bindNativeWindow": function(window) {
		for(var i = this._clientWindows.length; i--;) {
			var wb = this._clientWindows[i];
			if(wb.bindNativeWindow(window)) return true;
		}
		return false;
	},

	/**
	 */

	"addClientWindow": function(window) {
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
		return !this._nativeWindow;
	},
	"bindNativeWindow": function(window) {

		logger.info(sprintf("trying to bind window %s", window.id));

		if(!this.testNativeWindow(window)) return false;


		logger.info(sprintf("bound window %s", window.id));
		this._nativeWindow = window;
		var self = this;
		window.once("close", function() {
			self._nativeWindow = null;
			console.log("native window close");
			self._clientWindow.close();
		});

		console.log(this._clientWindow.setNativeWindow)

		this._clientWindow.setNativeWindow(window);

		return true;
	},
	"popup": function(winProps) {
		this._clientWindow.popupWindow(winProps);
	},
	"close": function() {
		console.log("closing client window");
		console.log(this._nativeWindow)
		if(this._nativeWindow) this._nativeWindow.close();
	}
})