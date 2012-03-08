var outcome = require('outcome'),
step        = require('step'),
fs          = require('fs'),
path        = require('path'),
async       = require('async');

module.exports = function(directory, callback) {

	var on = outcome.error(callback);

	step(

		/**
		 * read
		 */

		function() {

			fs.readdir(directory, this);

		},


		/**
		 * map
		 */

		on.success(function(dirs) {

			var browsers = {};

			async.map(fixPaths(directory, dirs), loadBrowser, this);

		}),

		/**
		 */

		 on.success(function(browsers) {

		 	var toObj = {};

		 	browsers.forEach(function(browser) {

		 		toObj[browser.name.toLowerCase()] = browser;

		 	});


		 	callback(null, toObj);
		 })





	);
}



function loadBrowser(directory, callback) {

	var on       = outcome.error(callback),
	browser      = {
		name: path.basename(directory),
		executables: []
	};

	browser.name = path.basename(directory);

	step(

		/**
		 */


		function() {

			fs.readdir(directory, this);

		},

		/**
		 */

		on.success(function(executables) {

			browser.executables = fixPaths(directory, executables);

			this(null, browser);
		}),

		/**
		 */


		callback


	);
}


function fixPaths(parent, paths) {

	return paths.filter(function(dir) {
		return parent.substr(0, 1) != '.'; //no hidden
	}).
	map(function(dir) {
		return path.normalize(parent + "/" + dir);
	});

}