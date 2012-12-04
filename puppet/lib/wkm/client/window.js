var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
wkme = require("./events"),
_ = require("underscore"),
windowStyles = require("./windowStyles"),
exec = require("child_process").exec,
sprintf = require("sprintf").sprintf;

var cashew = require('cashew'),
videoStreamIdGenerator = cashew.generator('videoStream', true);

module.exports = structr(EventEmitter, {

	/**
	 */

	"publicKeys": ["close", 
	"move", 
	"resize", 
	"startRecording", 
	"stopRecording", 
	"style", 
	"extStyle",
	"id", 
	"className", 
	"title", 
	"process",
	"width",
	"height",
	"parent",
	"mouseEvent",
	"keybdEvent",
	"changeRecordingQuality",
	"bindProxy",
	"refreshProxy",
	"getProxy",
	"setClipboard",
	"openNewWindow",
	"app",
	"focus"
	],

	/**
	 */

	"__construct": function(window, windows) {

		this.id        = window.id;
		this.parent    = window.parent;
		this.className = window.className;
		this.title     = window.title;
		this.process   = window.process;
		// this.style     = window.style;
		// this.extStyle  = window.extStyle;
		this.width     = window.width;
		this.height    = window.height;
		this.vks       = _.values(wkme.keyboard_vk);
		this._apps     = windows._apps;
		this.closed = false;


		this.style     = {
			maximized: !!(window.style & windowStyles.WS_MAXIMIZE),
			sizeBox: !!(window.style & windowStyles.WS_SIZEBOX)
		};

		console.log(this.style)


		this._windows = windows;
		this._con = windows._con;
		this._rtmp = windows._options.rtmp;
		this.clean();

	},

	/**
	 */

	"close": function() {
		this.clean();
		this.closed = true;
		this._con.execute("closeWindow", { id: this.id });
		this._events = {};
	},

	/**
	 */

	"move": function(x, y) {
		this._con.execute("resizeWindow", { id: this.id, x: x, y: y });
	},

	/**
	 */

	"resize": function(x, y, width, height) {
		if(arguments.length > 2) this.width = Math.min(Math.max(width || this.width, 100), 4000);
		if(arguments.length > 3) this.height = Math.min(Math.max(height || this.height, 100), 4000);
		this._con.execute("resizeWindow", { id: this.id, x: x, y: y, w: this.width, h: this.height });
	},

	/**
	 */

	"mouseEvent": function(dwFlags, coords, dwData) {
		this._focus();
		this._con.execute("fireWindowMouseEvent", { id: this.id, x: coords.x, y: coords.y, dwFlags: dwFlags, dwData: dwData || 0 });
	},

	/**
	 */

	"openNewWindow": function(arg) {

		if(this.app && this.app.window.openNew) {
			// console.log(this.app.path, sprintf(this.app.window.openNew, arg));
			return exec("\"" + this.app.path + "\" " + sprintf(this.app.window.openNew, arg), function(err) {
				if(err) console.error(err)
			});
		}

		this.focus();
		this.keybdEvent({ keyCode: "n".charCodeAt(0), ctrlKey: true });
	},

	/**
	 */

	"focus": function() {
		this._con.execute("focusWindow", { id: this.id });
	},

	/**
	 */

	"_focus": function() {
		this.emit("setFocus");
	},

	/**
	 */

	"setProxy": function(proxy) {
		console.log("SPROX %s", this.id);
		this.emit("proxy", this._proxy = proxy);
	},

	/**
	 */

	"refreshProxy": function(callback) {
		this._proxy = null;
		this.getProxy(callback);
	},

	/**
	 */

	"getProxy": function(callback) {
		if(this._proxy) return callback(this._proxy);
		this.once("proxy", callback);
	},

	/**
	 */

	"bindProxy": function(callback) {
		console.log("bind proxy")
		if(this._proxy) callback(this._proxy);
		this.on("proxy", callback);
	},

	/**
	 */

	"setClipboard": function(text) {
		this._con.execute("setClipboard", text);
	},

	/**
	 */

	"keybdEvent": function(options) {


		if(!options.keyCode) return;

		var self = this;

		function keyDown(code) {
			self._con.execute("fireWindowKeybdEvent", { id: 1, bvk: code, bScan: 0, dwFlags: wkme.keyboard.KEYEVENTF_EXTENDEDKEY | 0 });
		}

		function keyUp(code) {
			self._con.execute("fireWindowKeybdEvent", { id: 1, bvk: code, bScan: 0, dwFlags: wkme.keyboard.KEYEVENTF_EXTENDEDKEY | wkme.keyboard.KEYEVENTF_KEYUP });
		}

		if(options.shiftKey) keyDown(16);
		if(options.ctrlKey) keyDown(17);
		if(options.altKey) keyDown(18);

		keyDown(options.keyCode);
		keyUp(options.keyCode);

		if(options.altKey) keyUp(18);
		if(options.ctrlKey) keyUp(17);
		if(options.shiftKey) keyUp(16);
	},

	/**
	 */

	"clean": function() {
		/*console.log("clean window")
		var vks = this.vks, self = this;

		//release any modifiers that might have been stuck down.
		vks.forEach(function(vk) {
			self.keybdEvent(vk, 0, wkme.keyboard.KEYEVENTF_KEYUP);
		});*/
	},

	/**
	 */

	"exists": function(callback) {
		callback(null, !this.disposed);
	},

	/**
	 */

	"startRecording": function(options, callback) {
		if(typeof options == "function") {
			callback = options;
			options = {};
		}

		if(this._output) return callback(null, this._output);
		var streamId = videoStreamIdGenerator.uid().toUpperCase();

		var rtmpHost = this._rtmp.hostname,
		localhost    = "localhost";

		//debugging
	    rtmpHost = localhost = "10.0.1.30";

		var output =  "rtmp://" + rtmpHost + ":1935/live/" + streamId;

		console.log("recording window to %s", output);

		this._con.execute("startRecordingWindow", _.extend(options, { id: this.id, output: "rtmp://"+localhost+":1935/live/" + streamId }));

		callback(null, this._output = {
			url: output
		});
	},

	/**
	 */

	"changeRecordingQuality": function(options, callback) {
		this._con.execute("changeWindowRecordingQuality", _.extend(options, { id: this.id }));
	},

	/**
	 */

	"stopRecording": function(callback) {
		this._output = null;
		this._con.execute("stopRecordingWindow", { id: this.id });
	}
});