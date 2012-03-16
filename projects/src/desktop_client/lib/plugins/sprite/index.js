var sprite   = require('../../sprite');

exports.plugin = function(router, params) {

	var app;

	router.on({

		/**
		 */

		'pull load/+': function(req, res) {

			app = sprite.create({
				directory: params.directory || "~/Desktop/browsers",
				cache: {
					prefix: '~/AppData/Local',
					directories: {
						'firefox': '/Mozilla',
						'chrome': '/Google/Chrome/User Data',
						'safari': '/Apple Computer',
						'opera': '/Opera',
						'ie': '/Microsoft/Internet Explorer'
					}
				}
			}).
			listen(8088);


			router.on('pull sprite', function(req, res) {
				res.end(app);
			});

			router.push('sprite', app);

			this.next();
		}
	})
}