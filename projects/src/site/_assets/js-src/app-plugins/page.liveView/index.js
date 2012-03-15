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

		'pull -http view -> live': function(req, res) {
			req.addRootView(new views.LiveIndexView());
 			
			if(!this.next()) {
				req.display();
			}
		}
	});
}