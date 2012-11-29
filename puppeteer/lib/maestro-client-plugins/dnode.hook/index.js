

var dnode = require("dnode"),
outcome   = require("outcome"),
shoe = require("shoe"),
dsync = require("dsync"),
logger = require("winston").loggers.get("logger"),
sprintf = require("sprintf").sprintf,
EventEmitter = require("events").EventEmitter,
ppt = require("../../../../puppet"),
PuppetClient = require("./puppetClient");



exports.require = ["client", "plugin-express"];
exports.plugin = function(client, httpServer, loader) {

	console.log("waiting for maestro");
	client.ready(function() {


		var params = loader.params();
		params.rtmp = { hostname: client._info.ns };
		var puppet = ppt.create(params);

		logger.info("client ready");

		var busy = false,
		events = new EventEmitter(),
		pclient = new PuppetClient(puppet),
		killTimeoutId,
		numConnections = 0,
		clients = [],
		startTime;


		function updateNumConnections() {
			for(var i = clients.length; i--;) {
				clients[i].updateNumConnections(clients.length, i == 0);
			}	
		}

		
		function disconnectAllClients() {
			for(var i = clients.length; i--;) {
				clients[i].d.end();
			}	
		}



		//set dnode up so clients can connect
		var sock = shoe(function(stream) {

			numConnections++;

			var startTime = Date.now(), inf, token, killByCreditBalanceTimeout;

			function updateCreditBalance() {

				//need to make sure any session less than 1 minute gets accounted for.
				var usedCredits = Math.ceil((Date.now() - startTime) / 1000 / 60);

				console.log("used credits %d", usedCredits);


				client.maestroRequest("post", "/creditBalance.json", { token: token, usedCredits: usedCredits  }, outcome.error(function() {

					//disconnect the client.
					d.end();
				}).success(function() {
					// updateCreditBalance();
				}));
			}

			function syncCreditBalance(cb) {

				client.maestroRequest("get", "/creditBalance.json", { token: token }, outcome.error(cb).success(function(creditBalance) {

					console.log("credit balance is %d - setting kill timeout", creditBalance);

					clearTimeout(killByCreditBalanceTimeout);
					killByCreditBalanceTimeout = setTimeout(killByCreditBalance, creditBalance * 1000 * 60);
					cb();
				}));
			}

			function killByCreditBalance() {
				console.log("user was kicked out because they didn't have enough credits :(");
				clearTimeout(killByCreditBalanceTimeout);
				disconnectAllClients();
			}


			var d = dnode({

				/**
				 * connect a client looking to control this desktop
				 */

				connectClient: function(info, callback) {

					token = info.token;

					syncCreditBalance(outcome.error(callback).success(function() {
						info.d = d;
						clients.push(inf = info);
						callback(null, dsync(pclient.createClient(d)));
						updateNumConnections();
					}));

				},

				/**
				 * ping the machine to keep it alive.
				 */

				keepAlive: function() {
					clearTimeout(killTimeoutId);
					killTimeout();
				}
			});

			d.pipe(stream).pipe(d);

			function killTimeout() {
				return;
				killTimeoutId = setTimeout(function() {
					//kill due to inactivity
					d.end();
				}, 1000 * 60 * 5);

				//TODO - countdown from time available. Check every 10 minutes or so.
			}

			killTimeout();

			//once the client closes, tell the client that we're not busy
			d.on("end", function() {
				var i = clients.indexOf(inf);
				if(~i) clients.splice(i, 1);
				updateNumConnections();

				logger.info("client close");

				//no more connections? do the cleanup
				if(!(--numConnections)) {


					clearTimeout(killByCreditBalanceTimeout);
					updateCreditBalance();

					token = null;

					logger.info("no more connections, cleaning up");

					//detach the owner of this VM
					client.update({ tags: {} });

					//close all apps, and remove all settings
					puppet.apps.closeAllApps();

					puppet.wkm.reopen();
				}

			});
		});


		sock.install(httpServer.connection, "/dnode");
	})
	

	function reconnect() {
		setTimeout(connect, 3000);
	}


}