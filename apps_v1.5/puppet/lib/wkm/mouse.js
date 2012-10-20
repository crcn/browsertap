var structr = require("structr");

module.exports = structr({

	/**
	 */

	"__construct": function(client) {
		this._client = client;
	},

	/**
	 */

	"sendEvent": function() {
		this._client.mouseEvent.apply(this._client, arguments);
	}
})