var structr = require("structr"),
Client = require("./client"),
NativeWindows = require("./nativeWindows"),
WindowBinder = require("./windowBinder");

module.exports = structr({

	/**
	 */

	"__construct": function(puppet) {
		this.clients = [];
		this.puppet = puppet;
		this.nativeWindows = new NativeWindows(this, puppet.wkm);
		this._binder = new WindowBinder({ port: 3986 });
	},

	/**
	 */

	"createClient": function(connection) {
		var client = new Client(this, connection),
		self = this;

		self.clients.push(client);

		client.once("close", function() {
			self.clients.splice(self.clients.indexOf(client), 1);
		});

		return client;
	}
});