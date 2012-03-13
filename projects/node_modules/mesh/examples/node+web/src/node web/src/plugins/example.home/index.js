

exports.plugin = function(router) {
	
	var views;
	
	router.on({
		
		'push -pull fig': function(fig) {
			views = require('./views')(fig);
		},


		/**
		 */

		'pull -method=GET view -> home OR /': function(req, res) {
			req.addView(new views.IndexView());
			if(!this.next()) req.display();
		},

		/**
		 */

		'pull -method=GET home -> view -> hello': function(req, res) {
			
			req.addView(new views.HelloView());
			if(!this.next()) req.display();
		}
	})
}