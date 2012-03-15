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

		'pull -http hud -> view -> select': function(req, res) {
			req.addView(new views.HUDSelectView());
			req.display();
		}
	})
}