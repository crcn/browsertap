var logger = require("winston").loggers.get("server.watcher"),
sprintf = require("sprintf").sprintf;

exports.require = ["maestro"];
exports.plugin = function(maestro, loader) {

	var destroyTime = 1000 * 60, //5 minutes
	imageName = loader.params("imageNames.remoteDesktop");


	/*function createServer() {
		maestro.servers.getService("ec2").createServer({ image: imageName, type: "c1.medium" }, function(){});
	}*/



	maestro.collection.watch({_id:{$ne:null}}, {

		//if a server is used, then clone it so there's always a live one.
		used: function(server) {
			server.clone();
		}
	})

	function destroyServers() {
		// console.log("terminating old servers");


		//note that we don't have to limit the number of servers to destroy, since any used servers should
		//be destroyed automatically. Also, if a server never had a previous owner, then it WON'T get deleted. 
		maestro.
		getServers({ "image.name": {$ne:null}, lastUsedAt: {$lt: new Date(Date.now() - destroyTime) } }).
		exec(function(err, servers) {
			var saved;

			console.log(servers.length)

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

			setTimeout(destroyServers, destroyTime);
		})
	}

	maestro.
	getAllServers().
	exec(function(err, servers) {

		//for now, prevent all servers from being destroyed INCASE there has been a server crash
		servers.forEach(function(server) {
			server.set("lastUsedAt", server.get("lastUsedAt") || new Date());
		});


		destroyServers();
	});
}