var puppet = require("puppet");

exports.plugin = function(loader) {
	return puppet.create(loader.params("puppet"));
}