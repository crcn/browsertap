var logger = require("winston").loggers.get("server.watcher"),
sprintf = require("sprintf").sprintf;

exports.require = ["maestro"];
exports.plugin = function(maestro, loader) {

	var sleepTimeout = 1000 * 60,
	destroyTime = 1000 * 60 * 5, //5 minutes
	imageName = loader.params("imageNames.remoteDesktop");

	maestro.getAllServers().watch("stateChange").on("stateChange", function(server) {
		console.log("state changed!");
	});

	function destroyServers() {
		maestro.
		getServers({ "image.name": imageName, lastUsedAt: {$lt: new Date(Date.now() - destroyTime) } }).
		min(loader.params("minRunningDesktops") || 0).
		exec(function(err, servers) {
			if(servers && servers.length)
			logger.info(sprintf("terminating %d instances", servers.length));
			setTimeout(destroyServers, destroyTime);
		}).
		terminate();
	}

	maestro.
	getAllServers().
	exec(function(err, servers) {

		//for now, prevent all servers from being destroyed INCASE there has been a server crash
		servers.forEach(function(server) {
			server.set("lastUsedAt", server.get("lastUsedAt") || new Date());
		});


		destroyServers();
	});
}