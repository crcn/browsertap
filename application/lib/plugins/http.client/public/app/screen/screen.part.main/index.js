exports.name = "screen.part.main";
exports.require = ["puppeteer","router"];
exports.plugin = function(puppeteer, router, loader) {
	require("./routes").plugin(puppeteer, router, loader);

	return {
		views: {
			ScreenView: require("./views/screen"),
			ScreenController: require("./controllers/screen"),
			ScreenPlayerView: require("./views/screenPlayer")
		}
	}
}