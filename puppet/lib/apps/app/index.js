var structr = require("structr"),
_ = require("underscore"),
Process = require("./process");

module.exports = structr({

	/**
	 */

	"__construct": function(info) {
		_.extend(this, info);
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
	}
});