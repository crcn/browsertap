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

		//TODO - authorize this client 
		this.startFetchTime = Date.now();

		mixpanel.track("Fetching Desktop");

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
				console.log("ERROR")
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

		mixpanel.track("Attach Desktop", {
			from_date: this.startFetchTime,
			to_date: Date.now(),
			duration: Date.now() - this.startFetchTime
		});

		console.log("attaching %s", options.host);
		var stream = shoe(options.host + "/dnode", { /*protocols_whitelist: ["websockets"]*/ });

		mixpanel.track("Connect To Desktop", { host: options.host });

		this.host = options.host;
		this.token = options.token;

		var d = dnode(), self = this;
		d.on("remote", function(remote) {

			console.log("on remote");
			//attach the 
			self._remote = remote;
			remote.connectClient({ 
				token: self.account.token.key,
				updateNumConnections: function(n, isMain) {
					if(isMain) mixpanel.track("Sum Windows Open", { count: n });
				}
			}, outcome.s(function(remote) {
				console.log("connected client");
				self.connection = remote;
				/*var oldSet = remote.windows.set;
				remote.windows.set = function() {
					console.log("SETTTTT");
					oldSet.apply(this, arguments);
				}*/
				self._connecting = false;
				self.emit("connect", null, remote);
			}));
		});
		d.pipe(stream).pipe(d);

		d.on("end", function() {
			self._connecting = false;
			self.connection = null;


			//setting a timeout helps incase the server is not ready
			setTimeout(function() {
				self.reloadServer();
			}, 1000 * 3);
		});

		d.on("error", function(err) {
			self._connecting = false;
			self.connection = null;
			self._commands.emit("error", new comerr.UnableToConnect("Unable to connect to a remote desktop"));
		})
	}
});