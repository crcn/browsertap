exports.plugin = function(router) {
	router.on({
		"loadBrowser": {
			connectOutlets: function(router, context, next) {
				console.log(context)
				next();
			}
		},
		"-name=browser loadBrowser -> /browser/:name/:version": {
			connectOutlets: function(router, context) {
				console.log(context)
				router.get("applicationController").connectOutlet("app");
				console.log(router.get("context"))
			}
		}
	})
}