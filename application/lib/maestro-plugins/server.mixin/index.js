var step = require("step"),
outcome = require("outcome"),
_ = require("underscore");

exports.require = ["maestro"];
exports.plugin = function(maestro) {
	var Server = maestro._ServerModel;

	Server.getUnusedInstance = function(query, user, callback) {

		var on = outcome.error(callback);
		step(

			/**
			 * first try and find a server
			 */

			function() {
				maestro.getServer(_.extend({ busy: false }, query)).exec(this);
			},

			/**
			 * 
			 */

			on.success(function(server) {
				if(server) {
					server.use(this);
				} else {
					this()
				}
			}),

			/**
			 */

			function(err, server) {
				if(err && server) {
					server.clone(this);
					server.destroy();
				} else {
					var next = this;
					maestro.getServer(query).exec(outcome.error(callback).success(function(server) {
						if(!server) return callback(new Error("unable to fetch servers"));
						server.clone(next);
					}))
				}
			},

			/**
			 */

			callback
		);
	};
}