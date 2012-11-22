var structr = require("structr"),
AppsLoader = require("./appsLoader");

module.exports = structr({

	/**
	 */

	"__construct": function(directory, wkm) {
		this._appsDir = directory;
		this._wkm = wkm;
	},


	/**
	 */

	"load": function() {
		
	}


});