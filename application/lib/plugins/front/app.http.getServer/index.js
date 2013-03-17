var step = require("step"),
vine = require("vine");

exports.require = ["maestro", "plugin-express", "core", "starch"];
exports.plugin = function(maestro, server, core, starch, loader) {

	server.get("/browsers.json", function(req, res) {
		core.collections.desktops.getAvailableBrowsers(function(err, result) {
			if(err) return res.send(vine.error(err));
			return res.send(vine.result(result));
		});
	});


	server.get("/server.json", starch.middleware.premiumCheckpoint({creditBalance:{$gt:0}}), function(req, res) {

		var options = {
			owner: req.account,
			platformName: "windows",
			platformVersion: "2008",
			applicationName: "chrome",
			applicationVersion: "19",
			ip: req.ip
		};

		core.collections.desktops.getFreeDesktop(options, function(err, server) {


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