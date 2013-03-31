var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
shoe = require("shoe"),
dnode = require("dnode"),
auth = require("auth").connect(),
_ = require("underscore"),
comerr = require("comerr"),
outcome = require("outcome");

outcome.logAllErrors(true);


module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(host, states, commands) {
		this._host = host;
		this._commands = commands;
		this._states = states;


		//first authorize the user - get the info
		this._connect();
		this._keepAlive();
	},

	/**
	 */

	"step _connect": function(callback) {
		if(!callback) callback = function(){};
		this.once("connect", callback);
		if(this._connecting) return;

		analytics.track("Fetching Available Desktop");


		var self = this;

		//first authorize the user - get the info
		auth.Account.login(outcome.e(function(e) {
			self._commands.emit("error", e);
			callback(e);
		}).s(function(account) {
			self.account = account;
			callback();
		}));
	},

	/**
	 */

	"connectDesktop": function(browser, callback) {
		this._browser = browser;
		this.reloadServer();

		this.emit("connect", null, null);
		this.once("connect", callback || function(){});
	},

	/**
	 */

	"step reloadServer": function(next) {


		var serverUrl = [window.location.protocol, "//", window.location.host, "/server.json?browserId=" + this._browser._id].join(""),
		self = this;

		next();


		console.log("reloading server %s", serverUrl);

		$.ajax({
			url: serverUrl,
			dataType: "json",
			success: function(response) {
				console.log(arguments)
				var puppeteer = response.result;

				console.log(puppeteer.state);
				self.state(puppeteer.state);
				console.log(puppeteer.state);

				//address exists? it's running
				var address = (puppeteer.address || puppeteer.dnsName);
				if(address && puppeteer.state == "running") {
					self._attach({ host: "http://" + address + ":8080" });
				} else {

					console.log("address doesn't exist, or state isn't running, timeout.");

					//otherwise try reloading
					setTimeout(function() {
						self.reloadServer();
					}, 1000 * 2);
				}
			},
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

	"_keepAlive": function() {
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

			console.log("remote connection made, connecting to client with key %s", self.account.token.key);

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

			console.log("connection ended, restarting");

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