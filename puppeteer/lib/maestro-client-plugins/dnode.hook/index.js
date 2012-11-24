

var dnode = require("dnode"),
outcome   = require("outcome"),
shoe = require("shoe"),
dsync = require("dsync"),
logger = require("winston").loggers.get("logger"),
sprintf = require("sprintf").sprintf,
EventEmitter = require("events").EventEmitter,
ppt = require("../../../../puppet"),
PuppetClient = require("./puppetClient");



exports.require = ["client", "http.server"];
exports.plugin = function(client, httpServer, loader) {


	client.ready(function() {


		var params = loader.params();
		// params.rtmp = { hostname: client._info.ns };
		var puppet = ppt.create(params);

		logger.info("client ready");

		var busy = false,
		events = new EventEmitter(),
		pclient = new PuppetClient(puppet),
		killTimeoutId,
		numConnections = 0;

		//set dnode up so clients can connect
		var sock = shoe(function(stream) {

			numConnections++;

			var d = dnode({

				/**
				 * connect a client looking to control this desktop
				 */

				connectClient: function(credentials, callback) {

					//TODO
					/*client.maestroRequest("authenticateUser", credentials, outcome.error(callback).success(function(response, body) {
						if(body.errors) return callback(new Error(body.errors[0].message));

						//send the controllable instance
						callback(null, wrappedPuppet);
					}));*/



					callback(null, dsync(pclient.createClient(d)));
				},

				/**
				 * ping the machine to keep it alive.
				 */

				keepAlive: function() {
					clearTimeout(killTimeout);
					killTimeout();
				}
			});

			d.pipe(stream).pipe(d);

			function killTimeout() {
				killTimeoutId = setTimeout(function() {
					//kill due to inactivity
					d.end();
				}, 1000 * 60 * 5);

				//TODO - countdown from time available. Check every 10 minutes or so.
			}

			killTimeout();

			//once the client closes, tell the client that we're not busy
			d.on("end", function() {
				logger.info("client close");

				//no more connections? do the cleanup
				if(!(--numConnections)) {

					logger.info("no more connections, cleaning up");

					//detach the owner of this VM
					client.update({ tags: {} });

					//close all apps, and remove all settings
					puppet.apps.closeAllApps();
					
					puppet.wkm.reopen();
				}

			});
		});


		sock.install(httpServer.target, "/dnode");
	})
	

	function reconnect() {
		setTimeout(connect, 3000);
	}


}