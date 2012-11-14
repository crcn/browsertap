var structr = require("structr"),
_ = require("underscore"),
sift = require("sift"),
EventEmitter = require("events").EventEmitter,
Window = require("./window");

module.exports = structr(EventEmitter, {

	/**
	 */
	 
	"publicKeys": ["getWindows", "getWindow", "hasWindow"],

	/**
	 */

	"__construct": function(con, options) {
		this._options = options;
		this._con = con;
		this._syncScreens();
		this._windows = [];
		this._con.on("openWindow", this.getMethod("_onOpenWindow"));
		this._con.on("closeWindow", this.getMethod("_onCloseWindow"));

		this._blackListSifter = sift({
			$or: [
				{
					className: {
						$in: [
							"Button", 
							"ConsoleWindowClass",
							"Progman",
							"Desktop User Picture",
							"DV2ControlHost",
							"CabinetWClass"
						]
					}
				},
				{
					process: null
				}
			]
		})
	},

	/**
	 */

	"getWindow": function(id, callback) {
		var window = sift({ id: id }, this._windows).pop();
		if(window) return callback(null, window);
		callback(new Error("window doesn't exist"));
	},

	/**
	 */

	"hasWindow": function(id, callback) {
		return callback(null, !!sift({ id: id }, this._windows).pop());
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
		win.disposed = true;
		console.log("close window class=%s, title=%s ", win.className, win.title);
		this._windows.splice(this._windows.indexOf(win), 1);
		win.emit("close");
		this.emit("close", win);
	},

	/**
	 */

	"_addWindow": function(window) {

		if(this._blackListSifter.test(window)) {
			console.log("black listed class=%s, title=%s", window.className, window.title);
			return;
		}


		var win = new Window(window, this);
		this._windows.push(win);
		this.emit("open", win);
		console.log("open window class=%s, title=%s ", win.className, win.title);
		return win;
	}
})