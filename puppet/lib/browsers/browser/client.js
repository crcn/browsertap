var structr = require("structr");

module.exports = structr({

	/**
	 */

	"target": function(value) {
		if(arguments.length == 1) {
			console.log("set client to wrapper");
			this._target = value;
		}
		return this._target;
	},

	/**
	 */

	"getScrollBounds": function() {
		this._call("getScrollBounds", arguments);
	},

	/**
	 */

	"scrollTo": function() {
		this._call("scrollTo", arguments);
	},

	/**
	 */

	"_call": function(name, args) {
		console.log("client wrapper %s", name);
		var cb = args[args.length - 1];
		if(!this._target) {
			if(typeof cb === "function") cb(new Error("client isn't connected"));
			return;
		}
		this._target[name].apply(name, args);
	}
});