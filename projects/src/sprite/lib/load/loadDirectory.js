var outcome = require("outcome"),
step = require("stepc"),
fs = require("fs"),
path = require("path"),
async = require("async");



module.exports = function(directory, callback) {

	var on = outcome.error(callback),
	directory = directory.replace("~", process.env.HOME);

	step(

		/**
		 */

		function() {
			fs.readdir(directory, this);
		},

		/**
		 */

		on.success(function(dirs) {
			async.map(fixPaths(directory, dirs), loadBrowser, this);
		}),

		/**
		 */

		on.success(function(browsers) {
			var toObj = {}

			//flatten
			browsers = Array.prototype.concat.apply([], browsers);


			browsers.forEach(function(browser, index) {
				toObj[browser.name.toLowerCase()] = browser;
			});

			callback(null, toObj);
		})
	)
}


function loadBrowser(directory, callback) {

	var on   = outcome.error(callback),
	name     = path.basename(directory), 
	browsers = [];

	step(

		/**
		 */

		function() {
			fs.readdir(directory, this);
		},

		/**
		 */

		on.success(function(executables) {
			async.map(fixPaths(directory, executables), mapBrowserVersions, this);
		}),

		/**
		 */

		on.success(function(versions) {

			browsers = versions.map(function(version) {
				version.name = name + " " + version.name;
				return version;
			});

			this(null, browsers);
		}),

		/**
		 */

		callback
	)
}

function mapBrowserVersions(executable, next) {

	var name = path.basename(executable).replace(/\.\w+/g,'');

	//use mklink for windows
	var link = fs.readlinkSync(executable);

	//relative vs abs path?
	if(link.indexOf('.') == 0) {
		link = path.dirname(executable) + "/" + link;
	}
	
	var realpath = path.normalize(link);



	var on = outcome.error(next),
	exe = path.basename(realpath);



	next(null, {
		name: name,
		cwd: path.dirname(realpath),
		filename: exe,
		path: realpath
	})
}



function fixPaths(parent, paths) {
	return paths.filter(function(dir) {
		return dir.substr(0, 1) !== "."
	}).
	map(function(dir) {
		return path.normalize(parent + "/" + dir);
	})
}