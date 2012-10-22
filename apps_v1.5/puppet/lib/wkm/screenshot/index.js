var structr = require("structr"),
step        = require("step"),
mkdirp      = require("mkdirp"),
path        = require("path"),
exec        = require("child_process").exec;

module.exports = structr({

	/**
	 */

	"__construct": function(puppet) {
		this.puppet = puppet;
	},

	/**
	 */

	"step snapUrl": function(url, browser, callback) {

		var self = this;

		this.puppet.browsers.open(url, browser, function(err, process) {
			
			process.on("client", function() {
				self._snap(function(err, result) {
					process.close(function() {
						callback(err, result);
					});
				});
			});
		});
	},

	/**
	 */

	"step snap": function(callback) {
		this._snap(callback);
	},

	/**
	 */

	"_snap": function(next) {

		var imgPath = (process.env.HOME + "/Desktop/screenshots/" + Date.now() + "_" + (Math.round(Math.random() * 99999)) + ".png").replace(/\/+/g,'\\');

		step(
			function() {
				mkdirp(path.dirname(imgPath), 0777, this);
			},
			function() {
				exec(__dirname + "/nircmdc.exe savescreenshot " + imgPath, this);
			},
			function(err) {
				//if(err) console.error(err)
				//if(err) return next(err);
				next(null, {
					path: imgPath
				});
			}
		);
	}
});