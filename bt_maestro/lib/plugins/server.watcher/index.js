exports.require = ["maestro"];
exports.plugin = function(maestro, loader) {

	maestro.sync();

	//destroy after N minutes
	maestro.getServers({ busy: false }).delay(1000 * 60 * 1).min(loader.params("minRemoteDesktops") || 1).destroy();
}