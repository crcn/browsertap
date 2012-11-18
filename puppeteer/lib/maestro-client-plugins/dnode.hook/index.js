

var dnode = require("dnode"),
outcome   = require("outcome"),
shoe = require("shoe"),
dsync = require("dsync"),
logger = require("winston").loggers.get("logger"),
sprintf = require("sprintf").sprintf,
EventEmitter = require("events").EventEmitter,
pievent = require("pievent"),
ppt = require("../../../../puppet");



exports.require = ["client", "http.server"];
exports.plugin = function(client, httpServer, loader) {


	client.ready(function() {


		var params = loader.params();
		var puppet = ppt.create(params);

		logger.info("client ready");

		var busy = false,
		events = new EventEmitter(),
		wrappedPuppet = dsync(puppet),
		killTimeoutId,
		numConnections = 0;

		pievent(events, puppet, {
			"wkm.windows": ["open->openWindow", "close->closeWindow"]
		});

		wrappedPuppet.events = dsync(events);

		//set dnode up so clients can connect
		var sock = shoe(function(stream) {

			numConnections++;

			var wp = dsync(wrappedPuppet),
			_closeWindows = [];

			wp.bindWindow = function(id) {
				_closeWindows.push(id);
			}

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



					callback(null, wp);
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
				if(!(--numConnections)) client.update({ tags: { } });
				for(var i = _closeWindows.length; i--;) {
					console.log("closing %s", _closeWindows[i])
					puppet.wkm.windows.getWindow(_closeWindows[i], function(err, window) {
						if(err) return;
						window.close();
					});
				}
			});
		});


		sock.install(httpServer.target, "/dnode");
	})
	

	function reconnect() {
		setTimeout(connect, 3000);
	}


}