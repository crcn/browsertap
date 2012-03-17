var structr  = require('structr'),
EventEmitter = require('events').EventEmitter,
spawn        = require("child_process").spawn,
Browser      = require("./browser");

var fs = require('fs');


module.exports = structr(EventEmitter, {

	/**
	 */

	'override __construct': function(browsers, params, proxy) {

		this._browsers = {};
		this._available = {};

		for(var name in browsers) {
			this._browsers[name] = new Browser(browsers[name], params, proxy);

			var nameParts = name.split(' '),
			version = nameParts.pop(),
			browser = nameParts.join(' ');


			if(!this._available[browser]) {
				this._available[browser] = {};
			}

			this._available[browser][version] = {
				key: name //key for launching 
			};
		}

		this._currentBrowser;

		this.keys = Object.keys(this._browsers);

		this._super();
	},

	/**
	 */

	/*'killPrevious': function() {

		//already a browser up? close it.
		if(this._currentBrowser) this._currentBrowser.kill();
		this._currentBrowser = null;

	},*/

	/**
	 */

	'start': function(browserName, url, next) {

		var browser = this._browsers[browserName];

		//browser doesn't exist? ERROR
		if(!browser) return next(new Error("browser does not exist"));

		//this.killPrevious();
		//this._currentBrowser = browser;

		browser.start(url, function() {

			next(null, browser);

		});

	},

	/**
	 */

	'getAvailableBrowsers': function(next) {

		next(null, this._available);

	}

});



