var structr = require("structr"),
step = require("step"),
outcome = require("outcome"),
_ = require("underscore"),
request = require("request");

module.exports = structr({

	/**
	 */

	"__construct": function(maestro, cache, imageId) {
		this._maestro = maestro;
		this._cache   = cache;
		this._imageId = imageId;

		console.log("registering desktop server to id %s", this._imageId);

		this._stopTime = 1000 * 60 * 10;
		this._terminateTime = 1000 * 60 * 60 * 24;

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
				var owned = maestro.collection.findOne({ owner: accountId }).sync();


				//yes? return
				if(owned) {
					console.log("server already being used, returning");
					return this(null, owned);
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
				server.set("lastUsedAt", new Date());

				console.log("user %s using server %s", accountId, server.get("_id"));

				//after a server has been created, make a new one so 
				if(!self._tryStartingServer()) self._tryMakingServer();

				var next = this;

				//start the server - this will be ignored if it's already being started 
				server.start();

				next(null, server);
			}),
			cb
		);
	},

	/**
	 * makes a server if there are none already in the queue
	 */

	"_tryStartingServer": function() {
		if(this._maestro.collection.count({ imageId: this._imageId, owner: null, state: "running" }).sync() >= 1) return;

		var server = this._maestro.collection.findOne({ imageId: this._imageId, owner: null, state: "stopped" }).sync();

		if(!server) return false;

		console.log("starting server %s", server.get("_id"));

		server.start();
		return true;
	},

	/**
	 * makes a server if there are none already in the queue
	 */

	"_tryMakingServer": function() {
		// console.log(this._maestro.collection.find({ imageId: this._imageId, owner: null }).sync())
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

		if(!maestro.services.getService("amazon")) {
			console.error("amazon service not registered - can't create instance");
			return;
		}

		this._maestro.
		services.
		getService("amazon").
		createServer({ flavor: "m1.medium", image: this._imageId }, 
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
		setInterval(_.bind(this._stopStaleServers, this), 1000 * 30);
		setInterval(_.bind(this._terminateSuperOldServers, this), 1000 * 60 * 60 * 24);
	},

	/**
	 */

	"_stopStaleServers": function() {
		this._maestro.
		getServers({ imageId: this._imageId, state: "running", $or: [{ lastUsedAt: undefined }, { lastUsedAt: {$lt: new Date(Date.now() - this._stopTime) }}] }).
		exec(function(err, servers) {
			var saved;


			if(servers.length <= 1) return;

			// if(servers.length <= 1) return;

			var shutdownable = servers.filter(function(server) {
				return !server.get("spotInstanceId");
			});

			if(!shutdownable.length) return;


			//one at a time
			shutdownable[0].stop();
		});
	},


	/**
	 */

	"_terminateSuperOldServers": function() {
		this._maestro.
		getServers({ imageId: this._imageId, state: "stopped", $or: [{ lastUsedAt: undefined }, { lastUsedAt: {$lt: new Date(Date.now() - this._terminateTime) }}] }).
		exec(function(err, servers) {
			var saved;

			if(!servers.length || servers.length < 3) return;

			//one at a time
			servers[0].terminate();
		});
	},

	/**
	 */

	"_query": function(q) {
		q.$or = [{ service: "local"}, { imageId: this._imageId, state: "running" }, { imageId: this._imageId, state: "stopped" } ];

		return q;
	}

});