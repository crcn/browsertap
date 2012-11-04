var structr = require("structr"),
Process     = require("./process"),
outcome = require("outcome");

module.exports = structr({

	/**
	 */

	"__construct": function(options) {
		this._options = options;

		//name of the browser ~ firefox, chrome, ie
		this.name     = options.name.toLowerCase();

		//version of the browser
		this.version  = options.version;

		//path to the executable
		this.path     = options.path;	

		//padding info for 
		this.padding = options.padding;

		//cache information for purging
		this.cache = options.cache;

		//used for killing a process
		this.processNames = options.processNames;	

		this.collection = options.collection;
		this.puppet = options.collection.puppet;
	},

	/**
	 */

	"step open": function(url, callback) {
		var self = this;
		this.__process().open(url, outcome.error(callback).success(function() {
			callback(null, {
				getClient: function(callback) {
					self.getClient(callback);
				}
			});
		}));
	},

	/**
	 */

	"getClient": function(callback) {
		this.__process().getClient(callback);
	},

	/**
	 */

	"__process": function() {
		return this._process || (this._process = new Process(this));
	},

	/**
	 */

	"step close": function(callback) {
		if(!this._process) return callback(null, true);
		this._process.close(callback);
	}
});