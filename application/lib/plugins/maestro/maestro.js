var structr = require("structr"),
async = require("async")
Puppeteer = require("./puppeteer"),
logger = require("winston").loggers.get("maestro");

module.exports = structr({

	/**
	 */

	"publicKeys": ["getAvailablePuppeteer", "authToken"],

	/**
	 */

	"__construct": function(puppeteers) {

		var self = this;

		this._puppeteers = puppeteers.map(function(host) {
			return new Puppeteer(host, self)
		});
	},

	/**
	 */

	"getAvailablePuppeteer": function(callback) {
		var connected = this._puppeteers.filter(function(puppeteer) {
			return puppeteer.connected;
		});

		async.filter(connected, function(puppeteer, next) {
			puppeteer.remote.isBusy(function(err, no) {
				next(!err && !no);
			});
		}, function(available) {

			//TODO - allocate shit here.
			if(!available.length) return callback(new Error("all servers are taken up"));

			//TODO - do something with token
			callback(null, { token: Date.now(), host: available.pop().host });
		});
	},

	/**
	 */

	"createToken": function(puppeteer) {
		return { key: Date.now() + "_" + Math.round(Math.random() * 999999), guid: puppeteer.guid };
	},


	/**
	 */

	"authToken": function(token, callback) {
		logger.info("authorizing token...");
		callback();
	}
});