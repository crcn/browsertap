var mongoose = require("mongoose");
exports.plugin = function(loader) {
	return mongoose.createConnection(loader.params("mongodb"));
}