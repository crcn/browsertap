var structr = require("structr"),
dnode       = require("dnode"),
Url = require("url"),
logger = require("winston").loggers.get("puppeteer");
sprintf = require("sprintf").sprintf,
dsync  = require("dsync");

module.exports = structr({

	/**
	 */

	"__construct": function(host, maestro) {
		this.maestro = dsync(maestro);
		this._host = host;

		var hp = Url.parse(host);
		this.host  = hp.protocol + "//" + hp.hostname + ":" + (Number(hp.port) + 1);
		
		this._connect();
	},

	/**
	 */

	"_connect": function() {
		this.connected = false;

		logger.info(sprintf("connecting to %s", this._host));

		var self = this;
		var up = Url.parse(this._host);
		var d = dnode.connect({ host: up.hostname, port: up.port });
		d.on("remote", function(remote) {
			logger.info(sprintf("connected to %s", self._host));

			remote.connectMaestro({ maestro: self.maestro }, function(err, remote) {
				if(err) return console.error(err);
				self.remote = remote;
				self.guid   = remote.guid;
				self.connected = true;
			})
		});

		d.on("error", function() {
			logger.info(sprintf("connection error for %s", self._host));
			self._reconnect();
		})

		d.on("end", function() {
			logger.info(sprintf("connection closed for %s", self._host));
			self._reconnect();
		})
	},

	/**
	 */

	"_reconnect": function() {
		var self = this;
		this.connected = false;

		setTimeout(function() {
			self._connect();
		}, 2000);
	}
});