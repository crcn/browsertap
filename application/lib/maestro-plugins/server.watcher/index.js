var logger = require("winston").loggers.get("server.watcher"),
sprintf = require("sprintf").sprintf;

exports.require = ["maestro", "createDesktopServer"];
exports.plugin = function(maestro, createDesktopServer, loader) {

	var destroyTime = 1000 * 60 * 3, //5 minutes
	imageId = loader.params("imageIds.remoteDesktop");


	/*function createServer() {
		maestro.servers.getService("ec2").createServer({ image: imageId, type: "c1.medium" }, function(){});
	}*/

	/*setTimeout(function() {
		console.log("CREATE");
		maestro.services.getService("amazon").createServer({ flavor: "c1.medium", image: imageId }, function() {
			maestro.sync();
		});

	}, 1000 * 5);*/


	maestro.collection.watch({_id:{$ne:null}}, {

		//if a server is used, then clone it so there's always a live one.
		used: function(server) {

			console.log(maestro.collection.find({ imageId: imageId, owner: null }).sync().length);
			if(maestro.collection.find({ imageId: imageId, owner: null }).sync().length >= 1) return;

			console.log("using %s, creating new server", server.get("_id"));
			createDesktopServer();
		}
	});

	function destroyServers() {
		// console.log("terminating old servers");


		//note that we don't have to limit the number of servers to destroy, since any used servers should
		//be destroyed automatically. Also, if a server never had a previous owner, then it WON'T get deleted. 
		maestro.
		getServers({ imageId: imageId, lastUsedAt: {$lt: new Date(Date.now() - destroyTime) } }).
		exec(function(err, servers) {
			var saved;

			// console.log(maestro.collection.findOne({ owner: null, "image.name": imageId }).sync())
			try {
				servers.forEach(function(server) {
					if(server.get("hadOwner")) {
						server.terminate();
					} else 
					if(!saved) {
						saved = server;
					} else {
						server.terminate();
					}
				});
			} catch(e) {
				console.error(e.stack);
			}

			setTimeout(destroyServers, 1000 * 30);
		})
	}

	maestro.
	getAllServers().
	exec(function(err, servers) {
		//console.log(maestro.collection.find({ owner: null, imageId: imageId }).sync().length)
		// console.log(maestro.collection.count({ owner: null, imageId: imageId }).sync())

		//for now, prevent all servers from being destroyed INCASE there has been a server crash
		servers.forEach(function(server) {
			server.set("lastUsedAt", server.get("lastUsedAt") || new Date());
		});


		destroyServers();
	});
}