exports.require = ["http.server"];
exports.plugin = function(server) {
	server.get("/app/:name", function(req, res) {
		res.render("screen");
	});
}