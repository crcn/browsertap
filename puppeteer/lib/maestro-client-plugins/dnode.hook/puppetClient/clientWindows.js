var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
logger = require("winston").loggers.get("clientWindows"),
sprintf = require("sprintf").sprintf,
sift = require("sift");

module.exports = structr(EventEmitter, {

	/**
	 */

	"publicKeys": ["set"],

	/**
	 */

	"__construct": function(client, con) {
		var self = this;
		this.nativeWindows = client.controller.nativeWindows;
		this.client = client;

		con.on("end", function() {
			logger.info("client window closed, removing native");
			self._closeAllNativeWindows();
		});
	},

	/**
	 */

	"popupWindow": function(window) {
		console.log("popup window %s", window)
		if(!this._clientWindow) return false;
		this._clientWindow.popup(window);
		return true;
	},

	/**
	 */

	"setClipboard": function(data) {
		if(!this._clientWindow) return false;
		this._clientWindow.setClipboard(data);
		return true;
	},

	/**
	 */

	"bindNativeWindow": function(window) {
		if(!this._clientWindow) return;
		return this._clientWindow.bindNativeWindow(window);
	},

	/**
	 */

	"set": function(window) {


		//remove any private properties
		if(window.search)
		for(var s in window.search) {
			if(s.substr(0, 1) == "_") delete window.search[s];
		}

		logger.info("add client window");
		var wb = this._clientWindow = new WindowBridge(this, window);

		this.nativeWindows.tryBindingNativeWindow(wb);
		this.emit("window", window);

		console.log(window.search)

		if(window.search && window.search.id) {
			if(!wb._nativeWindow) {
				wb.close();
			}
			/*this.client.wkm.windows.hasWindow(window.search.screen, function(yes) {
				if(!yes) wb.close();
			});*/
		}
	},

	/**
	 */

	"_closeAllNativeWindows": function() {
		if(this._clientWindow) this._clientWindow.close();
	}
});



var WindowBridge = structr(EventEmitter, {
	"__construct": function(clientWindows, clientWindow) {
		this._clientWindows = clientWindows;
		this._clientWindow = clientWindow;
		var self = this;
	},
	"testNativeWindow": function(window) {
		console.log("test native window");
		return !this._nativeWindow && (!this._clientWindow.search || sift(this._clientWindow.search).test(window));
	},
	"bindNativeWindow": function(window) {

		logger.info(sprintf("trying to bind window %s", window.id));

		if(!this.testNativeWindow(window)) return false;


		logger.info(sprintf("bound window %s", window.id));
		this._nativeWindow = window;
		var self = this, appEm;
		window.once("close", function() {
			self._nativeWindow = null;
			console.log("native window close, closing client");
			if(self._clientWindow.close) self._clientWindow.close();
			if(appEm) appEm.dispose();
			self._clientWindows._clientWindow = null;// fuck me what am I doing >.>
		});

		appEm = window.app.once("close", function() {
			if(self._clientWindow.forceClosed) self._clientWindow.forceClosed();
			self._clientWindows._clientWindow = null;// fuck me what am I doing >.>. What the fuck - did you just copy and paste??
		})

		this._clientWindow.setNativeWindow(window);

		return true;
	},
	"setClipboard": function(data) {
		this._clientWindow.setClipboard(data);
	},
	"popup": function(winProps) {

		//TODO - check if the app matches
		// if(!this.testNativeWindow(winProps, { app: this.}))
		this._clientWindow.popupWindow(winProps);
	},
	"close": function() {
		console.log("closing client window");
		if(this._nativeWindow) this._nativeWindow.close();
		if(this._clientWindow.close) this._clientWindow.close();
	}
})