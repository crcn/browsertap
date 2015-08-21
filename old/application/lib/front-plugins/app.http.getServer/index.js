var step = require("step"),
vine = require("vine");

exports.require = ["maestro", "plugin-express", "serverManager", "starch"];
exports.plugin = function(maestro, server, serverManager, starch, loader) {

	server.get("/server.json", starch.middleware.premiumCheckpoint({creditBalance:{$gt:0}}), function(req, res) {

		serverManager.getFreeServer(req.account, function(err, server) {
			//error?
			if(err) {
				console.error(err.stack);
				return res.send(vine.error(err));
			}

			var result = server.get();

			//attach the credit balance so the client has something to countdown from
			result.creditBalance = req.customer.creditBalance;

			res.send(vine.result(result));
		});
		
	});
}