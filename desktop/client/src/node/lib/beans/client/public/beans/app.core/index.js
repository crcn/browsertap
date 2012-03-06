var views = require('./views');

exports.plugin = function(router) {

	router.on({

		'pull -public view -> (home OR /)': function() {
			
		},
		
		'pull root/view': function() {
			return views.IndexView;
		}
	})
	
	head.ready(function() {
		router.push('init');
		router.push('xbrowsertesting/ready');
	});
}