var vine = require('vine'),
path     = require('path'),
step     = require('step'),
outcome  = require('outcome');

exports.plugin = function(router) {

	var ScreenShot;

	router.on({

		/**
		 */

		'push mongodb': function(db) {
			var m = require('./models')(db);
			ScreenShot = m.ScreenShot;
		},

		/**
		 */

		'pull -hook -method=GET /screenshot/:browser/:version': function(req, res) {

			var browser = req.params.browser,
			version     = req.params.version,
			url         = req.query.url,
			hash        = req.query.hash || '1', //cache hash
			_id         = [url, browser, version, hash].join('|');




			step(

				/**
				 */

				function() {


					ScreenShot.findOne({ screenshotId: _id }, this);
				},

				/**
				 */

				res.success(function(ss) {

					if(!ss) {
						ss = new ScreenShot({
							screenshotId: _id,
							browser: browser,
							version: version,
							url: url
						});

						var nx = this;
						ss.save(res.success(function() {
							router.push('thyme/job', { path: 'take/screenshot', data: ss, queue: 'desktop_client' });
							nx(null, ss);
						}));

					} else {
						this(null, ss);
					}

					this(null, ss);
				}),

				/**
				 */

				res.success(function(ss) {

					vine.result(ss).end(res);

				})
			);

		},

		/**
		 */

		'push -hook add/screenshot': function(query) {
			
			var on = outcome.error(function(err) 
			{
				console.error(err);
			});		

			step(	

				/**
				 */

				function() {
					ScreenShot.findOne({ screenshotId: query.screenshotId }, this);
				},

				/**
				 */

				on.success(function(ss) {
					if(!ss) return console.error('screenshot %s does NOT exist!', query._id);

					ss.error = query.error;
					ss.screenshot = query.url;
					ss.status = query.error ? 'error' : 'complete';

					ss.save(this);

				}),

				/**
				 */

				on.success(function() {

				})
			)
			console.log(query)

			res.end();
		}
	})
}