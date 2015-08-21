var structr = require("structr"),
_ = require("underscore"),
sift = require("sift"),
EventEmitter = require("events").EventEmitter,
Window = require("./window"),
outcome = require("outcome"),
windowStyles = require("./windowStyles");

module.exports = structr(EventEmitter, {

	/**
	 */
	 
	"publicKeys": ["getWindows", "getWindow", "hasWindow"],

	/**
	 */

	"__construct": function(con, apps, options) {
		this._options = options;
		this._apps = apps;
		this._con = con;
		this._syncScreens();
		this._windows = [];
		this._con.on("openWindow", this.getMethod("_onOpenWindow"));
		this._con.on("closeWindow", this.getMethod("_onCloseWindow"));
		this._con.on("setClipboard", this.getMethod("_onSetClipboard"));

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
					extStyle: function(style) {

						//if the window is topmost, it's most likely a popup. We want to ignore
						//these since they'll hover over the main window, as well as open a client window.
						//Kinda breaks the illusion of separate windows :/
						return style & windowStyles.WS_EX_TOPMOST;
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

	"findWindowByTitle": function(title, callback) {
		var self = this;
		this._con.execute("findWindowByTitle", title, function(err, window) {
			if(window) return callback(null, sift({ id: window.id }, self._windows).pop());
			return callback(new Error("window not found"));
		});
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

		//close emit will remove from the collection as well.
		win.emit("close");
		this.emit("close", win);
	},

	/**
	 */

	"_addWindow": function(window) {

		if(this._blackListSifter.test(window)) {
			
			//is popup? move it ON SCREEN - by default popups are moved to the center of the screen.
			if(window.extStyle & windowStyles.WS_EX_TOPMOST) new Window(window, this).move(200, 200);

			console.log("black listed class=%s, title=%s", window.className, window.title);
			return;
		}

		var win = new Window(window, this),
		self = this;

		win.on("setFocus", function() {
			
			if(self._focusedWindow) {
				if(self._focusedWindow == win) return;
				self._focusedWindow.emit("unfocus");
			}

			self._focusedWindow = win;
			self._focusedWindow.emit("focus");
		});

		win.once("close", function() {
			self._windows.splice(self._windows.indexOf(win), 1);
		});

		this._setApp(win, function(err) {
			if(err) console.error(err);
			self._windows.push(win);
			self.emit("open", win);
			console.log("open window class=%s, title=%s ", win.className, win.title);
		});

		return win;
	},

	/**
	 */

	"_setApp": function(win, callback) {
		var pn = win.process.name.split(/[\s\.]+/g).shift().toLowerCase(),
		self = this;

		console.log("trying to find app %s", pn);

		self._apps.addWindow(win, outcome.error(callback).success(function() {
			console.log("attach app %s to window %s", win.app.name, win.title);
			callback();
		}));

		/*self._apps.findApp({ name: new RegExp(pn), running: true }, outcome.error(callback).success(function(app) {
			win.app = app;
			app.addWindow(win);
			console.log("attach app %s to window %s", app.name, win.title);
			callback();
		}));*/
	},

	/**
	 */

	"_onSetClipboard": function(data) {
		console.log("set clipboard: %s", data);
		this.emit("setClipboard", data);
	}
})