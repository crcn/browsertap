exports.name = "app.part.main";
exports.require = ["views"];
exports.plugin = function(views) {
	
	return {
		views: {
			Screen: require("./views/screen"),
			AppSwitcher: require("./views/appSwitcher")
		}
	}
}