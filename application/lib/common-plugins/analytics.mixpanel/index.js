var mixpanel = require("mixpanel");

exports.plugin = function(loader) {
	return mixpanel.init(loader.params("mixpanel.token"));
}