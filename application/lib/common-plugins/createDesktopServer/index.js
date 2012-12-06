var outcome = require("outcome");

exports.require = ["maestro"]
exports.plugin = function(maestro, loader) {
	return function(callback) {
		console.log("create server");
		if(!callback) callback = function(){};

		// return callback(null);

		maestro.
		services.
		getService("amazon").
		createServer({ flavor: "c1.medium", image: loader.params("imageIds.remoteDesktop") || loader.params("imageNames.remoteDesktop") }, 
			outcome.e(callback).s(function(server) {
				/*maestro.sync(function() {
					if(callback) callback(null, maestro.collection.findOne({ _id: server.id }).sync());
				});*/

				server._id = server.id;
				callback(null, maestro.collection.insert(server).sync().pop());
			})
		);
	}
}