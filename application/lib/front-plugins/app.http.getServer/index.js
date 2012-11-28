var step = require("step"),
vine = require("vine");

exports.require = ["maestro", "plugin-express", "simplecache", "emailer","starch"];
exports.plugin = function(maestro, server, simplecache, emailer, starch, loader) {

	server.get("/server.json", starch.middleware.premiumCheckpoint({creditBalance:{$gt:0}}), function(req, res) {
		var imageName = "remote-desktop";


		//fix spanning by combining streams
		simplecache.bucket("requests").get("fetch-server-" + req.account._id, function(onLoad) {
			maestro._ServerModel.getUnusedInstance({ imageName: "remote-desktop" }, req.account, onLoad);	
		}, function(err, server) {

			if(err) {
				console.error(err);
				return res.send(vine.error(err));
			}

			var result = server.toObject();
			result.creditBalance = req.customer.creditBalance;

			res.send(vine.result(result));
		})

		
	});
}