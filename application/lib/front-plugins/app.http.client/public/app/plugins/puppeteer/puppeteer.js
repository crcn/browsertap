var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
shoe = require("shoe"),
dnode = require("dnode");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(host) {
		this._host = host;
	},

	/**
	 */

	"connect": function(callback) {
		if(!callback) callback = function(){};
		if(this.connection) return callback();
		this.once("connect", callback);
		if(this._connecting) return;

		//TODO - authorize this client 
		var self = this;

		var serverUrl = [window.location.protocol, "//", window.location.host, "/server.json"].join("");
		this.startFetchTime = Date.now();

		mixpanel.track("Fetch Desktop");

		$.ajax({
			url: serverUrl,
			dataType: "json",
			success: function(resp) {
				var puppeteer = resp.result;
				self._attach({ host: "http://" + puppeteer.ns + ":8080" });
			}
		});
	},

	/**
	 */

	"disconnect": function() {
		//TODO
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
		var stream = shoe(options.host + "/dnode");

		mixpanel.track("Connect To Desktop", { host: options.host });

		this.host = options.host;
		this.token = options.token;

		var d = dnode(), self = this;
		d.on("remote", function(remote) {

			console.log("on remote");
			//attach the 
			remote.connectClient({ 
				token: options.token,
				updateNumConnections: function(n, isMain) {
					if(isMain) mixpanel.track("Sum Windows Open", { count: n });
				},
			}, function(err, remote) {
				
				if(err) return alert(err.message);
				self.connection = remote;
				self._connecting = false;
				self.emit("connect", null, remote);
			});

			
			//keep it alive!
			setInterval(function() {
				remote.keepAlive();
			}, 10000);
		});
		d.pipe(stream).pipe(d);

		d.on("end", function() {
			self._connecting = false;
			self.connection = null;
			self.emit("close");
		});

		d.on("error", function() {
			self._connecting = false;
			self.connection = null;
			self.emit("connect", new Error("unable to connect"));
		})
	}
});