var outcome = require("outcome"),
step = require("step"),
fs = require("fs"),
path = require("path"),
async = require("async"),
Browser = require("./browser"),
_ = require("underscore");



module.exports = function(options, callback) {

	var on = outcome.error(callback),
	directory = options.directory.replace("~", process.env.HOME);
	options.cache.prefix = options.cache.prefix.replace("~", process.env.HOME);

	step(

		/**
		 */

		function() {
			fs.readdir(directory, this);
		},

		/**
		 */

		on.success(function(dirs) {
			async.map(fixPaths(directory, dirs).map(function(dir) {
				return {
					directory: dir,
					options: options
				};
			}), loadBrowser, this);
		}),

		/**
		 */

		on.success(function(browsers) {
			var toObj = {}

			//flatten
			browsers = Array.prototype.concat.apply([], browsers);

			callback(null, browsers);
		})
	)
}


function loadBrowser(options, callback) {

	var directory = options.directory,
	allOps        = options.options;

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
				version.name = name;
				version.collection = allOps.collection;
				attachSettings(version, allOps);
				return new Browser(version);
			});

			this(null, browsers);
		}),

		/**
		 */

		callback
	)
}


function attachSettings(browser, options, names) {

	var ops = options[browser.name];

	if(!ops) return;


	browser.padding = findPadding(browser, ops.padding)
	browser.processNames = ops.processNames;
	browser.cache = _.extend({}, ops.cache);
	browser.cache.directory = [options.cache.prefix, ops.cache.directory].join("").replace(/\//g, "\\");
}

function findPadding(browser, options) {
	for(var v in options) {
		if(Number(v) <= Number(browser.version)) return options[v];
	}
	return {};
}

function mapBrowserVersions(executable, next) {

	var version = path.basename(executable).replace(/\.\w+$/g,'');
	
	var realpath = path.normalize(executable);


	var on = outcome.error(next),
	exe = path.basename(realpath);



	next(null, {
		version: version,
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