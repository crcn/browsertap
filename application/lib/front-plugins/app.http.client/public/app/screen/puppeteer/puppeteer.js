var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
shoe = require("shoe"),
dnode = require("dnode");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(maestro, hostInfo) {
		this._maestro = maestro;
		this._hostInfo = hostInfo;
	},

	/**
	 */

	"connect": function(callback) {
		if(!callback) callback = function(){};
		if(this.connection) return callback();
		this.once("connect", callback);
		if(this._connecting) return;

		this.emit("status", "loading puppeteer");

		if(this._hostInfo && this._hostInfo.host) {
			return this._attach(this._hostInfo);
		}

		//TODO - authorize this client 
		var self = this;
		this._maestro.getAvailablePuppeteer(function(err, options) {
			if(err) return alert(err);
			self._attach(options);
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
				if(err) return alert(err);
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