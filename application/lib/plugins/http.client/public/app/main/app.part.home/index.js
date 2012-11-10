exports.name = ["app.part.home"];
exports.require = ["router"];
exports.plugin = function(router) {
	require("./routes").plugin(router);
	return {
		views: {
			HomeView: require("./views/home")
		}
	}
}