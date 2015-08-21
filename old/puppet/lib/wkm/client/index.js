var structr = require("structr"),
Connection  = require("./connection"),
Windows     = require("./windows");

module.exports = structr({

	/**
	 */

	"publicKeys": ["windows"],

	/**
	 */

	"__construct": function(options, apps) {

		this._con = new Connection();
		this._con.open();
		this.windows = new Windows(this._con, apps, options);
	},

	/**
	 */

	"reopen": function() {
		this._con.reopen();
	}
});