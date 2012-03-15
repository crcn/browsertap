exports.plugin = function(router) {

	router.on({


		/**
		 */

		'pull root/view': function(req, res) {
			res.end(router.views.View);
		}
	})
}