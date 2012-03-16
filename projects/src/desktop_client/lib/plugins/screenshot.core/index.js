var step = require('step'),
request  = require('request'),
vine     = require('vine'),
fs       = require('fs')

exports.plugin = function(router) {

	var sprite;

	router.on({

		/**
		 */

		'push -pull sprite': function(spr) {
			sprite = spr;
		},


		/**
		 */

		'pull -method=GET /screenshot/:browser/:version': function(req, res) {
				
			if(!req.query.url) return vine.error(new Error("Url not present")).end(res);


			step(

				/**
				 */

				function() {
					sprite.snap(req.query.url, req.params.browser+" "+req.params.version, this);
				},

				/**
				 */

				res.success(function(screenshot) {
					fs.createReadStream(screenshot.path).pipe(res);
				})


				/**
				 */

			);


		}
	})
}