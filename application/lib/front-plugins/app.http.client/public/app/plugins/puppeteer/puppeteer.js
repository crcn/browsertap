var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
shoe = require("shoe"),
dnode = require("dnode"),
auth = require("auth").connect(),
_ = require("underscore"),
comerr = require("comerr"),
outcome = require("outcome");


module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(host, states, commands) {
		this._host = host;
		this._commands = commands;
		this._states = states;
	},

	/**
	 */

	"connect": function(callback) {
		if(!callback) callback = function(){};
		if(this.connection) return callback();
		this.once("connect", callback);
		if(this._connecting) return;

		analytics.track("Fetching Available Desktop");

		//first authorize the user - get the info
		auth.Account.login(_.bind(this.onAccount, this));
	},

	/**
	 */

	"onAccount": function(err, account) {

		if(err) return this._commands.emit("error", err);

		this.account = account;

		this.reloadServer();
		this.keepAlive();
	},

	/**
	 */

	"reloadServer": function() {


		var serverUrl = [window.location.protocol, "//", window.location.host, "/server.json"].join(""),
		self = this;

		$.ajax({
			url: serverUrl,
			dataType: "json",
			success: outcome.vine().success(function(puppeteer) {

				self.state(puppeteer.state);

				//address exists? it's running
				if(puppeteer.address && puppeteer.state == "running") {
					self._attach({ host: "http://" + puppeteer.address + ":8080/browsertap.puppeteer" });
				} else {

					//otherwise try reloading
					setTimeout(function() {
						self.reloadServer();
					}, 1000 * 2);
				}
			}),
			error: function() {
				console.log(arguments);
			}
		});
	},

	/**
	 */

	"state": function() {
		this._states.set.apply(this.states, arguments);
	},

	/**
	 */

	"disconnect": function() {
		//TODO
	},

	/**
	 * prevents the app from timing out. TODO - this should be tied to activity (mouse)
	 */

	"keepAlive": function() {
		setInterval(function(self) {
			if(self._remote) self._remote.keepAlive();
		}, 10000, this);
	},

	/**
	 */

	"_attach": function(options) {

		console.log("attaching %s", options.host);

		var stream = shoe(options.host + "/dnode", { /*protocols_whitelist: ["websockets"]*/ });

		this.host = options.host;
		this.token = options.token;

		var d = dnode(), self = this;
		d.on("remote", function(remote) {

			analytics.track("Connecting To Desktop", { 
				host: options.host
			});

			//attach the 
			self._remote = remote;
			remote.connectClient({ 

				//hmm - if there isn't an SSL cert - this can be ugh  - a security issue.
				token: self.account.token.key,

				//this is called when the number of connections has changed. It's important to track the
				//number of windows open so we can determine if a user is using parallel testing.
				updateNumConnections: function(n, isMain) {
					if(isMain) analytics.track("Num Windows Changed", { count: n });
				}
			}, 


			//much success for 
			outcome.s(function(remote) {

				analytics.track("Successfuly Connected to Desktop");

				console.log("connected to client");
				self.connection = remote;
				self._connecting = false;
				self.emit("connect", null, remote);
			}));
		});

		d.pipe(stream).pipe(d);


		//If the connection ends, then we need to try and reload the server - the connection
		//should NEVER end unless the user has been kicked out.
		d.on("end", function() {
			self._connecting = false;
			self.connection = null;


			//setting a timeout helps incase the server is not ready
			setTimeout(function() {
				self.reloadServer();
			}, 1000 * 3);
		});


		//errors should not happen. In the unlikely chance that they do, we need
		//to let the user know.
		d.on("error", function(err) {
			self._connecting = false;
			self.connection = null;

			//this should be picked up by any error tracking analytics
			console.error(err.stack);

			self._commands.emit("error", new comerr.UnableToConnect("Connection dropped with remote desktop"));
		})
	}
});