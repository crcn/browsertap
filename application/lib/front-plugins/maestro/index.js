var Maestro = require("./maestro");

exports.plugin = function(loader) {
	var puppeteers = loader.params("puppeteers");
	return new Maestro(puppeteers);
}