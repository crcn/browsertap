qs = require("querystring"),
_  = require("underscore");

exports.plugin = function(puppeteer, router, loader) {

	router.on({

		/**
		 */

		"launchApp launchApp": {
			connectOutlets: function(router, content, next) {
				var query   = qs.parse(window.location.search.substr(1)),
				app         = window.location.pathname.match(/app\/([^\/?#]+)/)[1].replace(/[-_]/g, " ");
				content.app = app;


				router.get("applicationController").connectOutlet("screen", { app: app, open: query.open || query.url, puppeteer: puppeteer });
			}
		},

		"index launchApp -> /": {
			connectOutlets: function(router) {


			}
		}
	})
}