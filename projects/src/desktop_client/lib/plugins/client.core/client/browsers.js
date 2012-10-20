var EventEmitter= require('events').EventEmitter;
var em;


var prevBrowser;


function initClient(router) {
	if(em) return;

	em = new EventEmitter();

	router.sprite.on('browserProxy', function(proxy) {

		em.emit('locationChange', proxy.location);

		proxy.on('locationChange', function(location) {
			em.emit('locationChange', location);
		});
	});
}

exports.plugin = function(router) {

	initClient(router);

	return {

		/**
		 */

		open: function(browser, version, url, chromeless) {

			if(prevBrowser) prevBrowser.kill();

			router.sprite.start(browser+" "+version, { url: url, chromeless: chromeless }, function(err, browser) {

				prevBrowser = browser;

				


			});
		},


		/**
		 */

		on: function(type, callback) {
			em.on(type, callback);
		},

		/**
		 */

		once: function(type, callback) {
			em.once(type, callback);
		}
	}
}