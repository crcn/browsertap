var step = require("step"),
vine = require("vine");

exports.require = ["maestro", "app.http.server", "app.http.auth"];
exports.plugin = function(maestro, server, httpAuth, loader) {

	server.get("/server.json", httpAuth.authCheckpoint, function(req, res) {
		var imageName = "remote-desktop";

		maestro._ServerModel.getUnusedInstance({ imageName: "remote-desktop" }, req.account, function(err, server) {
			if(err) {
				console.log("ERR")
				return res.send(vine.error(err));
			}
			res.send(vine.result(server));
		});
	});
}