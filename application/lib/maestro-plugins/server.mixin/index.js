var step = require("step"),
outcome = require("outcome"),
_ = require("underscore"),
logger = require("winston").loggers.get("server.mixin"),
sprintf = require("sprintf").sprintf,
seq = require("seq"),
dref = require("dref");

exports.require = ["maestro", "createDesktopServer"];
exports.plugin = function(maestro, createDesktopServer) {
	
	maestro.getUnusedInstance = function(query, account, callback) {

		var on = outcome.e(callback);
		step(

			/**
			 * first try and find a server
			 */

			function() {

				logger.info("fetching servers");

				//find the server the account is currently using, or spin up a new one

				//fuck this is bugged right now. I don't want to deal with this...
				// maestro.getServer(_.extend({$or: [{ "owner": String(account._id) }, { "owner": null }]}, query)).exec(this);

				var owned = maestro.collection.findOne(_.extend({ owner: String(account._id) }, query)).sync();

				if(!owned) owned = maestro.collection.findOne(_.extend({ owner: null }, query)).sync();

				console.log(!!owned);
				console.log(query);
				
				this(null, owned);
			},

			/**
			 * check if the server exists. If it doesn't then create it. We don't want that though....
			 */

			on.s(function(server) {
				var next = this;

				// console.log(maestro.collection.find(_.extend({ owner: String(account._id) }, query)).sync())

				//note that if we have to resort to this, it's NOT a good thing. Creating instances on the fly takes quite a while.
				//We want people using instances immediately.
				if(!server) {
					logger.info(sprintf("creating a new server"));

					createDesktopServer(outcome.e(this).s(function(server) {
						next(null, server);
					}));

				} else {
					next(null, server);
				}
			}),

			/**
			 * reserve it for the user
			 */

			on.s(function(server) {

				if(!server) return callback(new Error("unable to connect"));

				logger.info(sprintf("account %s using server id=%s, ns=%s", account._id, server.get("_id"), server.get("ns")));

				if(server.get("owner") != String(account._id)) {
					server.set("owner", String(account._id));
					server.set("hadOwner", true);
					server.changed("used");
				}

				var next = this;
				// return next(null, server);
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