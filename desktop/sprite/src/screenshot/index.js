var structr = require('structr'),
seq         = require("seq"),
exec        = require("child_process").exec,
mkdirp      = require("mkdirp");




module.exports = structr({


	/**
	 */

	'__construct': function(controller) {

		this._controller = controller;

	},

	/**
	 */

	'snap': function(url, browsers) {

		var self = this;
		var controller = self._controller;
		var snap = browsers || this._controller._processes.keys,
		imgDir   = process.env.home + "/Desktop/screenshots/" + Date.now() + "_" + (Math.round(Math.random() * 99999));

		mkdirp(imgDir, function() {

			var snapped = {};

			seq(snap).
			seqEach(function(browser) {

				var next = this;

				controller.start(browser, url, function(err) {

					controller.once("browserProxy", function(proxy) {

						var path = imgDir + "/" + browser.replace(/\s+/g,'-') + ".png";

						exec("nircmdc.exe savescreenshot " + path, { cwd: __dirname }, function() {

							controller.emit("screenshot", {
								url: url,
								browser: browser,
								path: path
							});

							next();
						});
					});
				});

			}, function() {

			});

		})
		

	}
});