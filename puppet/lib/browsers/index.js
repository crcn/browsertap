var structr = require("structr"),
step = require("step"),
loadBrowsers = require("./loadBrowsers"),
sift = require("sift"),
_ = require("underscore"),
outcome = require("outcome"),
async = require("async"),
killProcesses = require("./browser/killProcesses");

module.exports = structr({

	/**
	 */

	"publicKeys": ["open", "getAll", "killAll"],

	/**
	 */

	"__construct": function(puppet, options) {
		this.puppet     = puppet;
		this._options   = options;
		this._directory = options.directory;
		this._load();
	},

	/**
	 * opens a live instance of the browser
	 */

	"step open": function(url, browser, callback) {

		var query = {};

		if(typeof browser == "string") {
			var parts = browser.toLowerCase().split(" ");
			query = { name: parts[0], version: parts[1] };
		} else {
			query = browser;
		}


		var avail = sift(query, this._browsers).pop();
		if(!avail) return callback(new Error("browser does not exist"));

		this.killAll(function() {
			//open the browser
			avail.open(url, callback);
		})
	},

	/**
	 */

	"getAll": function(callback) {
		callback(null, this._browsers);
	},

	/**
	 */

	"step killAll": function(callback) {
		killProcesses(this._processNames, callback);
	},

	/**
	 * loads the browsers from disc
	 */

	"step _load": function(onLoad) {
		var self = this;
		loadBrowsers(_.extend({
			collection: this
		}, this._options), outcome.success(function(browsers) {
			self._browsers = browsers;
			self._processNames = _.uniq(Array.prototype.concat.apply([], browsers.map(function(browser) {
				return browser.processNames || [];
			})));
			onLoad();
		}));
	}
});

