var structr = require('structr'),
seq         = require("seq"),
exec        = require("child_process").exec,
mkdirp      = require("mkdirp"),
tq          = require('tq'),
step        = require('step'),
outcome     = require('outcome'),
path        = require('path'),
fs          = require('fs');




module.exports = structr({


	/**
	 */

	'__construct': function(controller) {

		this._controller = controller;
		this._snapping   = {};
		this._queues     = {};

	},


	/**
	 */

	'snap': function(url, browser, next) {


		if(!this._hasBrowser(browser)) return next(new Error('browser does not exist'));



		this._queue('all').addJob(url, browser, next);

	},


	/**
	 */

	'_hasBrowser': function(browser) {

		return !!this._controller._processes._browsers[browser];
	},


	/**
	 */

	'_queue': function(browserName) {

		return this._queues[browserName] || (this._queues[browserName] = new SnapQueue(this, browserName));

	}
});



var SnapQueue = structr({

	/**
	 */

	'__construct': function(snapper, queueName) {
		this._snapper = snapper;
		this._controller = snapper._controller;
		this._queueName = queueName;
		this._tq = tq.queue().start();
	},

	/**
	 */

	'addJob': function(url, fullName, next) {

		var self = this,
		controller = this._controller,
		on = outcome.error(next),
		imgPath = process.env.HOME + "/Desktop/screenshots/" + Date.now() + "_" + (Math.round(Math.random() * 99999)) + ".png";

		this._tq.push(function() {

			var queueDone = this, completed = false;


			var killTimeout = setTimeout(function() {
				onComplete(new Error("Timeout"));
			}, 1000 * 15);

			function onComplete(err, result) {
				if(completed) return;
				completed = true;

				clearTimeout(killTimeout);
				queueDone();
				next(err, result);
			}

			step(


				/**
				 */

				function() {
					controller.start(fullName, url, this);

				},


				/**
				 */

				on.success(function(process) {

					this.process = process;

					process.once('browserProxy', this);

				}),


				/**
				 */

				function() {

					mkdirp(path.dirname(imgPath), 0777, this);

				},

				/**
				 */

				function() {

					this.process.screenshot(imgPath);

					var next = this;
					var interval = setInterval(function() {

						try {
							fs.lstatSync(imgPath);
							clearInterval(interval);
							next();
						} catch(e) {

						}

					}, 200);
				},


				/**
				 */

				function() {

					if(!this.process.running) return this();

					this.process.kill(this);

				},

				/**
				 */

				function() {

					console.log('finished snapping ' + fullName)

					if(completed) return;

					onComplete(null, {
						path: imgPath
					});
				}

			);


		});
	}
})