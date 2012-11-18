var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
wkme = require("./events"),
_ = require("underscore");

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
	"bindProxy"
	],

	/**
	 */

	"__construct": function(window, windows) {

		this.id        = window.id;
		this.parent    = window.parent;
		this.className = window.className;
		this.title     = window.title;
		this.process   = window.process;
		this.style     = window.style;
		this.extStyle     = window.extStyle;
		this.width     = window.width;
		this.height    = window.height;
		this.vks       = _.values(wkme.keyboard_vk);

		this._windows = windows;
		this._con = windows._con;
		this._rtmp = windows._options.rtmp;
		this.clean();

		//TODO - mouse
	},

	/**
	 */

	"close": function() {
		this.clean();
		this._con.execute("closeWindow", { id: this.id });
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
		this._con.execute("fireWindowMouseEvent", { id: this.id, x: coords.x, y: coords.y, dwFlags: dwFlags, dwData: dwData || 0 });
	},


	/**
	 */

	"setProxy": function(proxy) {
		this.emit("proxy", this._proxy = proxy);
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
		if(this._proxy) callback(this._proxy);
		this.on("proxy", callback);
	},

	/**
	 */

	"keybdEvent": function(options) {

		console.log(options)

		if(!options.keyCode) return;

		var self = this;

		function keyDown(code) {
			console.log("DOWN %d", code);
			self._con.execute("fireWindowKeybdEvent", { id: 1, bvk: code, bScan: 0, dwFlags: wkme.keyboard.KEYEVENTF_EXTENDEDKEY | 0 });
		}

		function keyUp(code) {
			console.log("UP %d", code);
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
		var output =  "rtmp://" + this._rtmp.hostname + ":1935/live/" + streamId;

		console.log("recording window to %s", output);

		this._con.execute("startRecordingWindow", _.extend(options, { id: this.id, output: "rtmp://"+this._rtmp.hostname+":1935/live/" + streamId }));

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