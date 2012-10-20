var sprite   = require('../../sprite');

exports.plugin = function(router, params) {

	var app;

	router.on({

		/**
		 */

		'pull load/+': function(req, res) {

			router.sprite = app = sprite.create({
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
				},
				processNames: {
					'firefox': ['firefox*'],
					'chrome': ['chrome*'],
					'safari': ['safari*'],
					'opera': ['opera*'],
					'ie': ['iexplore*']
				},
				padding: {
					"chrome": {
						19: {
							top: 61
						},
						5: {
							top: 63
						}
					},
					"firefox": {
						12: {
							top: 87
						},
						3.6: { 
							top: 135
						},
						3: {
							top: 106
						}
					},
					"safari": {
						6: {
							top: 80
						}
					},
					"opera": {
						12: {
							top: 80
						}
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