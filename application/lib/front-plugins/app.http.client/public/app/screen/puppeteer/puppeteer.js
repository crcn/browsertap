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
		var stream = shoe(options.host + "/dnode");

		this.host = options.host;
		this.token = options.token;

		var d = dnode(), self = this;
		d.on("remote", function(remote) {
			//attach the 
			remote.connectClient({ token: options.token }, function(err, remote) {
				
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
			self.emit("close");
		});

		d.on("error", function() {
			self._connecting = false;
			self.connection = null;
			self.emit("connect", new Error("unable to connect"));
		})
	}
});