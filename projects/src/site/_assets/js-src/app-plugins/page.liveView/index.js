var _ = require('underscore');


exports.plugin = function(router) {
	
	var views, curLocation, desktop, browser, version;

	router.on({


		/**
		 */

		'push -pull fig': function(fig) {
			views = require('./views')(fig);
		},


		/**
		 */

		'pull check/location': function(req) {
			if(!desktop || !curLocation) return this.next();

			if(req.query.url != curLocation.href) {
				curLocation.href = req.query.url;
				desktop.browsers.open(browser, version, req.query.url, true);
			}

			this.next();
		},

		/**
		 */

		'pull -http check/location -> get/desktop -> view -> live/:browser/:version': function(req, res) {

			desktop = req.sanitized.desktop;
			browser = req.params.browser;
			version = req.params.version;
			var url = req.query.url || 'http://google.com';


			req.addRootView(new views.LiveIndexView({ desktop: desktop, 
				browser: browser, 
				version: version,
				url:  url}));


			desktop.browsers.open(browser, version, url, true);

			desktop.browsers.on('locationChange', function(location) {

				curLocation = location;

				router.push('redirect', { path: window.location.pathname, query: _.extend({}, req.query, { url: location.href } ) });
			});

			if(!this.next()) {
				req.display();
			}
		}
	});
}