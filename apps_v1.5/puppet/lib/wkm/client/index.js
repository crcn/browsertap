var structr = require("structr"),
Connection  = require("./connection"),
Windows     = require("./windows");

module.exports = structr({

	/**
	 */

	"__construct": function(options) {

		this._con = new Connection();
		this._con.open();
		this.windows = new Windows(this._con, options);
	}
});