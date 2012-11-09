var structr = require("structr"),
EventEmitter = require("events").EventEmitter;

var cashew = require('cashew'),
videoStreamIdGenerator = cashew.generator('videoStream', true);

module.exports = structr(EventEmitter, {

	/**
	 */

	"publicKeys": ["close", "move", "resize", "startRecording", "stopRecording"],

	/**
	 */

	"__construct": function(window, windows) {

		this.id        = window.id;
		this.className = window.className;
		this.title     = window.title;
		this.process   = window.process;
		this.style     = window.style;

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
		this._con.execute("resizeWindow", { id: this.id, x: x, y: y, w: width, h: height });
	},

	/**
	 */

	"startRecording": function(callback) {

		var output = "rtmp://" + this._rtmp.host + this._rtmp.pathname + "/" + videoStreamIdGenerator.uid().toUpperCase();

		console.log("recording window to %s", output);

		this._con.execute("startRecordingWindow", { id: this.id, output: output });

		callback(null, {
			url: output
		});
	},

	/**
	 */

	"stopRecording": function(callback) {
		this._con.execute("stopRecordingWindow", { id: this.id });
	}
});