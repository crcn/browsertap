var step = require("step"),
outcome = require("outcome"),
_ = require("underscore"),
logger = require("winston").loggers.get("server.mixin"),
sprintf = require("sprintf").sprintf;

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
			 * 
			 */

			on.success(function(server) {
				if(server) {
					logger.info(sprintf("server exists, trying to use it"));
					server.use(this);
				} else {
					this()
				}
			}),


			/**
			 */

			function(err, server) {
				if(err && server) {
					logger.info(sprintf("error connecting server, restarting"));
					server.restart();
					this(null, server);
				} else 
				if(!server) {
					logger.info(sprintf("no available servers exist, creating one"));
					var next = this;
					maestro.getServer(query).exec(outcome.error(callback).success(function(server) {
						if(!server) return callback(new Error("unable to fetch servers"));
						server.clone(next);
					}))
				} else {
					logger.info(sprintf("successfully pinged server, returning"));
					this(null, server)
				}
			},

			/**
			 */

			function(err, server) {
				if(err) console.log(err.stack);
				if(server) {
					logger.info(sprintf("account %s using server id=%s, ns=%s", account._id, server._id, server.ns));
					server.tags = _.extend({}, server.tags, { owner: account._id });
					return server.save(this);
				}
				this(err, server)
			},

			/**
			 */

			callback
		);
	};
}