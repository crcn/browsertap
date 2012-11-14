var dnode = require("dnode"),
outcome   = require("outcome"),
shoe = require("shoe"),
dsync = require("dsync"),
logger = require("winston").loggers.get("logger"),
sprintf = require("sprintf").sprintf;

exports.require = ["client","puppet.init"];
exports.plugin = function(client, puppet, loader) {

	client.ready(function() {

		logger.info("client ready");

		var busy = false,
		events = new EventEmitter(),
		wrappedPuppet = dsync(puppet),
		killTimeoutId;

		pievent(events, puppet, {
			"wkm.windows": ["open->openWindow", "close->closeWindow"]
		});

		wrap.events = dsync(events);

		//set dnode up so clients can connect
		var sock = shoe(function(stream) {

			var d = dnode({

				/**
				 * connect a client looking to control this desktop
				 */

				connectClient: function(credentials, callback) {
					/*client.maestroRequest("authenticateUser", credentials, outcome.error(callback).success(function(response, body) {
						if(body.errors) return callback(new Error(body.errors[0].message));

						//send the controllable instance
						callback(null, wrappedPuppet);
					}));*/

					callback(null, wrappedPuppet);
				},

				/**
				 * ping the machine to keep it alive.
				 */

				ping: function() {
					clearTimeout(killTimeout);
					killTimeout();
				}
			});

			d.pipe(stream).pipe(d);

			function killTimeout() {
				killTimeoutId = setTimeout(function() {
					//kill due to inactivity
					d.close();
				}, 1000 * 60);

				//TODO - countdown from time available. Check every 10 minutes or so.
			}


			killTimeout();


			//once the client closes, tell the client that we're not busy
			d.on("end", function() {
				client.update({ tags: {} });
			});
		});
	})
	

	function reconnect() {
		setTimeout(connect, 3000);
	}


}