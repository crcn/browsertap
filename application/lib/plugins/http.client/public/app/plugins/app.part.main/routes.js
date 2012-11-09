exports.plugin = function(router) {
	router.on({
		"-name=app /app": {
			connectOutlets: function(router) {
				router.get("applicationController").connectOutlet("app");
			}
		}
	})
}