var dnode = require('dnode');

exports.plugin = function(router) {

	router.on({

		/**
		 */

		'pull get/desktop': function(req, res, mw) {


			req.sanitized.host = '10.0.1.28';


			//TODO: 
			//1 request desktop
			//2 send keys if user exists
			//3 return desktop location based on GEOIP
			//4 turn machine on if one is shut down
			dnode.connect(8083, req.sanitized.host, function(remote) {
				
				remote.authorize({ user: 'user', pass: 'pass' }, res.success(function(desktop) {

					
					desktop.rtmpHost = req.sanitized.host;
						
					req.sanitized.desktop = desktop;

					if(!mw.next()) {
						res.end(desktop);
					}
				}));
			});
		}
	})
	
}