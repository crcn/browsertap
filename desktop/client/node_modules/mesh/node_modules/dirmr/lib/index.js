var seq = require("seq"),
walkr   = require("walkr"),
fs      = require("fs"),
_       = require("underscore"),
path    = require("path"),
mkdirp  = require("mkdirp"),
structr = require("structr");


module.exports = function(_dirs) {
	
	var _self = {}, 
	_walkr    = walkr(), 
	_seq      = seq(),
	_onComplete,
	_targetDirs = _dirs || [];


	_walkr.filter(walkr.copy, -999);

	/**
	 */

	_self.filterFile = function(search, callback, priority) {

		_walkr.filterFile(search, callback, priority);
		return _self;

	};

	/**
	 */

	_self.filterDir = function(search, callback, priority) {

		_walkr.filterDir(search, callback, priority);
		return _self;

	};

	/**
	 */

	_self.filter = function(search, callback, priority) {

		_walkr.filter(search, callback, priority);
		return _self;

	};


	/**
	 */

	_self.readdir = function(source, filter) {

		_seq.seq(function() {	

			fs.readdir(source, this);

		}).
		seq(function(dirs) {

			dirs = filter ? dirs.filter(_tester(filter)) : dirs;

			for(var i = dirs.length; i--;) {

				_targetDirs.push(source + "/" + dirs[i]);

			}


			this();

		}).
		catch(onComplete);


		return _self;
	};

	/**
	 */

	_self.clear = function() {
		
		_targetDirs = [];

		return _self;
	}

	/**
	 */

	_self.sort = function(callback) {
		
		_seq.seq(function() {
			
			_targetDirs = _targetDirs.sort(callback);

			this();

		});

		return _self;
			
	};

	/**
	 */

	_self.join = function(destination) {

		
		copyDirs(destination, function(dir) {

			_walkr.start(dir, destination, this);

		});
		
		return _self;
	};

	/**
	 */

	_self.mapDir = function(fn) {

		_seq.seq(function() {

			var next = this;

			seq(_targetDirs).
			seqMap(function(dir) {
				fn(dir, this);
			}).
			seq(function() {
				_targetDirs = Array.prototype.slice.call(arguments);

				next();
			}).
			catch(onComplete);
		});

		return _self;
	};

	/**
	 */

	_self.copyEach = function(destination) {


		copyDirs(destination, function(dir) {

			_walkr.start(dir, destination + "/" + path.basename(dir), this);

		});
		

		return _self;
	};

	/**
	 */

	_self.complete = function(callback) {

		_onComplete = callback;

		_seq.seq(onComplete);

		return _self;

	};

	/**
	 */

	function copyDirs(destination, fn) {

		mkdir(destination);
		
		return eachDir(fn);
	}

	/**
	 */

	function eachDir(fn) {

		_seq.seq(function() {


			var next = this;

			seq(_targetDirs).
			seqEach(fn).
			seq(function() {

				next();
				
			}).
			catch(onComplete)

		});

		return _self;

	}


	/**
	 */


	function onComplete(err, result) {

		if(_onComplete) {
			_onComplete(err, result);
			_onComplete = undefined;
		}

	}

	/**
	 */

	function mkdir(destination) {
		
		_seq.seq(function() {

			var next = this;


			mkdirp(destination, 0777, function(err) {

				next();	

			});

		});

	}

	/**
	 */

	function _tester(filter) {

		if(filter instanceof RegExp) {

			return function(item) {

				return filter.test(item);

			};

		} else {

			return filter;

		}

	}

	return _self;
}



module.exports.mergeJSON     =  walkr.mergeJSON;
module.exports.parseTemplate = walkr.parseTemplate;






/*module.exports().
readdir("/Users/craig/Dropbox/Developer/Public/mesh.js/examples/node+web/src").
filterFile(/\.merge\.json/, module.exports.mergeJSON('.json', {name:'craig'})).
filterFile(module.exports.parseTemplate({name:'craig'})).
join("/Users/craig/Dropbox/Developer/Public/mesh.js/examples/node+web/lib").
complete(function() {
	console.log("DONE")
})*/
