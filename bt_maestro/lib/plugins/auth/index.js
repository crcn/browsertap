var auth = require("auth");

exports.require = ["mongodb"];
exports.plugin = function(connection) {
	return auth.connect({
		connection: connection
	});
}