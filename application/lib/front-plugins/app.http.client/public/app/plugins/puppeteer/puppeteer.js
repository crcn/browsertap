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

	"__construct": function(host, commands) {
		this._host = host;
		this._commands = commands;
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

		if(err) return self._commands.emit("error", resp.errors);

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
				self._attach({ host: "http://" + puppeteer.ns + ":8080/browsertap.puppeteer" });
			})
		});	
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
		var stream = shoe(options.host + "/dnode", { protocols_whitelist: ["websockets"] });

		mixpanel.track("Connect To Desktop", { host: options.host });

		this.host = options.host;
		this.token = options.token;

		var d = dnode(), self = this;
		d.on("remote", function(remote) {

			console.log("on remote");
			//attach the 
			self._remote = remove;
			remote.connectClient({ 
				token: self.account.token.key,
				updateNumConnections: function(n, isMain) {
					if(isMain) mixpanel.track("Sum Windows Open", { count: n });
				}
			}, function(err, remote) {
				
				if(err) return alert(err.message);
				self.connection = remote;
				self._connecting = false;
				self.emit("connect", null, remote);
			});
		});
		d.pipe(stream).pipe(d);

		d.on("end", function() {
			self._connecting = false;
			self.connection = null;
			self.reloadServer();
		});

		d.on("error", function() {
			self._connecting = false;
			self.connection = null;
			self._commands.emit("error", new comerr.UnableToConnect("Unable to connect to a remote desktop"));
		})
	}
});