
var server    = require("./proxy/server"),
EventEmitter  = require("events").EventEmitter,
loadDirectory = require("./load/loadDirectory"),
tq            = require("tq"),
structr       = require("structr"),
step          = require("stepc"),
ProcessCollection = require('./process/collection'),
outcome       = require("outcome"),
Screenshot    = require("./screenshot");


module.exports = structr(EventEmitter, {

	/**
	 */

	"override __construct": function() {

		this._super();

		this._tq = tq.queue();
		this._tq.start();

		var self = this;

		self._screenshot = new Screenshot(this);

		this._on = outcome.error(function(err) {
			self.emit("error", err);
		})

	},

	/**
	 */

	"config": function(config) {

		var self = this;


		this._tq.push(function() {

			var next = this;

			loadDirectory(config.directory, self._on.success(function(browsers) {
				self._processes = new ProcessCollection(browsers, config, self);
				next();
			}));

		});

		return this;
	},

	/**
	 */

	"getAvailableBrowsers": function(next) {
		self = this;
		this._tq.push(function() {
			self._processes.getAvailableBrowsers(next);
			this();
		})
	},

	/**
	 */

	"listen": function(port) {

		var em = server.listen(port),
		self   = this;

		em.on("browserProxy", function(proxy) {

			self.emit("browserProxy", proxy);

		});

		return this;
	},

	/**
	 */

	"start": function(browser, url, callback) {

		var self = this;


		this._tq.push(function() {	


			var next = this;

			self._processes.start(browser, url, function(err, browser) {

				next();

				if(callback) callback(err, browser);
			});

		});
	},


	/**
	 */


	"snap": function(url, browsers, next) {


		var self = this;

		this._tq.push(function() {

			self._screenshot.snap(url, browsers, next);

			this();
		})
	}
})

