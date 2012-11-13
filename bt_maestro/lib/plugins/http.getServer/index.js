var step = require("step");

exports.require = ["maestro", "http.server", "http.auth.user"];
exports.plugin = function(maestro, server, authUser, loader) {

	server.get("/server", function(req, res) {
		var imageName = "remote-desktop";

		maestro.ServerModel.getUnusedInstance({ imageName: "remote-desktop" }, null, function(err, server) {
			if(err) return res.end({ error: err.message });
			res.end(server);
		});
	});
}