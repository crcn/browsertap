exports.require = ["http.server"];
exports.plugin = function(server) {
	server.get("/live", function(req, res) {
		res.render("screen");
	});
}