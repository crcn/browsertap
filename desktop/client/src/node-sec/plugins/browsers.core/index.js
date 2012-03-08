var path     = require('path'),
fs           = require('fs'),
loadBrowsers = require('./loadBrowsers'),
sprintf      = require('sprintf').sprintf,
step         = require('step');

exports.plugin = function(router) {

	var params  = this.params(),
	browserDir  = params.browsersDir.replace('~', process.env.HOME),
	allBrowsers = {};


	router.on({

		/**
		 */

		'pull load/+': function(req, res, mw) {


			step(

				/**
				 */

				function() {

					console.log('loading browsers from directory: %s', browserDir);

					loadBrowsers(browserDir, this);
				},

				/**
				 */

				res.success(function(browsers) {

					allBrowsers = browsers;

					console.log('collecting browser info from plugins');

					router.request('browser/info').
					response(res.success(function(info) {

						

					})).
					collect();
				})
			)

			
		}
	})
}