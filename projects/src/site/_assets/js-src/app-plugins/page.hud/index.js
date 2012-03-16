exports.plugin = function(router) {
	
	var views;	

	router.on({

		/**
		 */

		'push -pull fig': function(fig) {

			views = require('./views')(fig);
			
		},

		/**
		 */

		'pull view -> hud': function(req, res) {
			req.addView(new views.HUDView());
			this.next();
		}
	})
}