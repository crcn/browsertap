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

		'pull -hook take/screenshot': function(req, res) {

			console.log(req.query);
		},

		/**
		 */

		'pull -hook take/screenshot': function(req, res) {

			var browser = req.query.browser,
			version     = req.query.version,
			url         = req.query.url;

			console.log('taking screenshot...');


				
			step(

				/**
				 */

				function() {
					sprite.snap(url, browser+" "+version, this);
				},

				/**
				 */

				res.success(function(screenshot) {
					// fs.createReadStream(screenshot.path).pipe(res);

					//res.request('send/file')

					// router.request('add/screenshot').pull();

					var next = this;

					router.request('store/file', {
						path: screenshot.path,
						savePath: 'ss_' + browser + '_' + version + '_' + Date.now() + '_' + Math.round(Math.random() + 9999) + '.png' 
					}).
					error(function(err) {
						req.query.error = err.message;
						next();
					}).
					success(function(response) {
						req.query.url = response.url;
						next();
					}).
					pull();

				}),


				/**
				 */

				function() {

					router.push('add/screenshot', req.query);

					res.end();
				}

			);


		}
	})
}