qs = require("querystring"),
_  = require("underscore");



exports.plugin = function(commands, puppeteer, router, loader) {
	var query   = qs.parse(window.location.search.substr(1));

	return;
	//window provided? 
	if(query.host) {
		router.get("applicationController").connectOutlet("screen", {
			puppeteer: puppeteer,
			screen: query.screen //window id
		})
	} else {
		router.get("applicationController").connectOutlet("screens", { app: query.app || "chrome 19", 
			open: query.open || query.url, 
			puppeteer: puppeteer,
			commands: commands });
	}
	
}