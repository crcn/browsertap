var structr  = require("structr"),
EventEmitter = require("events").EventEmitter,
dnode        = require("dnode"),
Url          = require("url");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(options) {
		this._desktops    = options.desktops;
		this._connections = [];
	},

	/**
	 */


	"connect": function() {

		var self = this;

		this._connections = this._desktops.map(function(host) {
			return new Connection(host).connect();
		});

		this._connections.forEach(function(connection) {
			connection.on("connect", function() {
				self.emit("connect", connection);
			});
		});

		return this;
	},



	/**
	 * TODO - return queue
	 */

	"getAvailableDesktop": function(callback) {
		var self = this;
		var avail = this._connections.filter(function(con) {
			return !!con.puppet;
		});

		//TODO async.filter(avail, isAvailable)
		if(!avail.length) {
			return self.once("connect", function(connection) {
				self.getAvailableDesktop(callback);
			})
		}

		return callback(null, avail.pop().puppet);
	}
});	


/*

message: function() {
	
}

*/

/*var Queue = structr(EventEmitter, {

	"__construct": function(controller) {
		this._controller = controller;
		this._waiting    = [];
		this._listen();
	},


	"add": function(target) {


	},


	"_listen": function() {
		var w = this._waiting();
		this._controller.on("availableDesktop", function(desktop) {
			var n = w.shift();
			if(n) n.desktop(desktop);
		});
	},


	"_next": function() {
		var w = this._waiting();
		this._controller.getAvailableDesktop(function() {

		})
	}
});*/


var Connection = structr(EventEmitter, {

	/**
	 */

	"__construct": function(host) {
		this.host = host;
		this.hostInfo = Url.parse(this.host);
	},

	/**
	 */

	"connect": function() {
		console.log("connecting to %s", this.host);
		var ops = this.hostInfo,
		self = this;

		this.puppet = undefined;

		dnode.connect({ host: ops.hostname, port: ops.port, reconnect: true }, function(remote, conn) {
			conn.once("end", function() {
				self._reconnect();
			});
			self._onPuppet(remote);
		}).on("error", function(err) {
			self._reconnect();
		});
		return this;
	},

	/**
	 */

	"_reconnect": function() {
		var self = this;
		setTimeout(function() {
			self.connect();
		}, 2000);
	},

	/**
	 */

	"_onPuppet": function(puppet) {
		console.log("connected to %s", this.host);
		this.puppet = puppet;
		puppet.dnode = {
			host: this.host
		};

		var info = Url.parse(puppet.rtmp.host);

		//localhost rtmp server? no go - use given IP address 
		if(info.hostname == "localhost" || info.hostname == "127.0.0.1") {
			puppet.rtmp.host = puppet.rtmp.host.replace(info.hostname, this.hostInfo.hostname);
		}

		this.emit("connect");
	}
});