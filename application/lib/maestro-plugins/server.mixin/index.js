var step = require("step"),
outcome = require("outcome"),
_ = require("underscore"),
logger = require("winston").loggers.get("server.mixin"),
sprintf = require("sprintf").sprintf,
seq = require("seq");

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
				maestro.getServers(_.extend({$or: [{ "tags.owner": account._id }, { "tags.owner": null }]}, query)).max(5).exec(this);
			},

			/**
			 * 
			 */

			on.success(function(servers) {

				var foundServer, next = this;

				logger.info(sprintf("trying to use %d servers", servers.length));

				seq(servers).seqEach(function(server) {
					if(!server.tags) server.tags = {};
					if(foundServer && (foundServer.tags.owner || !servers.tags.owner)) return this();
					var next = this;
					logger.info(sprintf("trying to use server id=%s", server._id));

					server.use(function(err) {
						if(err) {
							logger.warn(sprintf("Unable to use: %s", err.message));
						} else {
							foundServer = server;
						}
						next();
					})
				}).seq(function() {
					next(null, foundServer);
				});
			}),


			/**
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
			 */

			on.success(function(server) {
				logger.info(sprintf("account %s using server id=%s, ns=%s", account._id, server._id, server.ns));
				server.tags = _.extend({}, server.tags, { owner: account._id });
				return server.save(this);
				
				this(err, server)
			}),

			/**
			 */

			callback
		);
	};
}