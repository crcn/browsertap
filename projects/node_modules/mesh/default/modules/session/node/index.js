var haba = require('haba');


exports.plugin = function(ops, params) {

	return {

		/**
		 * creates a new profile
		 */

		getNewSession: function(profile, callback) {

			//TODO - set to private

			var loader = haba.loader();

			loader.options({ profile: profile }, true).
			require(params.sessionPluginsDir).
			init(function() {

				//connect the server with the client
				callback(null, { profile: profile, remote: loader.methods });

			});
		}
	}
}
