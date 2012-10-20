var dnode = require('dnode'),
plugin    = require('plugin');

exports.plugin = function(router) {


	var keys = { user: 'user', pass: 'pass' },
	server = dnode({

		/**
		 */

		authorize: function(credentials, callback) {

			if(!credentials || credentials.user != keys.user || credentials.pass != keys.pass) {
				return callback(new Error("invalid credentials"));
			}

			router.desktop = router.sprite.client.start('rtmp://localhost:1935/live/default');

			var loader = plugin.
			loader().
			options(router).
			require(__dirname + "/client");

			loader.load(function() {

				callback(null, loader.exports);

			});
		}
	})



	router.on({


		/**
		 */

		'push http/server': function(httpServer) {
				
			server.listen(httpServer);

		},


		/**
		 * called after user called allocation on main server
		 */

		'push keys': function(newKeys) {

			keys = newKeys;

		}
	})
}