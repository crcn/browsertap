var outcome = require("outcome"),
step = require("step"),
fs = require("fs"),
path = require("path"),
async = require("async"),
App = require("./app"),
_ = require("underscore"),
capirona = require("capirona"),
walkr = require("walkr");



module.exports = function(directory, callback) {

	var on = outcome.error(callback),
	directory = directory.replace("~", process.env.HOME || process.env.HOMEPATH),
	cap = capirona.run("load", __dirname + "/tasks");

	step(

		/**
		 */

		function() {
			fs.readdir(directory, this);
		},

		/**
		 */

		on.success(function(dirs) {

			var noInfo = dirs.filter(function(name) {
				return name != "info.json";
			});
			async.map(fixPaths(directory, noInfo), loadApp, this);
		}),

		/**
		 */

		on.success(function(apps) {
			this.apps = Array.prototype.concat.apply([], apps);

			var req = this.modifiers = [];


			walkr(directory).
			filterFile(function(options, next) {
				if(options.source.match(/info.json$/)) {
					req.push(require(options.source));
				}
				next();
			}).
			start(this);
		}),


		/**
		 */

		on.success(function(apps) {

			//does it have set right off the bat? then it's
			//a default info item
			this.modifiers.sort(function(a, b) {
				return a.set ? -1 : 1;
			});

			var modifiers = this.modifiers;

			async.forEach(this.apps, function(app, next) {
				cap.run(modifiers, app, next);
			}, this);
		}),

		/**
		 */

		on.success(function() {

			var apps = this.apps.map(function(app) {
				// return new App(app); TODO
				return app;
			});

			this(null, apps);
		}),

		/**
		 */

		callback
	)
}


function loadApp(directory, callback) {

	var on   = outcome.error(callback);

	step(

		/**
		 */

		function() {
			fs.readdir(directory, this);
		},

		/**
		 */

		on.success(function(executables) {

			var fixedPaths = fixPaths(directory, executables.filter(function(name) {
				return name != "info.json";
			})).
			map(mapAppVersions);

			this(null, fixedPaths);
		}),

		/**
		 */

		callback
	)
}

function mapAppVersions(fullPath, next) {

	version   = path.basename(fullPath).replace(/\.\w+$/g,''), //5
	realpath  = path.normalize(fullPath), //path/firefox/5.lnk
	directory = path.dirname(realpath), //path/firefox
	name      = path.basename(directory); //firefox


	return {
		name: name,
		version: version,
		path: realpath,
		filename: path.basename(realpath),
		directory: directory,
	};
}



function fixPaths(parent, paths) {
	return paths.filter(function(dir) {
		return dir.substr(0, 1) !== "."
	}).
	map(function(dir) {
		return path.normalize(parent + "/" + dir);
	});
}

module.exports(__dirname + "/browsers", function(err, apps) {
	console.log(apps)
})