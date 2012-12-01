var logger = require("winston").loggers.get("server.watcher"),
sprintf = require("sprintf").sprintf;

exports.require = ["maestro"];
exports.plugin = function(maestro, loader) {

	var sleepTimeout = 1000 * 60,
	destroyTime = 1000 * 60 * 60;

	maestro.getAllServers().watch("stateChange").on("stateChange", function(server) {
		console.log("state changed!");
	});


	return;
	
	function stopServers() {
		maestro.
		getServers({ "tags.owner": null, state: {$in: ["running", "pending"] }, imageName: "remote-desktop", lastUsedAt: {$lt: new Date(Date.now()) } }).
		min(loader.params("minRunningDesktops") || 0).
		exec(function(err, servers) {
			if(servers && servers.length)
			logger.info(sprintf("stopping %d instances", servers.length));
			setTimeout(stopServers, sleepTimeout);
		}).
		stop();
	}

	function destroyServers() {
		maestro.
		getServers({ "tags.owner": null, imageName: "remote-desktop", lastUsedAt: {$lt: new Date(Date.now() - destroyTime) } }).
		min(loader.params("minDesktops") || 1).
		exec(function(err, servers) {
			if(servers && servers.length)
			logger.info(sprintf("terminating %d instances", servers.length));
			setTimeout(stopServers, destroyTime);
		}).
		destroy();
	}

	function rebootStale() {
		/*maestro.
		getServers({ "tags.owner": null, imageName: "remote-desktop", lastUpdatedAt: {$lt: new Date(Date.now() - destroyTime) } }).
		exec(function(err, servers) {
			if(servers && servers.length)
			logger.info(sprintf("terminating %d instances", servers.length));
			setTimeout(stopServers, destroyTime);
		}).
		destroy();*/
	}

	stopServers();
	destroyServers();
	rebootStale();
}