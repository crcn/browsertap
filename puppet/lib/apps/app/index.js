var structr = require("structr"),
_ = require("underscore"),
Process = require("./process"),
_ = require("underscore"),
EventEmitter = require("events").EventEmitter;

module.exports = structr(EventEmitter, {

	/**
	 */

	"publicKeys": ["getWindows"],

	/**
	 */

	"__construct": function(info) {
		_.extend(this, info);
		this._windows = [];
	},

	/**
	 */

	"addWindow": function(win) {
		var self = this;
		this._windows.push(win);
		win.once("close", function() {
			var i = self._windows.indexOf(win);
			if(~i) self._windows.splice(i, 1);
			self.emit("closeWindow", win);
		});

		this.emit("openWindow", win);
	},

	/**
	 */

	"getWindows": function(callback) {
		callback(null, this._windows);
	},


	/**
	 */

	"step open": function(args, callback) {
		this._proc().open(args, callback);
		this.running = true;
	},

	/**
	 */

	"step close": function(force, callback) {
		if(typeof force == "function") {
			callback = force;
			force = true;
		}
		if(!this._process && force !== true) return callback();
		this._proc().close(callback);
		this.running = false;
	},

	/**
	 */

	"_proc": function() {
		return this._process || (this._process = new Process(this));
	},

	/**
	 */

	"_onWindowClose": function(win) {

	}
});