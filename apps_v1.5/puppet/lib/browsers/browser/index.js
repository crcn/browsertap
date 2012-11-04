var structr = require("structr"),
Process     = require("./process"),
outcome = require("outcome"),
dsync   = require("dsync")

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
		this._process = new Process(this);
	},

	/**
	 */

	"step open": function(url, callback) {
		var self = this;
		this._process.open(url, outcome.error(callback).success(function() {
			callback(null, dsync(self));
		}));
	},

	/**
	 */

	"getClient": function(callback) {
		this._process.getClient(callback);
	},

	/**
	 */

	"step close": function(callback) {
		this._process.close(callback);
	}
});