exports.require = ["http.server"];
exports.plugin = function(server) {

	server.post("authenticateUser", function(req, res) {
		var credentials = req.body;	
	});

	server.all("signup", function() {

	});
}