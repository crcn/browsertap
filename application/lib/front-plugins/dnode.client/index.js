var dnode = require("dnode"),
shoe      = require("shoe"),
dsync     = require("dsync");

exports.require = ["app.http.server", "maestro"];
exports.plugin = function(server, maestro) {


	var wrap = dsync({
		maestro: maestro
	});

	var sock = shoe(function(stream) {
		var d = dnode({
			getExports: function(credentials, callback) {
				callback(null, wrap);
			}
		});

		d.pipe(stream).pipe(d);
	});

	sock.install(server._server, "/dnode");
}