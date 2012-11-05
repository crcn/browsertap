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
		this.client = client;
		this.connection = connection;
		this.emit("connection");
	}

});