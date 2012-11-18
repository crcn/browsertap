var step = require("step"),
outcome = require("outcome"),
_ = require("underscore"),
logger = require("winston").loggers.get("server.mixin"),
sprintf = require("sprintf").sprintf,
seq = require("seq"),
dref = require("dref");

exports.require = ["maestro"];
exports.plugin = function(maestro) {
	var Server = maestro._ServerModel;


	Server.getUnusedInstance = function(query, account, callback) {

		var on = outcome.error(callback);
		step(

			/**
			 * first try and find a server
			 */

			function() {

				logger.info("fetching servers");
				//find the server the account is currently using, or spin up a new one
				maestro.getServer(_.extend({$or: [{ "tags.owner": account._id }, { "tags.owner": null }]}, query)).exec(this);
			},

			/**
			 * check if the server exists. If it doesn't then create it. We don't want that though....
			 */

			on.success(function(server) {
				var next = this;
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

				if(server) {
					logger.info(sprintf("account %s using server id=%s, ns=%s", account._id, server._id, server.ns));
					server.tags = _.extend({}, server.tags, { owner: account._id });
					return server.save(this);
				}
				
				return callback(new Error("unable to connect"));
			}),

			/**
			 * start using it
			 */

			on.success(function(server) {

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

				
			}),

			/**
			 */

			callback
		);
	};
}