var dnode = require('dnode');

exports.require = ['session','auth'];

exports.plugin = function(ops, params) {

	var server, haba = this;




	var self = {

		/**
		 * on init, startup the dnode sever
		 */

		init: function() {

			server = dnode({

				//if there's a connection, the user must authorize before continuing.
				hook: self.hook

			}).listen(params.port || 8080);

		},

		/**
		 * hooks the user into the app. The returned hooks
		 * maybe variable depending on the type of profile & level of permissions
		 * given to the user
		 */

		hook: function(credentials, callback) {

			//call to the auth plugin, and authorize
			haba.plugin('auth').authorize(credentials, function(err, profile) {

				//error? return it - most likely not authorized.
				if(err) return callback(err);

				haba.plugin('session').getNewSession(profile, callback);
			});

		}
	};

	return self;
}
