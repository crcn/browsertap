var _ = require("underscore");

exports.name = "app.part.main";

exports.require = ["router"];
exports.plugin = function(router, loader) {

	require("./routes").plugin(router);

	loader.module("puppeteer").connect(function(err, connection) {
		console.log(connection)

		connection.events.on("openWindow", function(window) {
			console.log(window);

			var i = 0;

			/*var interval = setInterval(function() {
				if(i > 100) clearInterval(interval);
				window.move(i++, i);
			}, 10);*/

			/*window.startRecording(function() {
				console.log(arguments)
			})*/

		})
		connection.client.windows.getWindows(function(err, windows) {
			console.log(windows)
		})
	});

	return {
		views: {
			AppView: require("./views/main").extend({ loader: loader })
		}
	};
}