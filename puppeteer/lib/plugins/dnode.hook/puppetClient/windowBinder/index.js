var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
express = require("express");

module.exports = structr({

	/**
	 */

	"__construct": function(ops) {
		this._port = ops.port;
		this._nativeWindows = ops.nativeWindows;
		this.open();
	},


	/**
	 */

	"open": function() {
		var server = express(), self = this;
		server.use(express.static(__dirname + "/public"));
		server.enable("jsonp callback");
		server.get("/bind.json", function(req, res) {
			res.jsonp("hello");
			self.emit("open");
		});
		server.listen(this._port);
	}
});