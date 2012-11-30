var step = require("step"),
vine = require("vine");

exports.require = ["maestro", "plugin-express", "simplecache", "emailer","starch"];
exports.plugin = function(maestro, server, simplecache, emailer, starch, loader) {

	server.get("/server.json", starch.middleware.premiumCheckpoint({creditBalance:{$gt:0}}), function(req, res) {
		var imageName = loader.params("imageNames.remoteDesktop");


		//cache the current request from the particular account so the server doesn't try and allocate more instances than necessary.
		//Note that after the a server has been fetched, the cache won't exist anymore - it's just for single requests.
		simplecache.bucket("requests").get("fetch-server-" + req.account._id, function(onLoad) {

			//fetch an unused instance specifically for the given user
			maestro.getUnusedInstance({ imageName: imageName }, req.account, onLoad);	

		}, function(err, server) {

			//error?
			if(err) {
				console.error(err);
				return res.send(vine.error(err));
			}

			var result = server.toObject();

			//attach the credit balance so the client has something to countdown from
			result.creditBalance = req.customer.creditBalance;

			res.send(vine.result(result));
		})

		
	});
}