exports.plugin = function(router) {
	router.on({

		/**
		 */

		"-name=index /": {
			connectOutlets: function(router) {
				router.get("applicationController").connectOutlet("home");
			},
			doHome: function(router) {
				router.transitionTo("home");
			}
		},

		/**
		 */

		"-name=home /app": {
			connectOutlets: function(router) {
				
			}
		}
	});
}