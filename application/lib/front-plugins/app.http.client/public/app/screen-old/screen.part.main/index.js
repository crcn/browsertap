exports.name = "screen.part.main";
exports.require = ["commands", "puppeteer","router"];
exports.plugin = function(commands, puppeteer, router, loader) {


	require("./routes").plugin(commands, puppeteer, router, loader);

	return {
		views: {
			ScreensView: require("./views/screens"),
			ScreensController: require("./controllers/screens"),
			ScreenView: require("./views/screen"),
			ScreenController: require("./controllers/screen"),
			ScreenPlayerView: require("./views/screenPlayer")
		}
	};
}