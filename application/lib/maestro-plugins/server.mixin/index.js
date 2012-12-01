var step = require("step"),
outcome = require("outcome"),
_ = require("underscore"),
logger = require("winston").loggers.get("server.mixin"),
sprintf = require("sprintf").sprintf,
seq = require("seq"),
dref = require("dref");

exports.require = ["maestro"];
exports.plugin = function(maestro) {
	
	maestro.getUnusedInstance = function(query, account, callback) {

		var on = outcome.error(callback);
		step(

			/**
			 * first try and find a server
			 */

			function() {

				logger.info("fetching servers");


				//find the server the account is currently using, or spin up a new one
				maestro.getServer(_.extend({$or: [{ "owner": String(account._id) }, { "owner": null }]}, query)).exec(this);
			},

			/**
			 * check if the server exists. If it doesn't then create it. We don't want that though....
			 */

			on.success(function(server) {
				var next = this;

				//note that if we have to resort to this, it's NOT a good thing. Creating instances on the fly takes quite a while.
				//We want people using instances immediately.
				if(!server) {
					logger.info(sprintf("creating a new server"));
					maestro.getServer(query).exec(outcome.error(callback).success(function(server) {
						if(!server) return callback(new Error("unable to fetch servers"));
						server.clone(outcome.error(next).success(function(clone) {
							clone.use(next);
						}));
					}));
				} else {
					next(null, server);
				}
			}),

			/**
			 * reserve it for the user
			 */

			on.success(function(server) {

				if(!server) return callback(new Error("unable to connect"));

				
				logger.info(sprintf("account %s using server id=%s, ns=%s", account._id, server._id, server.ns));
				server.set("owner", String(account._id));

				var next = this;
				server.ping(function() {
					next(null, server);
				});
			}),

			/**
			 * start using it
			 */

			/*on.success(function(server) {

				var foundServer, next = this;

				server.use(function(err) {
					if(err) {
						logger.warn(sprintf("Unable to use: %s", err.message));
						server.tags = {};
						server.save(function() {
							self.getUnusedInstance(query, account, callback);
						});
					} else {
						next(null, server)
					}
				});

				
			}),*/

			/**
			 */

			callback
		);
	};
}