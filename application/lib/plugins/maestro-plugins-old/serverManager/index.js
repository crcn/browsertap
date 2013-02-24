var ServerManager = require("./serverManager");

exports.require = ["maestro", "simplecache"];

exports.plugin = function(maestro, simplecache, loader) {
	return new ServerManager(maestro, simplecache.bucket("servers"), loader.params("imageIds.remoteDesktop"));
}