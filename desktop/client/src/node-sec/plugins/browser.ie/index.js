exports.plugin = function(router) {


	router.on({


		'collect browser/info': function(req, res) {

			res.end({
				name: 'Internet Explorer',
				folder: 'ie',
				padding: {
					
				}
			})
		}
	})
}