var structr = require("structr"),
EventEmitter = require("events").EventEmitter;

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
	"id", 
	"className", 
	"title", 
	"process",
	"width",
	"height",
	"parent",
	"mouseEvent",
	"keybdEvent"
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
		this.width     = window.width;
		this.height    = window.height;

		this._windows = windows;
		this._con = windows._con;
		this._rtmp = windows._options.rtmp;

		//TODO - mouse
	},

	/**
	 */

	"close": function() {
		this._con.execute("closeWindow", { id: this.id});
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

	"keybdEvent": function(bvk, bScan, dwFlags) {
		this._con.execute("fireWindowKeybdEvent", { id: this.id, bvk: bvk, bScan: bScan, dwFlags: dwFlags });
	},

	/**
	 */

	"exists": function(callback) {
		callback(null, !this.disposed);
	},

	/**
	 */

	"startRecording": function(callback) {
		if(this._output) return callback(null, this._output);
		var output =  "rtmp://" + this._rtmp.host + this._rtmp.pathname + "/" + videoStreamIdGenerator.uid().toUpperCase();

		console.log("recording window to %s", output);

		this._con.execute("startRecordingWindow", { id: this.id, output: output });

		callback(null, this._output = {
			url: output
		});
	},

	/**
	 */

	"stopRecording": function(callback) {
		this._output = null;
		this._con.execute("stopRecordingWindow", { id: this.id });
	}
});