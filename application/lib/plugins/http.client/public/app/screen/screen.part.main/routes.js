qs = require("querystring"),
_  = require("underscore");

exports.plugin = function(puppeteer, router, loader) {

	router.on({

		"index /": {
			connectOutlets: function(router, content) {

				var query   = qs.parse(window.location.search.substr(1)),
				app         = window.location.pathname.match(/app\/([^\/?#]+)/)[1].replace(/[-_]/g, " ");
				content.app = app;

				//window provided? 
				if(query.window) {
					router.get("applicationController").connectOutlet("screen", {
						window: query.window //window id
					})
				} else {
					router.get("applicationController").connectOutlet("screens", { app: app, 
						open: query.open || query.url, 
						puppeteer: puppeteer });
				}
			}
		}
	})
}