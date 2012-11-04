var structr = require("structr"),
EventEmitter = require("events").EventEmitter;

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(info) {
		this.name = info.name;
		this.version = String(info.version);
	},

	/**
	 */


	"listen": function(client, connection) {
		var self = this;
		connection.once("end", function() {
			self.emit("disconnected");
		})
		this.client = client;
		this.connection = connection;
		this.emit("connection");
	}

});