var dnode = require("dnode"),
request   = require("request"),
outcome   = require("outcome"),
shoe = require("shoe"),
dsync = require("dsync");

exports.require = ["client","puppet.init"];
exports.plugin = function(client, puppet, loader) {

	client.ready(function() {

		var busy = false,
		events = new EventEmitter(),
		wrappedPuppet = dsync(puppet);

		pievent(events, puppet, {
			"wkm.windows": ["open->openWindow", "close->closeWindow"]
		});

		wrap.events = dsync(events);

		//since we're just starting up, flag that the client is not busy
		client.update({ busy: busy });


		//set dnode up so clients can connect
		var sock = shoe(function(stream) {

			var d = dnode({
				connectClient: function(credentials, callback) {
					client.maestroRequest("authenticateUser", credentials, outcome.error(callback).success(function(response, body) {
						if(body.errors) return callback(new Error(body.errors[0].message));

						//start the timer NOW
						client.update({ busy: busy });

						//send the controllable instance
						callback(null, wrappedPuppet);
					}));
				}
			});

			d.pipe(stream).pipe(d);

			d.on("end", function() {
				client.update({ busy: busy = false });
			});
		});
	})
	

	function reconnect() {
		setTimeout(connect, 3000);
	}


}