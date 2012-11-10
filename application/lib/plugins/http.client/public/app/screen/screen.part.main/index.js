exports.name = "screen.part.main";
exports.require = ["puppeteer","router"];
exports.plugin = function(puppeteer, router, loader) {
	require("./routes").plugin(puppeteer, router, loader);

	return {
		views: {
			ScreensView: require("./views/screens"),
			ScreensController: require("./controllers/screens"),
			ScreenPlayerView: require("./views/screenPlayer")
		}
	};
}