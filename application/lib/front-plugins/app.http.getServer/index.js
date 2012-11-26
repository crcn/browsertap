var step = require("step"),
vine = require("vine");

exports.require = ["maestro", "plugin-express", "emailer","auth"];
exports.plugin = function(maestro, server, emailer, auth, loader) {
	console.log(emailer)
	server.get("/server.json", auth.middleware.authCheckpoint, function(req, res) {
		var imageName = "remote-desktop";

		maestro._ServerModel.getUnusedInstance({ imageName: "remote-desktop" }, req.account, function(err, server) {
			if(err) {
				console.error(err)
				return res.send(vine.error(err));
			}
			res.send(vine.result(server));
		});
	});
}