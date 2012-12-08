var structr = require("structr"),
step = require("step"),
outcome = require("outcome"),
_ = require("underscore");

module.exports = structr({

	/**
	 */

	"__construct": function(maestro, cache, imageId) {
		this._maestro = maestro;
		this._cache   = cache;
		this._imageId = imageId;

		console.log("registering desktop server to id %s", this._imageId);

		this._destroyTime = 1000 * 60;

		this._startSanityCheck();
	},

	/**
	 */

	"getFreeServer": function(account, cb) {

		var accountId = String(account._id);

		this._cache.get("fetch-server-" + accountId, _.bind(this._getFreeServer, this, accountId), cb);
	},

	/**
	 */

	"_getFreeServer": function(accountId, cb) {


		var maestro = this._maestro,
		self = this,
		on = outcome.e(cb);

		console.log("get free server for %s", accountId);


		step(
			function() {

				//first check if the user is already registered to a server
				var owned = maestro.collection.findOne(self._query({ owner: accountId })).sync();

				//yes? return
				if(owned) {
					console.log("server already being used, returning");
					return cb(null, owned);
				}

				//no? find a free server
				owned = maestro.collection.findOne(self._query({ owner: null })).sync();


				if(owned) {
					console.log("returning free server");
					return this(null, owned);
				}

				//no free server? create one.
				self._createServer(this);
			},
			on.s(function(server) {
				server.set("owner", accountId);

				console.log("user using server %s", server.get("_id"));

				//after a server has been created, make a new one so 
				self._tryMakingServer();

				var next = this;

				//needs to happen so the server can be retreive info
				server.ping(function() {
					next(null, server);
				});
			}),
			cb
		);
	},

	/**
	 * makes a server if there are none already in the queue
	 */

	"_tryMakingServer": function() {
		if(this._maestro.collection.count({ imageId: this._imageId, owner: null }).sync() >= 1) return;

		console.log("no more free servers, creating new one for the next user");
		this._createServer();
	},

	/**
	 * makes a new server on-demand
	 */

	"_createServer": function(cb) {
		if(!cb) cb = function(){};

		console.log("creating new server");

		var maestro = this._maestro;

		this._maestro.
		services.
		getService("amazon").
		createServer({ flavor: "c1.medium", image: this._imageId }, 
			outcome.e(cb).s(function(server) {
				server._id = server.id;
				cb(null, maestro.collection.insert(server).sync().pop());
			})
		);
	},


	/** 
	 * it's always good to have some sanity check so the system doesn't get all foobar'd
	 */

	"_startSanityCheck": function() {
		setInterval(_.bind(this._removeStaleServers, this), 1000 * 30);
	},

	/**
	 */

	"_removeStaleServers": function() {
		this._maestro.
		getServers({ imageId: this._imageId, lastUsedAt: {$lt: new Date(Date.now() - this._destroyTime) } }).
		exec(function(err, servers) {
			var saved;

			servers.forEach(function(server) {
				if(server.get("hadOwner")) {
					server.terminate();
				} else 
				if(!saved) {
					saved = server;
				} else {
					server.terminate();
				}
			});
		})
	},

	/**
	 */

	"_query": function(q) {
		q.$or = [{ service: "local"}, { imageId: this._imageId}];

		return q;
	}

});