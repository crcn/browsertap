var structr = require("structr"),
_ = require("underscore"),
sift = require("sift"),
EventEmitter = require("events").EventEmitter,
Window = require("./window");

module.exports = structr(EventEmitter, {

	/**
	 */
	 
	"publicKeys": ["getWindows"],

	/**
	 */

	"__construct": function(con, options) {
		this._options = options;
		this._con = con;
		this._syncScreens();
		this._windows = [];
		this._con.on("openWindow", this.getMethod("_onOpenWindow"));
		this._con.on("closeWindow", this.getMethod("_onCloseWindow"));
	},

	/**
	 */

	"getWindows": function(callback) {
		callback(null, this._windows);
	},

	/**
	 */

	"_syncScreens": function() {
		var self = this;
	
		self._con.execute("listWindows", function(err, windows) {
			for(var i = windows.length; i--;) {
				self._addWindow(windows[i]);
			}
		});
	},

	/**
	 */

	"_onOpenWindow": function(window) {
		return this._addWindow(window);
	},

	/**
	 */

	"_onCloseWindow": function(window) {
		var win = sift({ id: window.id }, this._windows).pop();

		if(!win) return;
		console.log("close window class=%s, title=%s ", win.className, win.title);

		win.emit("close");
		this.emit("close", win);
	},

	/**
	 */

	"_addWindow": function(window) {
		var win = new Window(window, this);
		this._windows.push(win);
		this.emit("open", win);
		console.log("open window class=%s, title=%s ", win.className, win.title);
		return win;
	}
})