var structr = require("structr"),
Screenshot  = require("./screenshot");

module.exports = structr({

	/**
	 */

	"__construct": function(puppet, client) {
		this._client = client;
		this.screenshot = new Screenshot(puppet);
	},

	/**
	 */

	"resize": function() {
		this._client.resizeDesktop.apply(this._client, arguments);
	},

	/**
	 */

	"padding": function() {
		this._client.padding.apply(this._client, arguments);
	},

	/**
	 */

	"restart": function(options) {
		this._client.restart(options);
	}

	/**
	 */

	"broadcast": function(rtmpServer) {
		var self = this;
		this._client.start(rtmpServer);
		return {
			kill: function() {
				self._client.kill();
			}
		};
	}
})