var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
logger = require("winston").loggers.get("clientWindows"),
sprintf = require("sprintf").sprintf,
sift = require("sift"),
disposable = require("disposable");

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
		return this._clientWindow.popup(window);
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

		if(this._clientWindow) {
			console.log("DISPOSING WINDOW");
			this._clientWindow.dispose();
		}

		logger.info("add client window");
		var wb = this._clientWindow = new WindowBridge(this, window),
		self = this;

		this.nativeWindows.tryBindingNativeWindow(wb);
		this.emit("window", window);

		wb.once("close", function() {
			if(wb != self._clientWindow) return;
			self._clientWindow = null;
		})


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
		var self = this;

		window.once("close", function() {
			self._nativeWindow = null;
			if(self._disposed) return;
			console.log("native window close, closing client");
			self.close();
		}),

		window.on("focus", function() {
			if(self._disposed) return;
			self._clientWindow.focus();
		});

		window.on("unfocus", function() {
			if(self._disposed) return;
			self._clientWindow.unfocus();
		});

		window.app.once("close", function() {
			if(self._disposed) return;
			if(self._clientWindow.forceClosed) self._clientWindow.forceClosed();
			self.close();
		});

		this._clientWindow.setNativeWindow(window);

		return true;
	},
	"setClipboard": function(data) {
		this._clientWindow.setClipboard(data);
	},
	"popup": function(winProps) {

		console.log("trying to popup");
		console.log(winProps.app.name, this._clientWindow.app, winProps.app.version, this._clientWindow.version);

		console.log(this._clientWindow);

		if(winProps.app.name != this._clientWindow.app || winProps.app.version != this._clientWindow.version) return false;

		//TODO - check if the app matches
		// if(!this.testNativeWindow(winProps, { app: this.}))
		this._clientWindow.popupWindow(winProps);
		return true;
	},
	"close": function() {
		if(this._nativeWindow) this._nativeWindow.close();
		if(this._clientWindow.close) this._clientWindow.close();
		this.emit("close");
		this.dispose();
	},
	"dispose": function() {
		this._events = {};
		this._disposed = true;
	}
})