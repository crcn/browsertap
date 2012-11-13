var logger = require("winston").loggers.get("server.watcher"),
sprintf = require("sprintf").sprintf;

exports.require = ["maestro"];
exports.plugin = function(maestro, loader) {

	maestro.sync();

	var sleepTimeout = 1000 * 60,
	destroyTime = 1000 * 60 * 60;

	setInterval(function() {
		maestro.
		getServers({ busy: {$ne:true}, state: {$in: ["running", "disconnected", "pending"] }, imageName: "remote-desktop", lastUpdatedAt: {$lt: new Date(Date.now() - sleepTimeout) } }).
		min(loader.params("minRunningDesktops") || 0).
		exec(function(err, servers) {
			console.log(servers)
			if(servers && servers.length)
			logger.info(sprintf("stopping %d instances", servers.length));
		}).
		stop();
	}, sleepTimeout)


	setInterval(function() {
		maestro.
		getServers({ busy: {$ne:true}, imageName: "remote-desktop", lastUpdatedAt: {$lt: new Date(Date.now() - destroyTime) } }).
		min(loader.params("minDesktops") || 1).
		exec(function(err, servers) {
			if(servers && servers.length)
			logger.info(sprintf("terminating %d instances", servers.length));
		}).
		destroy();
	}, destroyTime);
}