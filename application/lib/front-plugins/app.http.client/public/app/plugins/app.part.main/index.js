exports.name = "app.part.main";
exports.require = ["views", "init"];
exports.plugin = function(views, init) {

	return {
		views: {
			Screen: require("./views/screen"),
			AppSwitcher: require("./views/appSwitcher"),
			Loader: require("./views/loader"),
			ExpandContract: require("./views/maxmin")
		}
	}
}