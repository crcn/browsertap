var __app = (function(){
	var _sardines = (function()
{
	var nodeRequire,
	allFiles = {};

	var moduleDoesntExist = function(path)
	{
		throw new Error('Module '+ path + ' does not exist');
	}


	if(typeof require == 'undefined')
	{
		nodeRequire = function(path)
		{
			moduleDoesntExist(path);
		}


		nodeRequire.resolve = moduleDoesntExist;
	}
	else
	{
		nodeRequire = require;
	}

	var register = function(path, moduleFactory)
	{

		path = normalizePath(path);
		addPathToTree(path);

		_sardines.moduleFactories[path] = moduleFactory,
		dir = dirname(path);

		return moduleFactory;
	}

	var addPathToTree = function(path) {

		var curTree = allFiles, prevTree = allFiles,
		parts = path.split('/'),
		part;

		for(var i = 0, n = parts.length; i < n; i++) {
			part = parts[i];
			if(!curTree[part]) curTree[part] = { };
			curTree = curTree[part];
		}
	}

	var dirname = function(path)
	{
		var pathParts = path.split('/');
		pathParts.pop();
		return pathParts.join('/');
	}



	var req = function(path, cwd)
	{
		var fullPath = req.resolve(path, cwd ? cwd : '/');

		if(_sardines.modules[fullPath]) return _sardines.modules[fullPath];

		var factory = _sardines.moduleFactories[fullPath];

		if(!factory)
		{
			//could be a core function - try it.
			if(typeof require != 'undefined') return nodeRequire(path);

			moduleDoesntExist(fullPath);
		}

		var module = { exports: { } };

		var cwd = fullPath.match(/\.js$/) ? dirname(fullPath) : fullPath,
		modRequire = function(path)
		{
			return req(path, cwd);
		}

		modRequire.resolve = req.resolve;
		modRequire.paths = [];

		factory(modRequire, module, module.exports, cwd, fullPath);

		return _sardines.modules[fullPath] = module.exports;
	}

	function normalizeArray(v, keepBlanks) {
		var L = v.length,
		dst = new Array(L),
		dsti = 0,
		i = 0,
		part, negatives = 0,
		isRelative = (L && v[0] !== '');
		for (; i < L; ++i) {
			part = v[i];
			if (part === '..') {
				if (dsti > 1) {
					--dsti;
				} else if (isRelative) {
					++negatives;
				} else {
					dst[0] = '';
				}
			} else if (part !== '.' && (dsti === 0 || keepBlanks || part !== '')) {
				dst[dsti++] = part;
			}
		}
		if (negatives) {
			dst[--negatives] = dst[dsti - 1];
			dsti = negatives + 1;
			while (negatives--) {
				dst[negatives] = '..';
			}
		}
		dst.length = dsti;
		return dst;
	}

	function normalizePath(path) {
		return normalizeArray(path.split("/"), false).join("/");
	}

	function relateToAbsPath(path, cwd)
	{
		//root
		if(path.substr(0, 1) == '/') return path;

		//relative
		if(path.substr(0, 1) == '.') return cwd + '/' + path;

		return path;
	}

	function findModulePath(path)
	{
		var tryPaths = [path, path + '/index.js', path + '.js'],
		modulePaths = ['modules',''];


		for(var j = modulePaths.length; j--;)
		{
			for(var i = tryPaths.length; i--;)
			{
				var fullPath = normalizePath('/'+modulePaths[j]+'/'+tryPaths[i]);
				
				if(_sardines.moduleFactories[fullPath]) return fullPath;
			}
		}		
	}

	req.resolve = function(path, cwd)
	{
		return findModulePath(normalizePath(relateToAbsPath(path, cwd))) || nodeRequire.resolve(path);
	}

	return {
		allFiles: allFiles,
		moduleFactories: { },
		modules: { },
		require: req,
		register: register
	}
})();

_sardines.register("/modules/edd6af44/src/index.js", function(require, module, exports, __dirname, __filename) {
	var main = require('./main');

$(document).ready(function() {
	main.router.push('init');
});

});
_sardines.register("/modules/edd6af44/src/main.js", function(require, module, exports, __dirname, __filename) {
	
var beanpoll = require('beanpoll'),
haba         = require('haba'),
router       = beanpoll.router();


pluginLoader = haba.loader();

pluginLoader.
options(router).
paths(__dirname + "/node_modules").
params({
	publicDir: __dirname + "/../web"
}).
require(__dirname + "/plugins").
require('fig').
require('mesh-http').
load();

exports.router = router;



});
_sardines.register("/modules/beanpoll/lib/index.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Router;

  Router = require("./router");

  exports.Messenger = require("./concrete/messenger");

  exports.Director = require("./concrete/director");

  exports.Message = require("./message");

  exports.Response = require("./concrete/response");

  exports.router = function() {
    return new Router();
  };

}).call(this);

});

_sardines.register("/modules/beanpoll", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/beanpoll/lib/index.js');
});
_sardines.register("/modules/haba/lib/index.js", function(require, module, exports, __dirname, __filename) {
	 var core = require('./core'),
fs = require('fs'),
path = require('path');



var fileExists = function(file) {
	try {
		fs.statSync(file);
		return true;
	} catch (e) {
		return false;
	}
}

//deprecated.
module.exports = function() {

	var haba = core();


	var loadJsFile = {
		test: function(jsPath) {
			return haba.resolve(jsPath);
		},
		prepare: function(jsPath, name, callback) {

			if(typeof name == 'function') {
				callback = name;
				name = undefined;
			}

			var ret = {
				load: function(callback) {
					fullPath = haba.resolve(jsPath); //yeah, more overhead >.>


					if(!fullPath) throw new Error(jsPath + ' does not exist');

					if(!name) name = path.basename(jsPath).replace('.js','');

					function onLoad(module) {
						callback(false, { module: module, name: name, path: fullPath });
					}


					var module = require(fullPath);

					if(module.load) {
						module.load(onLoad);
					} else {
						onLoad(module);
					}
				}
			};

			if(callback) callback(false, [ret]);

			return ret;
		}/*,
		load: function(jsPath, callback, name, index, count) {
			fullPath = haba.resolve(jsPath); //yeah, more overhead >.>

			if(!name) name = path.basename(jsPath).replace('.js','');

			function onLoad(module) {
				callback(false, { module: module, name: name, path: fullPath, index: index == undefined ? 1 : index, length: count || 1 });
			}

			var module = require(fullPath);

			if(module.load) {
				module.load(onLoad);
			} else {
				onLoad(module);
			}
		}*/
	}

	/**
	 * scans a directory
	 */

	var loadDirectory = {
		test: function(dir) {
			return fileExists(dir) && fs.statSync(dir).isDirectory();
		},
		prepare: function(dir, callback) {
			var files = fs.readdirSync(dir),
			loadable = [];

			files.forEach(function(basename, i) {

				if(basename.substr(0,1) == '.') return;

				loadable.push(loadJsFile.prepare(dir + '/' + basename));
			});

			callback(false, loadable);
		}
	}

	/**
	 */

	var loadConfig = {
		test: function(pkgPath) {
			return typeof pkgPath == 'object' || (typeof pkgPath == 'string' && pkgPath.match(/json$/));
		},
		prepare: function(pkgPath, callback) {
			var plugins = typeof pkgPath == 'object' ? pkgPath : JSON.parse(fs.readFileSync(pkgPath,'utf8')).plugins, 
			loadable = [],
			params = this.params();


			for(var name in plugins) {
				var par = plugins[name];

				//param values for the given plugin
				if(typeof par == 'object') params[name] = par;

				loadable.push(loadJsFile.prepare(name, name));
			}

			callback(false, loadable);
		}
	}

	/**
	 * recursively load directories
	 */

	var findModules = function(search, cwd, modules) {
		if(!modules) modules = [];

		fs.readdirSync(cwd).forEach(function(basename) {
			var fullPath = cwd + '/' + basename;
			if(fs.statSync(fullPath).isDirectory()) {
				findModules(search, fullPath, modules);
			} else 
			if(basename.match(search)) {
				modules.push(fs.realpathSync(fullPath));
			}
		});

		return modules;
	}

	var loadTree = {
		test: function(dir) {
			return dir.indexOf('**') > -1
		},
		load: function(dir, callback) {
			var dirParts = dir.split('**'),
			cwd          = dirParts.shift(), 
			search       = new RegExp('^'+dirParts.pop().split('/').pop().replace(/\./g,'\\.').replace(/\*/g,'.*?') + '$');

			var files = findModules(search, cwd),
			loadable = [];


			files.forEach(function(file, i) {
				loadable.push(loadJsFile.load(file));
			});

			callback(false, loadable);
		}
	}

	/**
	 */

	/*var loadObj = {
		test: function(obj) {
			return typeof obj == 'object';
		},
		prepare: function(obj) {
			return {
				load
			}
		}
		load: function(obj, callback) {
			callback(obj, obj.name);
		}
	}*/

	//setup the core loaders
	haba.loaders = [loadConfig, loadJsFile, loadDirectory, loadTree].reverse();


	//now that all the core loaders are in, we can add the additional loaders dropped in ./loaders (cleaner)
	haba.require( __dirname + '/plugins');


	return haba;
};

module.exports.loader = module.exports;
module.exports.paths  = core.paths;
});

_sardines.register("/modules/haba", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/haba/lib/index.js');
});
_sardines.register("/modules/faebed62/index.js", function(require, module, exports, __dirname, __filename) {
	//#include ./plugins

var views      = require('./views'),
model          = require('./views/model'),
template       = require('./views/template'),
concrete       = require('./views/concrete'),
Parser         = require('./template/parser'),
MustacheParser = require('./template/adapters/mustache');


Parser.add('mu', MustacheParser);

/**
 * 
 */

var views = {
	View: concrete,
	Item: model.Item,
	Collection: model.Collection,
	Template: template.Template,
	ItemTemplate: template.ItemTemplate,
	CollectionTemplate: template.CollectionTemplate
}

/**
 */

exports.mixins = {
	errorHandling: require('./mixin/errorHandling')
}

/**
 * allow the views to be extended upon
 */

exports.views = views;

/**
 */
 

exports.plugin = function(router, params) {
	
	this.require(__dirname + "/plugins");


	
	var plviews = {},
	fig = {
		views: plviews
	};

	for(name in views) {
		var viewClazz = plviews[name] = views[name].extend({
			'override __construct': function() {
				this._super.apply(this, arguments);
				this.router = router;
				this.views = plviews;
			}
		});
	}


	router.on({
		
		'pull fig': function(req, res) {
			res.end(fig);
		}
	});

	router.push('fig', fig);

	router.views = plviews;


	return {
		views: fig
	}
}

});
_sardines.register("/modules/4411e1c8/index.js", function(require, module, exports, __dirname, __filename) {
	require('./history');

var utils = require('./utils'),
_    = require('underscore'),
Url = require('url'),
logger = require('mesh-winston').loggers.get('history.core'),
beanpoll = require('beanpoll');


beanpoll.Response.prototype.redirect = function(location) {
	this.headers({ redirect: location });
	this.end();
}

exports.plugin = function(router)
{
	var currentChannel,
	pushedReady = false;




	function normalizeChannel(channel)
	{
		return router.parse.stringifyPaths(router.parse.parseChannel(channel).paths)
	}


	var prevChannel;


	function pullState(channel, data)
	{
		if(channel.substr(0,1) != '/') channel = '/' + channel;

		var parts = Url.parse(channel, true);

		if(parts.pathname == prevChannel)
		{
			console.log('alreading viewing %s', prevChannel);
			return
		}


		prevChannel = parts.pathname;

		var hostname = window.location.hostname,
		hostnameParts = hostname.split('.');
		subdomain = hostnameParts.length > 2 ? hostnameParts.shift() : undefined;


		logger.info('navigate to ' + parts.pathname);

		router.request(parts.pathname).query(_.extend(parts.query, data, true)).headers({ subdomain: subdomain, stream: true }).success(function(stream)
		{

			logger.info('dumping stream data');

			var buffer = '', response = {};

			stream.dump({
				error: function(err) {
					console.log(err.stack);
				},
				headers: function(res)
				{
					response = res;

					if(res.redirect)
					{
						router.push('redirect', res.redirect);
					}
				},
				data: function(chunk) {
					buffer += chunk
				},
				end: function() {
					if(response.redirect || response.dontPrint) return;
					
					document.body.innerHTML = buffer;
				}
			})
		}).pull();
	}


	window.onpopstate = function(e)
	{
		logger.verbose('pop state');

		var state = e.state;     

		if(!state) return;

		currentChannel = state.channel;       

		router.push('track/pageView', { page: state.channel });
                                 
		pullState(state.channel || state.hash, state.data);
	}  

	/**
	 */

	router.on({

		/**
		 */

		'push redirect': function(ops)
		{        
			var channel, data;

			if(typeof ops == 'string')
			{
				channel = ops;
				data = {};
				ops = {};
			}
			else
			{
				channel = ops.channel;
				data = ops.data;
			}

			if(!channel) return;

			var urlParts = Url.parse(channel, true);   



			var uri = urlParts.pathname,
			newChannel = normalizeChannel(uri);

			data = _.extend(urlParts.query, data);


			if(router.request(uri).type('pull').tag('http', true).hasListeners())
			{	
				if(newChannel == currentChannel) return;

                                                      
				logger.info('redirect to ' + channel);

				window.history.pushState({ data: data, channel: channel } , null, ('/' + channel).replace(/\/+/g,'/'));     

				router.push('track/pageView', { page: channel });
			}

			// else
			{

				if(ops.pull === undefined || ops.pull == true)
				//not a viewable item? pull it. might do something else that's fancy...
				pullState(channel, data);	
			}


		},

		/**
		 */

		'pull load/*': function(req, res, mw) {
			$(document).ready(function() {
				mw.next();
			});
		},

		/**
		 */

		'push -one init': function() {
			logger.info('app ready');


			var hasListeners = router.request(window.location.pathname).tag('static', false).type('pull').hasListeners();


			router.push('redirect', window.location.pathname + window.location.search);
			router.push('history/ready');   


			router.on({
				'pull history/ready': function(req, res) {
					res.end(true);
				}
			})
		}
	})
}
});
_sardines.register("/modules/beanpoll/lib/router.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var MessageBuilder, Router, collectPlugin, crema, disposable, plugins, pullPlugin, pushPlugin, _;

  crema = require("crema");

  MessageBuilder = require("./message").Builder;

  pushPlugin = require("./push/plugin");

  pullPlugin = require("./pull/plugin");

  collectPlugin = require("./collect/plugin");

  plugins = require("./plugins");

  disposable = require("disposable");

  _ = require("underscore");

  Router = (function() {
    /*
    */
    function Router() {
      this.directors = {};
      this.parse = crema;
      this._messageBuilder = new MessageBuilder(this);
      this._plugins = new plugins(this);
      this.use(pushPlugin);
      this.use(pullPlugin);
      this.use(collectPlugin);
    }

    /*
    	 uses a dispatcher
    */

    Router.prototype.use = function(plugin) {
      return this._plugins.add(plugin);
    };

    /*
    */

    Router.prototype.using = function() {
      return this._plugins.using();
    };

    /*
    	 listens for a request
    */

    Router.prototype.on = function(routeOrListeners, ops, callback) {
      var listenerDisposables, route, routes, type, _fn, _i, _len,
        _this = this;
      if (typeof ops === 'function') {
        callback = ops;
        ops = {};
      }
      listenerDisposables = disposable.create();
      if (typeof routeOrListeners === "object" && !callback) {
        for (type in routeOrListeners) {
          listenerDisposables.add(this.on(type, routeOrListeners[type]));
        }
        return listenerDisposables;
      }
      if (typeof routeOrListeners === "string") {
        routes = crema(routeOrListeners);
      } else if (routeOrListeners instanceof Array) {
        routes = routeOrListeners;
      } else {
        routes = [routeOrListeners];
      }
      _fn = function(route) {
        if (ops.type) route.type = ops.type;
        if (ops.tags) _.extend(route.tags, ops.tags);
        listenerDisposables.add(_this.director(route.type).addListener(route, callback));
        return _this._plugins.newListener({
          route: route,
          callback: callback
        });
      };
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        _fn(route);
      }
      return listenerDisposables;
    };

    /*
    	 returns the given director, or throws an error if it doesn't exist
    */

    Router.prototype.director = function(type) {
      var director;
      director = this.directors[type];
      if (!director) throw new Error("director " + type + " does not exist");
      return director;
    };

    /*
    */

    Router.prototype.channels = function(ops) {
      var channels, director, name;
      channels = [];
      for (name in this.directors) {
        director = this.directors[name];
        channels = channels.concat(director.channels(ops));
      }
      return channels;
    };

    Router.prototype.dispatch = function(messageWriter) {
      return this.director(messageWriter.type).dispatch(messageWriter);
    };

    /*
    	 abreviated
    */

    Router.prototype.req = function() {
      return this.request.apply(this, arguments);
    };

    /*
    	 Initializes a new request
    */

    Router.prototype.request = function(channel, query, headers) {
      return this._messageBuilder.clean().channel(typeof channel === "string" ? crema.parseChannel(channel) : channel).query(query).headers(headers);
    };

    return Router;

  })();

  module.exports = Router;

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/concrete/messenger.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var LinkedQueue, Response, _,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LinkedQueue = require("../collections/linkedQueue");

  Response = require("./response");

  _ = require("underscore");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    /*
    	 constructor
    */

    function _Class(message, first, director) {
      var _this = this;
      this.message = message;
      this.first = first;
      this.director = director;
      this.router = director.router;
      this.from = message.from;
      _Class.__super__.constructor.call(this, first);
      this.response = new Response(this);
      this.response.reader().dump(function() {
        return _this.message.callback.apply(_this.message, arguments);
      }, this.message.headers);
    }

    /*
    */

    _Class.prototype.start = function() {
      return this.next();
    };

    /*
    */

    _Class.prototype.data = function(name) {
      var obj, _i, _len;
      if (arguments.length === 0) {
        return _.extend({}, this.message.sanitized, this.current.params, this.message.query);
      } else if (arguments.length > 1) {
        obj = {};
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          name = arguments[_i];
          obj[name] = this.data(name);
        }
        obj;
      }
      return this.message.sanitized[name] || this.current.params[name] || (this.message.query ? this.message.query[name] : null);
    };

    /*
    	 flattens all param data into one object
    */

    _Class.prototype.flattenData = function(reset) {
      var allData, cur;
      if (this._allData && !reset) return this._allData;
      cur = this.current;
      allData = _.defaults(cur.params, this.message.query);
      cur = cur.getNextSibling();
      while (cur) {
        _.defaults(allData, cur.params);
        cur = cur.getNextSibling();
      }
      return this._allData = allData;
    };

    /*
    */

    _Class.prototype._onNext = function(middleware, args) {
      if (args && args.length) {
        if (args[0]) {
          return _onError(args[0]);
        } else {
          _onNextData(args[1]);
        }
      }
      this.message.params = middleware.params;
      try {
        this.message.cache(this.hasNext);
        return this._next(middleware, args);
      } catch (e) {
        return this.response.error(e);
      }
    };

    /*
    */

    _Class.prototype._next = function(middleware) {
      return middleware.listener(this);
    };

    /*
    */

    _Class.prototype._onError = function(error) {};

    /*
    */

    _Class.prototype._onNextData = function() {};

    return _Class;

  })(LinkedQueue);

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/concrete/director.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Messenger, RequestMiddleware, crema, dolce;

  dolce = require("dolce");

  RequestMiddleware = require("./middleware");

  crema = require("crema");

  Messenger = require("./messenger");

  /*
  
  Director process:
  */

  module.exports = (function() {
    /*
    	 some directors are passive, meaning errors aren't returned if a route does not exist. This goes for collectors,
    	 emitters, etc.
    */
    _Class.prototype.passive = false;

    /*
    	 constructor
    */

    function _Class(name, router) {
      this.name = name;
      this.router = router;
      this._collection = dolce.collection();
    }

    /*
    	 returns number of listeners based on channel given
    */

    _Class.prototype.numListeners = function(channel, ops) {
      return this._collection.get(channel, ops).chains.length;
    };

    /*
    	 dispatches a request
    */

    _Class.prototype.dispatch = function(messageWriter) {
      var chain, chains, messageReader, messanger, middleware, numChains, numRunning, oldAck, _i, _len;
      chains = this.getListeners(messageWriter);
      numChains = chains.length;
      numRunning = numChains;
      oldAck = messageWriter.callback;
      messageWriter.running = !!numChains;
      messageWriter.callback = function() {
        messageWriter.running = !!(--numRunning);
        if (oldAck) {
          return oldAck.apply(this, Array.apply(null, arguments).concat([numRunning, numChains]));
        }
      };
      if (!!!chains.length && !this.passive) {
        messageWriter.callback(new Error("" + this.name + " route \"" + (crema.stringifyPaths(messageWriter.channel.paths)) + "\" does not exist"));
        return this;
      }
      for (_i = 0, _len = chains.length; _i < _len; _i++) {
        chain = chains[_i];
        messageReader = messageWriter.reader();
        middleware = RequestMiddleware.wrap(chain, messageWriter.pre, messageWriter.next, this);
        messanger = this._newMessenger(messageReader, middleware);
        messanger.start();
      }
      return this;
    };

    /*
    	 adds a route listener to the collection tree
    */

    _Class.prototype.addListener = function(route, callback) {
      disposable;
      var disposable, oldCallback;
      if (route.tags.one) {
        oldCallback = callback;
        callback = function() {
          oldCallback.apply(this, arguments);
          return disposable.dispose();
        };
      }
      this._validateListener(route, callback);
      return disposable = this._collection.add(route, callback);
    };

    /*
    */

    _Class.prototype.channels = function(ops) {
      var channels, listener, _i, _len, _ref, _results;
      channels = [];
      _ref = this._collection.find(ops);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push({
          tags: listener.tags,
          type: this.name,
          path: listener.path
        });
      }
      return _results;
    };

    /*
    */

    _Class.prototype.listenerQuery = function(ops) {
      var filter, key, tag;
      filter = [];
      for (key in ops.filter) {
        tag = {};
        tag[key] = ops.filter[key];
        filter.push(tag);
      }
      return {
        $or: [
          {
            $and: filter
          }, {
            unfilterable: {
              $exists: true
            }
          }
        ]
      };
    };

    /*
    */

    _Class.prototype.getListeners = function(message, expand) {
      return this._collection.get(message.channel, {
        siftTags: this.listenerQuery(message),
        expand: expand
      }).chains;
    };

    /*
    	 returns a new request
    */

    _Class.prototype._newMessenger = function(message, middleware) {
      return new Messenger(message, middleware, this);
    };

    /*
    */

    _Class.prototype._validateListener = function(route) {
      var listeners;
      if (this.passive) return;
      listeners = this._collection.get(route.channel, {
        tags: route.tags,
        expand: false
      });
      if (!!listeners.length) {
        throw new Error("Route \"" + route.channel.value + "\" already exists");
      }
    };

    return _Class;

  })();

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/message.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var MessageReader, MessageWriter, Reader, Writer, outcome,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Reader = require("./io/reader");

  Writer = require("./io/writer");

  outcome = require("outcome");

  exports.Reader = MessageReader = (function(_super) {

    __extends(MessageReader, _super);

    /*
    	 constructor
    */

    function MessageReader(writer, from, channel, query, sanitized, headers, filter, callback) {
      this.writer = writer;
      this.from = from;
      this.channel = channel;
      this.query = query;
      this.sanitized = sanitized != null ? sanitized : {};
      this.headers = headers != null ? headers : {};
      this.filter = filter != null ? filter : {};
      this.callback = callback != null ? callback : null;
      MessageReader.__super__.constructor.call(this, writer);
    }

    return MessageReader;

  })(Reader);

  exports.Writer = MessageWriter = (function(_super) {

    __extends(MessageWriter, _super);

    /*
    */

    function MessageWriter(_ops) {
      this._ops = _ops;
      this.channel = _ops.channel;
      this.callback = _ops.callback;
      this.next = _ops.next;
      this.filter = _ops.filter || {};
      this.pre = _ops.pre;
      this.type = _ops.type;
      this.from = _ops.from;
      this.headers = _ops.headers;
      this.query = _ops.query;
      this.sanitized = _ops.sanitized;
      MessageWriter.__super__.constructor.call(this);
    }

    /*
    */

    MessageWriter.prototype.reader = function(index, numListeners) {
      return new MessageReader(this, this.from, this.channel, this.query, this.sanitized, this.headers, this.filter, this.callback);
    };

    return MessageWriter;

  })(Writer);

  exports.Builder = (function() {
    /*
    */
    function _Class(router) {
      this.router = router;
      this.clean();
    }

    /*
    	 options which control how the request
    	 is handled. This can fill out the entire request vs using the methods given
    */

    _Class.prototype.options = function(value) {
      if (!arguments.length) return this._ops;
      this._ops = value || {};
      return this;
    };

    /*
    */

    _Class.prototype.clean = function() {
      this._ops = {};
      return this.from(this.router);
    };

    /*
    	 filterable tags
    */

    _Class.prototype.tag = function(keyOrTags, value) {
      return this._objParam('filter', arguments, function(value) {
        if (typeof value === 'boolean') {
          return {
            $exists: value
          };
        }
        return value;
      });
    };

    /*
    	 DEPRECATED
    */

    _Class.prototype.headers = function(value) {
      return this.header(value);
    };

    /*
    	 The header data explaining the message, such as tags, content type, etc.
    */

    _Class.prototype.header = function(keyOrHeaders, value) {
      return this._objParam('headers', arguments);
    };

    /*
    */

    _Class.prototype.type = function(value) {
      return this._param('type', arguments);
    };

    /*
    */

    _Class.prototype.from = function(value) {
      return this._param('from', arguments);
    };

    /*
    */

    _Class.prototype.to = function(value) {
      return this._param('to', arguments);
    };

    /*
    */

    _Class.prototype.channel = function(value) {
      return this._param('channel', arguments);
    };

    /* 
    	 Query would be something like ?name=craig&last=condon
    */

    _Class.prototype.query = function(value) {
      return this._param('query', arguments);
    };

    /* 
    	 data that has been cleaned up after validation
    */

    _Class.prototype.sanitized = function(value) {
      return this._param('sanitized', arguments);
    };

    /*
    	 response handler, or ack
    	 deprecated
    */

    _Class.prototype.response = function(callback) {
      return this._param('response', arguments);
    };

    /*
    	 on error callback
    */

    _Class.prototype.error = function(callback) {
      return this._param('error', arguments);
    };

    /*
    	 on success callback
    */

    _Class.prototype.success = function(callback) {
      return this._param('success', arguments);
    };

    /*
    	 append middleware to the end
    */

    _Class.prototype.next = function(middleware) {
      return this._param('next', arguments);
    };

    /*
    	 prepend middleware
    */

    _Class.prototype.pre = function(middleware) {
      return this._param('pre', arguments);
    };

    /*
    */

    _Class.prototype.dispatch = function(type) {
      var writer;
      this._ops.callback = outcome({
        error: this.error(),
        success: this.success(),
        callback: this.response()
      });
      if (type) this.type(type);
      writer = new MessageWriter(this._ops);
      this.router.dispatch(writer);
      return writer;
    };

    /*
    	 DEPRECATED
    */

    _Class.prototype.hasListeners = function() {
      return this.exists();
    };

    /*
    */

    _Class.prototype.exists = function() {
      return !!this.router.director(this.type()).getListeners({
        channel: this._ops.channel,
        filter: this._ops.filter
      }, false).length;
    };

    /*
    */

    _Class.prototype._param = function(name, args) {
      if (!args.length) return this._ops[name];
      this._ops[name] = args[0];
      return this;
    };

    /*
    */

    _Class.prototype._objParam = function(name, args, getValue) {
      var key, keyOrObj, value;
      if (!args.length) return this._ops[name];
      if (!this._ops[name]) this._ops[name] = {};
      keyOrObj = args[0];
      value = args[1];
      if (typeof keyOrObj === 'string') {
        if (args.length === 1) return this._ops.headers[keyOrObj];
        this._ops[name][keyOrObj] = getValue ? getValue(value) : value;
      } else {
        for (key in keyOrObj) {
          this._objParam(name, [key, keyOrObj[key]], getValue);
        }
      }
      return this;
    };

    return _Class;

  })();

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/concrete/response.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Reader, Response, ResponseReader, Writer, outcome, _,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Writer = require("../io/writer");

  Reader = require("../io/reader");

  _ = require("underscore");

  outcome = require("outcome");

  ResponseReader = (function(_super) {

    __extends(ResponseReader, _super);

    function ResponseReader() {
      ResponseReader.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    ResponseReader.prototype._listenTo = function() {
      return ResponseReader.__super__._listenTo.call(this).concat("headers");
    };

    /*
    */

    ResponseReader.prototype._listen = function() {
      var _this = this;
      ResponseReader.__super__._listen.call(this);
      return this.on("headers", function(headers) {
        return _this.headers = headers;
      });
    };

    ResponseReader.prototype._dumpCached = function(pipedReader) {
      if (this.headers) pipedReader.emit("headers", this.headers);
      return ResponseReader.__super__._dumpCached.call(this, pipedReader);
    };

    return ResponseReader;

  })(Reader);

  module.exports = Response = (function(_super) {

    __extends(Response, _super);

    /*
    */

    function Response(messenger) {
      this.messenger = messenger;
      Response.__super__.constructor.call(this);
      this._headers = {};
    }

    /*
    */

    Response.prototype.header = function(typeOrObj, value) {
      if (typeof typeOrObj === "object") {
        _.extend(this._headers, typeOrObj);
      } else {
        this._headers[typeOfObj] = value;
      }
      return this;
    };

    /*
    	 DEPRECATED
    */

    Response.prototype.headers = function(typeOrObj, value) {
      return this.header(typeOrObj, value);
    };

    /*
    */

    Response.prototype.write = function(chunk, encoding) {
      if (encoding == null) encoding = "utf8";
      this.sendHeaders();
      return Response.__super__.write.call(this, chunk, encoding);
    };

    /*
    */

    Response.prototype.end = function(chunk, encoding) {
      if (encoding == null) encoding = "utf8";
      this.sendHeaders();
      return Response.__super__.end.call(this, chunk, encoding);
    };

    /*
    	 wrap-around for error handling
    */

    Response.prototype.success = function(success) {
      var _this = this;
      if (!this._outcome) {
        this._outcome = outcome.error(function(err) {
          return _this.error(err);
        });
      }
      return this._outcome.success(success);
    };

    /*
    */

    Response.prototype.sendHeaders = function() {
      if (this.sentHeaders) return this;
      this.sentHeaders = true;
      this.emit("headers", this._headers);
      return this;
    };

    /*
    */

    Response.prototype.reader = function() {
      return new ResponseReader(this);
    };

    return Response;

  })(Writer);

  Writer.prototype.writable = true;

}).call(this);

});
_sardines.register("/modules/haba/lib/core.js", function(require, module, exports, __dirname, __filename) {
	var path = require('path'),
EventEmitter = require('events').EventEmitter,
pluginNameTester = require('./nameTester'),
pluginCollection = require('./collection'),
Structr = require('structr');


var copy = function(from, to) {
	if(!to) to = {};

	for(var i in from) to[i] = from[i];

	return to;
}


var nativeResolve = function(file) {
	try {
		return require.resolve(file);
	} catch (e) {
		return false;
	}
}


var includePaths = function(paths, target) {
	paths.forEach(function(fullPath) {
		var normPath = path.normalize(fullPath);

		//no dupes
		if(target.indexOf(normPath) > -1) return;

		target.push(normPath);
	});

	return this;
} 

var globalExists = typeof global != 'undefined'


if(globalExists) global.habaPaths = global.habaPaths || [];


var normalizeRequired = function(req) {

	if(typeof req == 'string' || typeof req == 'function' || req instanceof RegExp) req = [req];

	var normalized = [];

	if(req instanceof Array) {
		for(var i = req.length; i--;) {
			normalized.push({
				search: req[i],
				name: typeof req[i] == 'string' ? req[i] : null
			});
		}
	} else {
		for(var name in req) {
			var v = req[name],
			params = {};

			if(typeof v == 'object') {
				params = v;
			} else {
				params.search = v;
			}

			params.name = typeof v == 'string' ? v : null;
			

			normalized.push(params);
		}	
	}
	
	return normalized;
}

module.exports = function() {

	
	//options passed to every plugin
	var options = {}, 

	//paths to scan for modules
	//second param is for debugging - soft-linked haba path breaks node module searching
	paths       = [__dirname], 

	//params specific to each plugin
	params      = {},
	
	//required paths
	required    = [],

	self = {},

	//all plugins
	allPlugins = pluginCollection(self),

	//remote plugins
	remotePlugins = allPlugins.addChild(),

	//local plugins
	localPlugins = allPlugins.addChild(),

	//module paths - check if they've already been loaded
	included    = {},

	readyListeners = [],
	loading = false;


	var findNodeModulePath = function(path, module) {
		var pathParts = path.split('/'), fullPath;

		while(pathParts.length) {

			if(fullPath = nativeResolve(pathParts.join('/') + '/node_modules/' + module)) return fullPath;

			pathParts.pop();
		}

		return null;
	}


	var resolveFromPaths = function(jsPath, paths) {
		for(var i = paths.length; i--;) {
			var incPath = paths[i];
			if((fullPath = nativeResolve(incPath + '/' + jsPath)) || (fullPath = findNodeModulePath(incPath, jsPath))) return fullPath;
		}

		return null;
	}


	var resolve = function(jsPath) {
		var fullPath;

		if(fullPath = nativeResolve(jsPath)) return fullPath;

		return resolveFromPaths(jsPath, paths) || (globalExists ? resolveFromPaths(jsPath, global.habaPaths) : null);
	}

	var inited = false,
	toLoad = [],
	modulesLoading = 0,
	numLoaders = 0;

	function tryInitializing() {

		modulesLoading--;

		if(!numLoaders && !modulesLoading)	 {
			inited = true;
			allPlugins.ready();
		}
	}

	function onPluginLoaded(err, ops) {
		if(err) throw err;

		var module = ops.module || {},

		//name of the module, e.g., name of the file to module
		name   = module.name    || ops.name,

		//path to the module, e.g., some/path.js or http://site.com/path.js
		path   = ops.path       || name,

		//is is a remote object? Dnode, now.js, etc.
		remote = ops.remote,

		//params for the plugin when required in
		prm    = params[name]   || {};

		//set the name to the parms
		prm.name = params.name  || name;



		//check if the plugin is already loaded in. If it is, then give a warning. do NOT include it!
		if(included[path] && !remote) {
			tryInitializing();
			return console.warn('%s is already loaded', ops.path);
		}

		//flag that the path has been included
		included[path] = 1;

		//create a NEW plugin with the module given. 
		var instance = ops.plugin || (self.newPlugin(module, options, prm, self) || {}),

		//need to reparate the remote, from the local plugins incase OTHER plugins EXPLICITLY
		//want local, OR remote plugins. that's why remote / local collections exist.
		collection = remote ? remotePlugins : localPlugins;

		//ability to reference it when calling .plugins()
		instance.name = name;

		//add the plugin
		collection.add({
			name: name,
			path: path,
			instance: instance,
			require: normalizeRequired(module.require)
		});
			

		//check if any ready listeners are listening for THIS plugin to be loaded in.
		//notify them if that's the case
		readyListeners.forEach(function(listener) {
			
			if(listener.test(name)) {

				listener.callback(instance);

			}
		});


		//self.methods is DEPRECATED!!
		self.methods[name] = self.exports[name] = instance;


		tryInitializing();
	}


	function loadRequired(required) {



		for(var i = self.loaders.length; i--;) {
			var loader = self.loaders[i], loaded = false;


			//find the right loader for the required item?
			if(loader.test(required)) {

				//prepare the item - it MIGHT need to be loaded in. After that
				//we're given loadable items - plugins
				loader.prepare.call(self, required, function(err, moduleLoaders) {

					if(err) throw err;

					var n = moduleLoaders.length;

					numLoaders--;


					//need to add 1 to modules loading incase n = 0. 
					modulesLoading += n + 1;

					for(var j = moduleLoaders.length; j--;) {

						moduleLoaders[j].load(onPluginLoaded);
						
					}

					//try initializing INCASE there aren't any module loaders
					tryInitializing();
				});

				return this;
			}

		}


		throw new Error('Unable to load plugin ' + required);
	}


	function loadAll() {

		loading = true;

		//ADD the number of loaders since loadAll can be called multiple times
		//which happens when a plugin is loaded in
		numLoaders += toLoad.length;

		var load = toLoad.concat();
		//drain the items to load
		toLoad = [];

		for(var i = 0; i < load.length; i++) {
			loadRequired(load[i]);
		}

		toLoad = [];
	}



	Structr.copy({

		/**
		 * resolves a module path
		 */

		'resolve': resolve,
		
		/**
		 * global options passed to all plugins
		 */
		
		'options': function(value) {
			if(!arguments.length) return options;
			options = value;
			return this;
		},

		/**
		 * parameters specific to plugins
		 */
		
		'params': function(name, value) {

			if(!arguments.length) return params;
			if(arguments.length == 1 && typeof arguments[0] == 'string') return params[name];

			if(typeof name == 'object') {
				for(var prop in name) {
					self.params(prop, name[prop]);
				} 
			} else {
				params[name] = value;
			}

			return this;
		}, 

		/**
		 * adds / returns paths to scan in
		 */

		'paths': function() {
			if(arguments.length) {
				includePaths(Array.apply(null, arguments), paths);
				return this;
			}

			return paths;
		},

		/**
		 * loads in modules via require
		 */

		'loaders': [],

		/**
		 * all the invokable methods against loaded modules
		 * DEPRECATED
		 */

		'methods': {},


		/**
		 * repl for methods
		 */

		'exports': {},


		/**
		 * factory for loading in modules
		 */

		'newPlugin': function(module, options, params, haba) {

			return module.plugin.call(haba, options, params, haba);

		},

		/**
		 */

		'factory': function(fn) {

			self.newPlugin = fn;
			return self;	

		},

		/**
		 * loads a plugin via loaders
		 */

		'require': function(required) {

			var newPlugins = Array.prototype.slice.call(arguments, 0);

			//more than one required item? recall require...
			if(newPlugins.length > 1) {

				newPlugins.forEach(function(plugin) {

					self.require(plugin);

				});

				return self;

			}

			toLoad.push(required);

			//incase require is called within a plugin...
			if(loading) loadAll();

			return self;
		},


		/**
		 * listener for when a plugin is ready
		 */

		'onLoad': function(search, ret, callback) {

			if(typeof ret == 'function') {
				callback = ret;
				ret      = false;
			}

			readyListeners.push({
				test: pluginNameTester(search),
				callback: callback
			});


			if(ret) {
				var plugin = self.plugin(search);

				if(plugin) callback(plugin);
			}
			
			return this;
		},

		/**
		 * locally included plugins
		 */

		'local': localPlugins,

		/**
		 * remotely included plugins
		 */

		'remote': remotePlugins,

		/**
		 */

		'plugin': allPlugins.plugin,

		/**
		 */

		'plugins': allPlugins.plugins,

		/**
		 */

		'emit': allPlugins.emit,

		/**
		 */

		'next': allPlugins.next, 

		/**
		 * DEPRECATED
		 */

		'init': function(callback) {

			return self.load(callback);
			
		},

		/**
		 */

		'load': function(callback) {
			
			//load the required plugins
			loadAll();

			//emit initialization
			this.local.emit('init');

			//add the queued item
			if(callback) self.next(callback);
			return this;

		}
	}, self);

	

	return self;
};

/**
 * global
 */

module.exports.paths = function() {
	if(arguments.length) {
		includePaths(Array.apply(null, arguments), global.habaPaths);
	} else {
		return paths;
	}
}
});
_sardines.register("/modules/fs", function(require, module, exports, __dirname, __filename) {
	var allFiles = _sardines.allFiles;

exports.statSync = function(path) {
	return {
		isDirectory: function() {
			return !path.match(/\.\w+$/);
		}
	}
}

exports.readdirSync = function(path) {

	console.log(cp)
	var parts = path.split('/'),
	cp = allFiles;

	parts.forEach(function(part) {
		cp = cp[part];
	});

	if(!cp) return [];


	return Object.keys(cp);
}

exports.realpathSync = function(path) {
	console.log("RPS");
}


});
_sardines.register("/modules/path", function(require, module, exports, __dirname, __filename) {
	// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


var isWindows = false;


// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length-1; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}


if (isWindows) {
  // Regex to split a windows path into three parts: [*, device, slash,
  // tail] windows-only
  var splitDeviceRe =
      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?([\\\/])?([\s\S]*?)$/;

  // Regex to split the tail part of the above into [*, dir, basename, ext]
  var splitTailRe = /^([\s\S]+[\\\/](?!$)|[\\\/])?((?:[\s\S]+?)?(\.[^.]*)?)$/;

   // Function to split a filename into [root, dir, basename, ext]
   // windows version
  var splitPath = function(filename) {
    // Separate device+slash from tail
    var result = splitDeviceRe.exec(filename),
        device = (result[1] || '') + (result[2] || ''),
        tail = result[3] || '';
    // Split the tail into dir, basename and extension
    var result2 = splitTailRe.exec(tail),
        dir = result2[1] || '',
        basename = result2[2] || '',
        ext = result2[3] || '';
    return [device, dir, basename, ext];
  }

  // path.resolve([from ...], to)
  // windows version
  exports.resolve = function() {
    var resolvedDevice = '',
        resolvedTail = '',
        resolvedAbsolute = false;

    for (var i = arguments.length-1; i >= -1; i--) {
      var path = (i >= 0) ? arguments[i] : process.cwd();

      // Skip empty and invalid entries
      if (typeof path !== 'string' || !path) {
        continue;
      }

      var result = splitDeviceRe.exec(path),
          device = result[1] || '',
          isUnc = device && device.charAt(1) !== ':',
          isAbsolute = !!result[2] || isUnc, // UNC paths are always absolute
          tail = result[3];

      if (device &&
          resolvedDevice &&
          device.toLowerCase() !== resolvedDevice.toLowerCase()) {
        // This path points to another device so it is not applicable
        continue;
      }

      if (!resolvedDevice) {
        resolvedDevice = device;
      }
      if (!resolvedAbsolute) {
        resolvedTail = tail + '\\' + resolvedTail;
        resolvedAbsolute = isAbsolute;
      }

      if (resolvedDevice && resolvedAbsolute) {
        break;
      }
    }

    if (!resolvedAbsolute && resolvedDevice) {
      // If we still don't have an absolute path,
      // prepend the current path for the device found.

      // TODO
      // Windows stores the current directories for 'other' drives
      // as hidden environment variables like =C:=c:\windows (literally)
      // var deviceCwd = os.getCwdForDrive(resolvedDevice);
      var deviceCwd = '';

      // If there is no cwd set for the drive, it is at root
      resolvedTail = deviceCwd + '\\' + resolvedTail;
      resolvedAbsolute = true;
    }

    // Replace slashes (in UNC share name) by backslashes
    resolvedDevice = resolvedDevice.replace(/\//g, '\\');

    // At this point the path should be resolved to a full absolute path,
    // but handle relative paths to be safe (might happen when process.cwd()
    // fails)

    // Normalize the tail path

    function f(p) {
      return !!p;
    }

    resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/).filter(f),
                                  !resolvedAbsolute).join('\\');

    return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
           '.';
  };

  // windows version
  exports.normalize = function(path) {
    var result = splitDeviceRe.exec(path),
        device = result[1] || '',
        isUnc = device && device.charAt(1) !== ':',
        isAbsolute = !!result[2] || isUnc, // UNC paths are always absolute
        tail = result[3],
        trailingSlash = /[\\\/]$/.test(tail);

    // Normalize the tail path
    tail = normalizeArray(tail.split(/[\\\/]+/).filter(function(p) {
      return !!p;
    }), !isAbsolute).join('\\');

    if (!tail && !isAbsolute) {
      tail = '.';
    }
    if (tail && trailingSlash) {
      tail += '\\';
    }

    return device + (isAbsolute ? '\\' : '') + tail;
  };

  // windows version
  exports.join = function() {
    function f(p) {
      return p && typeof p === 'string';
    }

    var paths = Array.prototype.slice.call(arguments, 0).filter(f);
    var joined = paths.join('\\');

    // Make sure that the joined path doesn't start with two slashes
    // - it will be mistaken for an unc path by normalize() -
    // unless the paths[0] also starts with two slashes
    if (/^[\\\/]{2}/.test(joined) && !/^[\\\/]{2}/.test(paths[0])) {
      joined = joined.slice(1);
    }

    return exports.normalize(joined);
  };

  // path.relative(from, to)
  // it will solve the relative path from 'from' to 'to', for instance:
  // from = 'C:\\orandea\\test\\aaa'
  // to = 'C:\\orandea\\impl\\bbb'
  // The output of the function should be: '..\\..\\impl\\bbb'
  // windows version
  exports.relative = function(from, to) {
    from = exports.resolve(from);
    to = exports.resolve(to);

    // windows is not case sensitive
    var lowerFrom = from.toLowerCase();
    var lowerTo = to.toLowerCase();

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('\\'));
    var toParts = trim(to.split('\\'));

    var lowerFromParts = trim(lowerFrom.split('\\'));
    var lowerToParts = trim(lowerTo.split('\\'));

    var length = Math.min(lowerFromParts.length, lowerToParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (lowerFromParts[i] !== lowerToParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    if (samePartsLength == 0) {
      return to;
    }

    var outputParts = [];
    for (var i = samePartsLength; i < lowerFromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('\\');
  };


} else /* posix */ {

  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe = /^(\/?)([\s\S]+\/(?!$)|\/)?((?:[\s\S]+?)?(\.[^.]*)?)$/;
  var splitPath = function(filename) {
    var result = splitPathRe.exec(filename);
    return [result[1] || '', result[2] || '', result[3] || '', result[4] || ''];
  };

  // path.resolve([from ...], to)
  // posix version
  exports.resolve = function() {
    var resolvedPath = '',
        resolvedAbsolute = false;

    for (var i = arguments.length-1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? arguments[i] : process.cwd();

      // Skip empty and invalid entries
      if (typeof path !== 'string' || !path) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
      return !!p;
    }), !resolvedAbsolute).join('/');

    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  };

  // path.normalize(path)
  // posix version
  exports.normalize = function(path) {
    var isAbsolute = path.charAt(0) === '/',
        trailingSlash = path.slice(-1) === '/';

    // Normalize the path
    path = normalizeArray(path.split('/').filter(function(p) {
      return !!p;
    }), !isAbsolute).join('/');

    if (!path && !isAbsolute) {
      path = '.';
    }
    if (path && trailingSlash) {
      path += '/';
    }

    return (isAbsolute ? '/' : '') + path;
  };


  // posix version
  exports.join = function() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return exports.normalize(paths.filter(function(p, index) {
      return p && typeof p === 'string';
    }).join('/'));
  };


  // path.relative(from, to)
  // posix version
  exports.relative = function(from, to) {
    from = exports.resolve(from).substr(1);
    to = exports.resolve(to).substr(1);

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('/');
  };

}


exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substring(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};


exports.exists = function(path, callback) {
  process.binding('fs').stat(path, function(err, stats) {
    if (callback) callback(err ? false : true);
  });
};


exports.existsSync = function(path) {
  try {
    process.binding('fs').stat(path);
    return true;
  } catch (e) {
    return false;
  }
};

});
_sardines.register("/modules/4411e1c8/history.js", function(require, module, exports, __dirname, __filename) {
	
/**
 * @preserve By Filipe Fortes ( www.fortes.com )
 * MIT License
 */
/**
 * @fileoverview
 * Implements HTML5 window history functions for browsers that do not support it
 */

var DEBUG = true;

if (DEBUG) {
  if (!window.console) {
    // Make sure we can log things during debug
    window.console = {};
  }

  if (!console.log) {
    console.log = function () { };
  }

  if (!console.error) {
    console.error = console.log;
  }

  if (!console.info) {
    console.info = console.log;
  }
}

window.history_js = window.history_js || { hashInterval: 100, delimiter: '-' };

// Even if the client has an implementation of the API, we have to check the hash
// just in case the visitor followed a link generated by a browser that does not
// support the API
if (document.location.hash) {
  (function () {
    // Sanitize
    var hash = document.location.hash[0] === '#' ? document.location.hash.substr(1) : document.location.hash;

    // Our hashes always start with the delimiter and have at least another character there
    if (hash[0] === window.history_js.delimiter && hash.length >= 2) {
      // Redirect, stripping the intial delimiter
      hash = hash.substr(1);
      document.location = hash;
    }
  }());
}

(function (history_js, window, location) {
  // Check if the browser already has a native implementation
  if ('pushState' in window.history) {
    if (DEBUG) {
      console.info('pushState: history.pushState already implemented, skipping');
    }

    // Native implementation present, we are done here
    return;
  }

  var IE8inIE7 = document.documentMode && document.documentMode <= 7,
      useLocalStorage = 'sessionStorage' in window && window.JSON && !IE8inIE7;

  // Storage API
  if (useLocalStorage) {
    if (DEBUG) {
      console.info('Using persistent storage');
      history_js.persist = true;
    }

    history_js.setStorage = function setStorage(name, value) {
      window.sessionStorage[name] = JSON.stringify(value);
    };

    history_js.getStorage = function getStorage(name) {
      return JSON.parse(window.sessionStorage[name]);
    }
  }
  else {
    if (DEBUG) {
      console.info('Using non-persistent storage');
      history_js.persist = false;
    }

    // TODO: Implement real persistence
    history_js.fake_storage = {};
    history_js.setStorage = function setStorage(name, value) {
      history_js.fake_storage[name] = value;
    };

    history_js.getStorage = function getStorage(name) {
      return history_js.fake_storage[name];
    }
  }

  /**
   * @private
   * @param {?Object} data
   * @param {?string} title
   * @param {!string} url
   * @param {boolean} replace
   */
  function changeState (data, title, url, replace) {
    // Always add delimiter and escape hash
    url = history_js.delimiter + escape(url);

    // Store data using url
    history_js.setStorage(url, { state: data, title: title });

    // HTML5 implementation only calls popstate as a result of a user action,
    // store the hash so we don't trigger a false event
    history_js.hash = url;

    // Use the URL as a hash
    if (replace) {
      location.replace('#' + url);
    }
    else {
      // TODO: IE 6 & 7 need to use iFrame for back button support

      // Place the hash normally
      location.hash = '#' + url;
    }
  }

  /**
   * @param {?Object} data
   * @param {?string} title
   * @param {!string} url
   */
  window.history.pushState = function (data, title, url) {
    changeState(data, title, url, false);
  };

  /**
   * @param {?Object} data
   * @param {?string} title
   * @param {!string} url
   */
  window.history.replaceState = function (data, title, url) {
    changeState(data, title, url, true);
  };

  /**
   * @private
   * @return {string} Hash value, minus any leading '#'
   */
  history_js.normalized_hash = function () {
    return location.hash[0] === '#' ?  location.hash.substring(1) : location.hash;
  }

  /**
   * Receive the hashChanged event (native or manual) and fire the onpopstate
   * event
   * @private
   */
  history_js.hashchange = function() {
    var new_hash = history_js.normalized_hash(),
        data;

    // False alarm, ignore
    if (new_hash === history_js.hash) {
      return;
    }

    history_js.hash = new_hash;
    data = history_js.hash ? history_js.getStorage(history_js.hash) : {};

    if (DEBUG) {
      console.info('New hash: ', history_js.hash);
    }

    // Now, fire onpopstate with the state object
    if ('onpopstate' in window && typeof window.onpopstate === 'function') {
      window.onpopstate.apply(window, [{ 'state': data ? data.state : null }]);
    }
    else {
      if (DEBUG) {
        console.info('State changed, but no handler!');
      }
    }
  };

  // IE8 in IE7 mode defines onhashchange, but never fires it
  if ('onhashchange' in window && !IE8inIE7) {
    if (DEBUG) {
      console.info('Browser has native onHashChange');
    }

    window.onhashchange = history_js.hashchange;
  }
  else {
    // TODO:
    // IE6 & 7 don't create history items if the hash doesn't match an element's ID,
    // so we need to create an iframe which we'll use 

    if (DEBUG) {
      console.info('Using manualy hash change detection');
    }

    // Need to check hash state manually
    history_js.hashInterval = setInterval(function () {
      var hash = history_js.normalized_hash();
      if (hash !== history_js.hash) {
        history_js.hashchange();
      }
    }, history_js.hashInterval);
  }

  // Fire event manually right now, if we loaded with a hash
  if (history_js.normalized_hash()) {
    history_js.hashchange();
  }
}(window.history_js, window, document.location));
});
_sardines.register("/modules/4411e1c8/utils.js", function(require, module, exports, __dirname, __filename) {
	exports.urlPath = function(url)
{
	return url.indexOf('://') > -1 ? url.split('/').slice(3).join('/') : url;
}
});
_sardines.register("/modules/underscore/underscore.js", function(require, module, exports, __dirname, __filename) {
	//     Underscore.js 1.2.3
//     (c) 2009-2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js** and **"CommonJS"**, with
  // backwards-compatibility for the old `require()` API. If we're not in
  // CommonJS, add `_` to the global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else if (typeof define === 'function' && define.amd) {
    // Register as a named module with AMD.
    define('underscore', function() {
      return _;
    });
  } else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.2.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method.call ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        func.apply(context, args);
      }
      whenDone();
      throttling = true;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = concat.apply([func], arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (hasOwnProperty.call(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = hasOwnProperty.call(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (hasOwnProperty.call(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && hasOwnProperty.call(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape, function(match, code) {
           return "',_.escape(" + code.replace(/\\'/g, "'") + "),'";
         })
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + ";__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', '_', tmpl);
    if (data) return func(data, _);
    return function(data) {
      return func.call(this, data, _);
    };
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

});

_sardines.register("/modules/underscore", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/underscore/underscore.js');
});
_sardines.register("/modules/url", function(require, module, exports, __dirname, __filename) {
	// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9+]+:)/i,
    portPattern = /:[0-9]+$/,
    // RFC 2396: characters reserved for delimiting URLs.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''],
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#']
      .concat(unwise).concat(autoEscape),
    nonAuthChars = ['/', '@', '?', '#'].concat(delims),
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-zA-Z0-9][a-z0-9A-Z_-]{0,62}$/,
    hostnamePartStart = /^([a-zA-Z0-9][a-z0-9A-Z_-]{0,62})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always have a path component.
    pathedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && typeof(url) === 'object' && url.href) return url;

  if (typeof url !== 'string') {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var out = {},
      rest = url;

  // cut off any delimiters.
  // This is to support parse stuff like "<http://foo.com>"
  for (var i = 0, l = rest.length; i < l; i++) {
    if (delims.indexOf(rest.charAt(i)) === -1) break;
  }
  if (i !== 0) rest = rest.substr(i);


  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    out.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      out.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {
    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    // don't enforce full RFC correctness, just be unstupid about it.

    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the first @ sign, unless some non-auth character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    var atSign = rest.indexOf('@');
    if (atSign !== -1) {
      // there *may be* an auth
      var hasAuth = true;
      for (var i = 0, l = nonAuthChars.length; i < l; i++) {
        var index = rest.indexOf(nonAuthChars[i]);
        if (index !== -1 && index < atSign) {
          // not a valid auth.  Something like http://foo.com/bar@baz/
          hasAuth = false;
          break;
        }
      }
      if (hasAuth) {
        // pluck off the auth portion.
        out.auth = rest.substr(0, atSign);
        rest = rest.substr(atSign + 1);
      }
    }

    var firstNonHost = -1;
    for (var i = 0, l = nonHostChars.length; i < l; i++) {
      var index = rest.indexOf(nonHostChars[i]);
      if (index !== -1 &&
          (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
    }

    if (firstNonHost !== -1) {
      out.host = rest.substr(0, firstNonHost);
      rest = rest.substr(firstNonHost);
    } else {
      out.host = rest;
      rest = '';
    }

    // pull out port.
    var p = parseHost(out.host);
    if (out.auth) out.host = out.auth + '@' + out.host;
    var keys = Object.keys(p);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      out[key] = p[key];
    }

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    out.hostname = out.hostname || '';

    // validate a little.
    if (out.hostname.length > hostnameMaxLen) {
      out.hostname = '';
    } else {
      var hostparts = out.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            out.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    // hostnames are always lower case.
    out.hostname = out.hostname.toLowerCase();

    // IDNA Support: Returns a puny coded representation of "domain".
    // It only converts the part of the domain name that
    // has non ASCII characters. I.e. it dosent matter if
    // you call it with a domain that already is in ASCII.
    var domainArray = out.hostname.split('.');
    var newOut = [];
    for (var i = 0; i < domainArray.length; ++i) {
      var s = domainArray[i];
      newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
          'xn--' + punycode.encode(s) : s);
    }
    out.hostname = newOut.join('.');

    out.host = ((out.auth) ? out.auth + '@' : '') +
        (out.hostname || '') +
        ((out.port) ? ':' + out.port : '');
    out.href += out.host;
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }

    // Now make sure that delims never appear in a url.
    var chop = rest.length;
    for (var i = 0, l = delims.length; i < l; i++) {
      var c = rest.indexOf(delims[i]);
      if (c !== -1) {
        chop = Math.min(c, chop);
      }
    }
    rest = rest.substr(0, chop);
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    out.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    out.search = rest.substr(qm);
    out.query = rest.substr(qm + 1);
    if (parseQueryString) {
      out.query = querystring.parse(out.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    out.search = '';
    out.query = {};
  }
  if (rest) out.pathname = rest;
  if (slashedProtocol[proto] &&
      out.hostname && !out.pathname) {
    out.pathname = '/';
  }

  // finally, reconstruct the href based on what has been validated.
  out.href = urlFormat(out);

  return out;
}

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (typeof(obj) === 'string') obj = urlParse(obj);

  var auth = obj.auth;
  if (auth) {
    auth = auth.split('@').join('%40');
    for (var i = 0, l = nonAuthChars.length; i < l; i++) {
      var nAC = nonAuthChars[i];
      auth = auth.split(nAC).join(encodeURIComponent(nAC));
    }
  }

  var protocol = obj.protocol || '',
      host = (obj.host !== undefined) ? obj.host :
          obj.hostname !== undefined ? (
              (auth ? auth + '@' : '') +
              obj.hostname +
              (obj.port ? ':' + obj.port : '')
          ) :
          false,
      pathname = obj.pathname || '',
      query = obj.query &&
              ((typeof obj.query === 'object' &&
                Object.keys(obj.query).length) ?
                 querystring.stringify(obj.query) :
                 '') || '',
      search = obj.search || (query && ('?' + query)) || '',
      hash = obj.hash || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (obj.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  return protocol + host + pathname + search + hash;
}

function urlResolve(source, relative) {
  return urlFormat(urlResolveObject(source, relative));
}

function urlResolveObject(source, relative) {
  if (!source) return relative;

  source = urlParse(urlFormat(source), false, true);
  relative = urlParse(urlFormat(relative), false, true);

  // hash is always overridden, no matter what.
  source.hash = relative.hash;

  if (relative.href === '') return source;

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    relative.protocol = source.protocol;
    return relative;
  }

  if (relative.protocol && relative.protocol !== source.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.

    if (!slashedProtocol[relative.protocol]) return relative;

    source.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      relative.pathname = relPath.join('/');
    }
    source.pathname = relative.pathname;
    source.search = relative.search;
    source.query = relative.query;
    source.host = relative.host || '';
    delete source.auth;
    delete source.hostname;
    source.port = relative.port;
    return source;
  }

  var isSourceAbs = (source.pathname && source.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host !== undefined ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (source.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = source.pathname && source.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = source.protocol &&
          !slashedProtocol[source.protocol] &&
          source.host !== undefined;

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // source.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {

    delete source.hostname;
    delete source.auth;
    delete source.port;
    if (source.host) {
      if (srcPath[0] === '') srcPath[0] = source.host;
      else srcPath.unshift(source.host);
    }
    delete source.host;

    if (relative.protocol) {
      delete relative.hostname;
      delete relative.auth;
      delete relative.port;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      delete relative.host;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    source.host = (relative.host || relative.host === '') ?
                      relative.host : source.host;
    source.search = relative.search;
    source.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    source.search = relative.search;
    source.query = relative.query;
  } else if ('search' in relative) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      source.host = srcPath.shift();
    }
    source.search = relative.search;
    source.query = relative.query;
    return source;
  }
  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    delete source.pathname;
    return source;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (source.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    source.host = isAbsolute ? '' : srcPath.shift();
  }

  mustEndAbs = mustEndAbs || (source.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  source.pathname = srcPath.join('/');


  return source;
}

function parseHost(host) {
  var out = {};
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    out.port = port.substr(1);
    host = host.substr(0, host.length - port.length);
  }
  if (host) out.hostname = host;
  return out;
}

});
_sardines.register("/modules/7c43bcdc/index.js", function(require, module, exports, __dirname, __filename) {
	var loggers = {};

var newLogger = function(module) {

	function logger(name) {

		return function(msg) {
			console.log(name + ": " + module + ": " + msg);
		}	
	}

	return {
		info: logger('info'),
		warn: logger('warn'),
		error: logger('error'),
		debug: logger('debug'),
		verbose: logger('verbose')
	};
}


exports.loggers = {
	get: function(name) {
		return loggers[name] || (loggers[name] = newLogger(name))
	}
}
});
_sardines.register("/modules/edd6af44/src/plugins/example.home/views.js", function(require, module, exports, __dirname, __filename) {
	module.exports = function(fig) {
		
	var views = fig.views;


	views.IndexView = views.Template.extend({
		
		tpl: '/index.html',

		'override render': function() {
			this._super();
		}
	});
	

	views.HelloView = views.View.extend({
		
		'el': '#page',

		'override render': function() {
			this._super();
			this.$$(this.el).html('html!');
		}
	});

	return views;
}
});
_sardines.register("/modules/edd6af44/src/plugins/example.home/index.js", function(require, module, exports, __dirname, __filename) {
	

exports.plugin = function(router) {
	
	var views;
	
	router.on({
		
		'push -pull fig': function(fig) {
			views = require('./views')(fig);
		},


		/**
		 */

		'pull -method=GET view -> home OR /': function(req, res) {
			req.addView(new views.IndexView());
			if(!this.next()) req.display();
		},

		/**
		 */

		'pull -method=GET home -> view -> hello': function(req, res) {
			
			req.addView(new views.HelloView());
			if(!this.next()) req.display();
		}
	})
}
});
_sardines.register("/modules/crema/lib/index.js", function(require, module, exports, __dirname, __filename) {
	

function parseTokens(route) {
	return route./*route.replace(/\//g,' ').*/replace(/\s+/g,' ').split(' ');
}

function splitOr(tokens, route, routes, start) {

	for(var i = start, n = tokens.length; i < n; i++) {
		var token = tokens[i];

		if(token.toLowerCase() == 'or') {
			var orRoute = route.concat();

			orRoute.pop();

			//skip one token
			orRoute.push(tokens[++i]);

			splitOr(tokens, orRoute, routes, i + 1);

			//this chunk of code will execute if we get a chain of OR statements such as:
			//-method=GET OR -method=POST OR -method=PUT. In which case, we need to skip them.     
			while(i < n - 1 && tokens[i + 1].toLowerCase() == 'or') {
				i += 2;
			}
		} else {
			route.push(token);
		}
	}


	routes.push(route);

	return routes;
}


function parseChannel(channel) {

	var paths = channel instanceof Array ? channel : channel.replace(/^\/|\/$/g,'').split(/[\s\/]+/g);

	var expr = { value: paths.join('/'), paths: [] };

	for(var i = 0, n = paths.length; i < n; i++) {
		var path = paths[i],
		isParam = (path.substr(0,1) == ':');

		expr.paths.push({ value: isParam ? path.substr(1) : path, param: isParam });
	}

	return expr;
}

function parseRouteChannels(rootExpr, tokens, start) {

	var n = tokens.length,
	currentExpression = rootExpr;
	currentExpression.channel = parseChannel(tokens[n - 1]);


	// console.log(start)
	for(var i = n - 2; i >= start; i--) {
		  
		var token = tokens[i], buffer = [];


		if(token == '->') continue;

		/*while(i >= start && token && token != '->') {

			buffer.unshift(token);
			token = tokens[--i];
		}*/


		//middleware flag - skip  
		

		currentExpression = currentExpression.thru = { channel: parseChannel(token) };
	}

	/*if(rootExpr.channel.paths[rootExpr.channel.paths.length - 1 ].value == '*') {
		rootExpr.channel.paths.pop();
		rootExpr.middleware = true;
	}*/

	return rootExpr;
}


function parseRoute(route, expressions) {
	
	var tokens = parseTokens(route),
	routes = splitOr(tokens, [], [], 0),
	currentRoute,
	expressions = [];


	for(var i = 0, n = routes.length; i < n; i++) {
		
		var routeTokens = routes[i],
		expr = { tags: {} },
		start = 0;
		
		if(routeTokens[0].match(/^\w+$/) && routeTokens[1] != '->' && routeTokens.length-1)
		{
			start = 1;
			expr.type = routeTokens[0];
		}

		for(var j = start, jn = routeTokens.length; j < jn; j++) {
			
			var routeToken = routeTokens[j];

			//is it a tag?
			if(routeToken.substr(0, 1) == '-') {
				
				var tagParts = routeToken.split('=');

				var tagName = tagParts[0].substr(1);//remove the dash
				
				expr.tags[tagName] = tagParts.length > 1 ? tagParts[1] : true;

				//continue until there are no more tags
				continue;
			} 

			expressions.push(parseRouteChannels(expr, routeTokens, j));
			break;
		}
	}


	return expressions;
}


module.exports = function(source) {
	return parseRoute(source);
}


module.exports.parseChannel = parseChannel;

module.exports.stringifyPaths = function(paths, params) {
	var stringified = [];
	if(!params) params = {};

	for(var i = 0, n = paths.length; i < n; i++) {

		var path = paths[i], pathValue;

		if(path.param) {
			pathValue = params[path] || ':' + path.value;
		} else {
			pathValue = path.value;
		}

		stringified.push(pathValue);

	}

	return stringified.join('/');
}


module.exports.stringifyTags = function(tags) {
	var stringified = [];

	for(var tagName in tags) {
		var tagValue = tags[tagName];

		if(tagValue === true) {
			stringified.push('-' + tagName);
		} else {
			stringified.push('-' + tagName+'='+tagValue);
		}
	}

	return stringified.join(' ');
}

module.exports.stringify = function(route) {
	
	var stringified = [];
	
	if(route.type) stringified.push(route.type);

	stringified.push(module.exports.stringifyTags(route.tags));
	stringified.push(module.exports.stringifyPaths(route.channel.paths));
	
	return stringified.join(' ');
}
});

_sardines.register("/modules/crema", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/crema/lib/index.js');
});
_sardines.register("/modules/beanpoll/lib/push/plugin.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Director;

  Director = require("./director");

  module.exports = function(router) {
    /*
    */
    var director;
    director = new Director("push", router);
    return {
      /*
      */
      name: director.name,
      /*
      */
      director: director,
      /*
      */
      newListener: function(listener) {
        return router.request('new/listener').tag('private', true).query(listener).push();
      },
      /*
      */
      router: {
        push: function(channel, query, headers) {
          return this.request(channel, query, headers).push(null);
        }
      },
      /*
      */
      message: {
        push: function(data) {
          var writer;
          writer = this.dispatch(director.name);
          if (!!arguments.length) writer.end(data);
          return writer;
        }
      }
    };
  };

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/pull/plugin.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Director, outcome;

  Director = require("./director");

  outcome = require("outcome");

  module.exports = function(router) {
    var director;
    director = new Director("pull", router);
    return {
      name: director.name,
      /*
      */
      director: director,
      /*
      */
      newListener: function(listener) {
        if (!!listener.route.tags.pull) {
          return router.request(listener.route.channel).headers(listener.route.tags).success(listener.callback).error(function() {}).pull();
        }
      },
      /*
      	 extend the router
      */
      router: {
        pull: function(channel, query, headers, callback) {
          return this._pull(channel, query, headers, callback, director.name);
        },
        _pull: function(channel, query, headers, callback, type) {
          if (typeof query === 'function') {
            callback = query;
            headers = null;
            query = null;
          }
          if (typeof headers === 'function') {
            callback = headers;
            headers = null;
          }
          return this.request(channel, query, headers)[type](callback);
        }
      },
      /*
      	 extend the message builder
      */
      message: {
        pull: function(query, callback) {
          return this._pull(query, callback, director.name);
        },
        _pull: function(query, callback, type) {
          if (typeof query === 'function') {
            callback = query;
            query = null;
          }
          if (!!query) this.query(query);
          if (!!callback) this.response(callback);
          return this.dispatch(type);
        }
      }
    };
  };

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/collect/plugin.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Director, outcome;

  Director = require("./director");

  outcome = require("outcome");

  module.exports = function(router) {
    var director;
    director = new Director("collect", router);
    return {
      name: director.name,
      director: director,
      router: {
        collect: function(channel, query, headers, callback) {
          return this._pull(channel, query, headers, callback, director.name);
        }
      },
      newListener: function(listener) {
        if (!!listener.route.tags.collect) {
          return router.request(listener.route.channel).headers(listener.route.tags).success(listener.callback).collect();
        }
      },
      message: {
        collect: function(query, callback) {
          return this._pull(query, callback, director.name);
        }
      }
    };
  };

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/plugins.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Message, _;

  Message = require('./message');

  _ = require('underscore');

  module.exports = (function() {
    /*
    */
    function _Class(router) {
      this.router = router;
      this._pluginsByName = {};
      this._using = [];
    }

    _Class.prototype.using = function() {
      return this._using;
    };

    /*
    */

    _Class.prototype.add = function(plugin) {
      var mod, plg, _i, _len;
      if (plugin instanceof Array) {
        for (_i = 0, _len = plugin.length; _i < _len; _i++) {
          plg = plugin[_i];
          this.add(plg);
        }
        return;
      }
      this._using.push(plugin);
      mod = plugin(this.router);
      this._pluginsByName[mod.name] = mod;
      _.extend(this.router._messageBuilder, mod.message);
      _.extend(this.router, mod.router);
      if (mod.director) return this.router.directors[mod.name] = mod.director;
    };

    /*
    */

    _Class.prototype.get = function(name) {
      return this._pluginsByName[name];
    };

    /*
    	 Used incase the listener needs to be handler for a particular reason, e.g: push -pull /some/route would be a binding.
    */

    _Class.prototype.newListener = function(listener) {
      return this._emit('newListener', listener);
    };

    /*
    */

    _Class.prototype._emit = function(type, data) {
      var plugin, pluginName, _results;
      _results = [];
      for (pluginName in this._pluginsByName) {
        plugin = this._pluginsByName[pluginName];
        if (plugin[type]) {
          _results.push(plugin[type](data));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return _Class;

  })();

}).call(this);

});
_sardines.register("/modules/disposable/lib/index.js", function(require, module, exports, __dirname, __filename) {
	

(function() {

	var disposable = {};
		


	disposable.create = function() {
		
		var self = {},
		disposables = [];


		self.add = function(disposable) {

			if(typeof disposable == 'function') {
				
				var disposableFunc = disposable, args = Array.prototype.slice.call(arguments, 0);

				//remove the func
				args.shift();


				disposable = {
					dispose: function() {
						disposableFunc.apply(null, args);
					}
				};
			}


			disposables.push(disposable);

			return {
				dispose: function() {
					var i = disposables.indexOf(disposable);

					if(i > -1) disposables.splice(i, 1);
				}
			};
		};

		self.addTimeout = function(timerId) {
			return self.add(clearTimeout, timerId);
		};

		self.addInterval = function(timerId) {
			return self.add(clearInterval, timerId);
		};



		self.dispose = function() {
			
			for(var i = disposables.length; i--;) {
				disposables[i].dispose();
			}

			disposables = [];
		};

		return self;
	}



	if(typeof module != 'undefined') {
		module.exports = disposable;
	}

	if(typeof window != 'undefined') {
		window.disposable = disposable;
	}


})();

var disposable = module.exports.create();


disposable.dispose();

});

_sardines.register("/modules/disposable", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/disposable/lib/index.js');
});
_sardines.register("/modules/beanpoll/lib/collections/linkedQueue.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var EventEmitter, LinkedQueue,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  module.exports = LinkedQueue = (function(_super) {

    __extends(LinkedQueue, _super);

    LinkedQueue.prototype.hasNext = true;

    /*
    	 moves into the next
    */

    function LinkedQueue(first, onNext) {
      this.first = first;
      LinkedQueue.__super__.constructor.call(this);
      this.last = first.getLastSibling();
      if (onNext) this._onNext = onNext;
    }

    /*
    	 moves onto the next request (middleware)
    */

    LinkedQueue.prototype.next = function() {
      if (!this.hasNext) return false;
      this._setNext();
      this._onNext(this.current, arguments);
      return true;
    };

    /*
    	 skips middleware
    */

    LinkedQueue.prototype.skipNext = function(count) {
      if (count == null) count = 2;
      if (!this.hasNext) return false;
      while ((count--) && this.hasNext) {
        this._setNext();
      }
      this._onNext(this.current);
      return true;
    };

    /*
    */

    LinkedQueue.prototype._setNext = function() {
      this.current = this.current ? this.current.getNextSibling() : this.first;
      this.hasNext = this.current.getNextSibling();
      if (!this.hasNext && !this.ended) {
        this.ended = true;
        return this._onEnd();
      }
    };

    /*
    */

    LinkedQueue.prototype._onNext = function(middleware) {};

    /*
    */

    LinkedQueue.prototype._onEnd = function() {};

    return LinkedQueue;

  })(EventEmitter);

  module.exports = LinkedQueue;

}).call(this);

});
_sardines.register("/modules/dolce/lib/index.js", function(require, module, exports, __dirname, __filename) {
	exports.collection = require('./collection');
});

_sardines.register("/modules/dolce", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/dolce/lib/index.js');
});
_sardines.register("/modules/beanpoll/lib/concrete/middleware.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var LinkedList, Middleware,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LinkedList = require("../collections/linkedList");

  module.exports = Middleware = (function(_super) {

    __extends(Middleware, _super);

    /*
    	 constructor
    */

    function Middleware(item, director) {
      this.director = director;
      this.listener = item.value;
      this.channel = {
        paths: item.cmpPath
      };
      this.params = item.params;
      this.tags = item.tags;
      this.path = item.path;
    }

    return Middleware;

  })(LinkedList);

  /*
   Wraps the chained callbacks in middleware
  */

  Middleware.wrap = function(chain, pre, next, director) {
    var current, item, prev, _i, _len;
    for (_i = 0, _len = chain.length; _i < _len; _i++) {
      item = chain[_i];
      current = new Middleware(item, director);
      if (prev) current.addPrevSibling(prev, true);
      prev = current;
    }
    if (typeof pre === 'function') {
      current.getFirstSibling().addPrevSibling(new Middleware({
        value: pre,
        params: {},
        tags: {},
        channel: {
          paths: []
        }
      }));
    }
    if (typeof next === 'function') {
      current.addNextSibling(new Middleware({
        value: next,
        params: {},
        tags: {},
        channel: {
          paths: []
        }
      }));
    }
    return current.getFirstSibling();
  };

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/io/reader.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Reader, Stream, disposable,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Stream = require("stream").Stream;

  disposable = require("disposable");

  module.exports = Reader = (function(_super) {

    __extends(Reader, _super);

    /*
    */

    function Reader(source) {
      this.source = source;
      Reader.__super__.constructor.call(this);
      this.setMaxListeners(0);
      this._listen();
    }

    /*
    	 needs to be overridable incase there's more stuff to listen to (headers)
    */

    Reader.prototype._listenTo = function() {
      return ["data", "end", "error"];
    };

    /*
    */

    Reader.prototype._listen = function() {
      var event, listeners, _fn, _i, _len, _ref,
        _this = this;
      this._buffer = [];
      listeners = disposable.create();
      if (this.source) {
        _ref = this._listenTo();
        _fn = function(event) {
          var onEvent;
          onEvent = function(arg1, arg2) {
            _this._started = true;
            return _this.emit(event, arg1, arg2);
          };
          _this.source.on(event, onEvent);
          return listeners.add(function() {
            return _this.source.removeListener(event, onEvent);
          });
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          _fn(event);
        }
      }
      this.on("data", function(data, encoding) {
        if (!_this._cache) return;
        return _this._buffer.push({
          chunk: data,
          encoding: encoding
        });
      });
      this.on("end", function() {
        if (_this.ended) throw new Error("Cannot end more than once");
        return _this.ended = true;
      });
      return this.on("error", function(err) {
        return _this.error = err;
      });
    };

    /*
    */

    Reader.prototype.setEncoding = function(encoding) {
      var _ref;
      return (_ref = this.source) != null ? _ref.setEncoding(encoding) : void 0;
    };

    /*
    */

    Reader.prototype.pause = function() {
      var _ref;
      return (_ref = this.source) != null ? typeof _ref.pause === "function" ? _ref.pause() : void 0 : void 0;
    };

    /*
    */

    Reader.prototype.resume = function() {
      var _ref;
      return (_ref = this.source) != null ? typeof _ref.resume === "function" ? _ref.resume() : void 0 : void 0;
    };

    /*
    */

    Reader.prototype.destroy = function() {
      var _ref;
      return (_ref = this.source) != null ? typeof _ref.destroy === "function" ? _ref.destroy() : void 0 : void 0;
    };

    /*
    */

    Reader.prototype.destroySoon = function() {
      var _ref;
      return (_ref = this.source) != null ? typeof _ref.destroySoon === "function" ? _ref.destroySoon() : void 0 : void 0;
    };

    /*
    	 flags the reader that data should be cached as it's coming in.
    */

    Reader.prototype.cache = function(value) {
      if (arguments.length) this._cache = value || !!this._buffer.length;
      return this._cache;
    };

    /*
     	 listens on a reader, and pipes it to a callback a few ways
    */

    Reader.prototype.dump = function(callback, ops) {
      var pipedStream, wrappedCallback;
      if (!ops) ops = {};
      wrappedCallback = this._dumpCallback(callback, ops);
      pipedStream = this._started ? new Reader(this) : this;
      wrappedCallback.call(this, null, pipedStream);
      if (!this._started) return;
      return this._dumpCached(pipedStream, ops);
    };

    /*
    */

    Reader.prototype._dumpCallback = function(callback, ops) {
      var listeners,
        _this = this;
      if (typeof callback === 'object') {
        ops.stream = true;
        listeners = callback;
        callback = function(err, stream) {
          var type, _results;
          _results = [];
          for (type in listeners) {
            _results.push(stream.on(type, listeners[type]));
          }
          return _results;
        };
      }
      if (ops.stream) return callback;
      return function(err, reader) {
        var buffer, onEnd;
        if (err) return callback(err);
        buffer = [];
        onEnd = function(err) {
          var chunk, _i, _len, _results;
          if (ops.batch) return callback.call(_this, err, buffer);
          if (!buffer.length) return callback.call(_this, err);
          if (ops.each) {
            _results = [];
            for (_i = 0, _len = buffer.length; _i < _len; _i++) {
              chunk = buffer[_i];
              _results.push(callback.call(_this, err, chunk));
            }
            return _results;
          } else {
            return callback.call(_this, err, buffer.length > 1 ? buffer : buffer[0]);
          }
        };
        reader.on("data", function(data, encoding) {
          return buffer.push(data);
        });
        reader.on("error", onEnd);
        return reader.on("end", onEnd);
      };
    };

    /*
    */

    Reader.prototype._dumpCached = function(pipedReader) {
      var data, _i, _len, _ref;
      _ref = this._buffer;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        pipedReader.emit("data", data.chunk, data.encoding);
      }
      if (this.ended) pipedReader.emit("end");
      if (this.error) return pipedReader.emit("error");
    };

    return Reader;

  })(Stream);

  Reader.prototype.readable = true;

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/io/writer.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Reader, Stream, Writer,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Stream = require("stream").Stream;

  Reader = require("./reader");

  module.exports = Writer = (function(_super) {

    __extends(Writer, _super);

    function Writer() {
      Writer.__super__.constructor.call(this);
      this.setMaxListeners(0);
    }

    /*
    */

    Writer.prototype.error = function(err) {
      if (typeof err === 'string') err = new Error(err);
      return this.emit("error", err);
    };

    /*
    */

    Writer.prototype.write = function(chunk, encoding) {
      if (encoding == null) encoding = "utf8";
      return this.emit("data", chunk, encoding);
    };

    /*
    */

    Writer.prototype.end = function(chunk, encoding) {
      if (chunk) this.write(chunk, encoding);
      if (this.ended) throw new Error("Cannot call end twice");
      this.ended = true;
      this.emit("end");
      return this;
    };

    /*
    */

    Writer.prototype.reader = function() {
      return new Reader(this);
    };

    return Writer;

  })(Stream);

  Writer.prototype.writable = true;

}).call(this);

});
_sardines.register("/modules/outcome/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var EventEmitter = require('events').EventEmitter,

//used for dispatching unhandledError messages
globalEmitter = new EventEmitter();


var Chain = function(listeners) {

	if(!listeners) listeners = { };


	var fn = function() {

		var args = Array.apply(null, arguments), orgArgs = arguments;

		if(listeners.callback) {

			listeners.callback.apply(this, args);

		}

		if(listeners.handle) {
			
			listeners.handle.apply(listeners, args);

		} else {

			//error should always be first args
			err = args.shift();

			//on error
			if(err) {

				listeners.error.call(this, err);

			} else
			if(listeners.success) {
				
				listeners.success.apply(this, args);

			}

		}	
		
	};

	fn.listeners = listeners;

	//DEPRECATED
	fn.done = function(fn) {

		return fn.callback(fn);

	}

	fn.handle = function(value) {

		return _copy({ handle: value });
		
	}

	fn.callback = function(value) {
		
		return _copy({ callback: value });

	}

	fn.success = function(value) {
			
		return _copy({ success: value });

	}

	fn.error = function(value) {

		return _copy({ error: value });

	}


	//error does not exist? set the default which throws one
	if(!listeners.error) {

		listeners.error = function(err) {

			//no error callback? check of unhandled error is present, or throw
			if(!globalEmitter.emit('unhandledError', err) && !listeners.callback) throw err;

		}

	}


		
	function _copy(childListeners) {

		//copy these listeners to a new chain
		for(var type in listeners) {
			
			if(childListeners[type]) continue;

			childListeners[type] = listeners[type];

		}

		return Chain(childListeners);

	}

	return fn;
}


module.exports = function(listeners) {

	return Chain(listeners);

}

//bleh this could be better. Need to copy the chain functions to the module.exports var
var chain = Chain();

//copy the obj keys to module.exports
Object.keys(chain).forEach(function(prop) {
	
	//on call of error, success, callback - make a new chain
	module.exports[prop] = function() {
		
		var child = Chain();

		return child[prop].apply(child, arguments);
	}
});


//running online?
if(typeof window != 'undefined') {
	
	window.outcome = module.exports;

}





});

_sardines.register("/modules/outcome", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/outcome/lib/index.js');
});
_sardines.register("/modules/events", function(require, module, exports, __dirname, __filename) {
	// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var isArray = Array.isArray;

function EventEmitter() { }
exports.EventEmitter = EventEmitter;

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function() {
  var type = arguments[0];
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var l = arguments.length;
    var args = new Array(l - 1);
    for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // If we've already got an array, just append.
    this._events[type].push(listener);

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('.once only takes instances of Function');
  }

  var self = this;
  function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  };

  g.listener = listener;
  self.on(type, g);

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var position = -1;
    for (var i = 0, length = list.length; i < length; i++) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener))
      {
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    list.splice(position, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (list === listener ||
             (list.listener && list.listener === listener))
  {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

});
_sardines.register("/modules/haba/lib/nameTester.js", function(require, module, exports, __dirname, __filename) {
	module.exports = function(search) {

	if(!search) {
		return function() { return true; }	
	}

	var tos = typeof search, reg, test;

	if(tos == 'string') {
		reg = new RegExp('^' + search + '$');
	} else 
	if(!(search instanceof RegExp)) {
		reg = search;
	} else {
		reg = search;
	}

	if(reg instanceof RegExp) {
		test = function(name) {
			return !!name.match(reg);
		}
	} else {
		test = reg;
	}

	return test;
}
});
_sardines.register("/modules/haba/lib/collection.js", function(require, module, exports, __dirname, __filename) {
	
var pluginNameTester = require('./nameTester'),
tq = require('tq');

module.exports = function(haba, parent) {
	
	var children = [],
	plugins = {},
	queue = tq.queue(),
	initialized = false;

	var self = {

		/**
		 * sep between all, local, and remote plugins
		 */

		addChild: function() {
			var child = module.exports(haba, self);
			children.push(child);
			return child;
		},


		/**
		 */

		'plugin': function(search) {
			return self.plugins(search)[0];
		},

		/**
		 */

		'add': function(ops) {
			plugins[ops.name] = {
				instance: ops.instance,
				require: ops.require
			};
		},

		/**
		 */

		'plugins': function(search) {

			var test = pluginNameTester(search), matches = [];

			for(var name in plugins) {
				if(test(name)) {
					matches.push(plugins[name].instance);
				}
			}	


			children.forEach(function(child) {
				matches = matches.concat(child.plugins(search));
			});

			return matches;
		},


		/**
		 */

		'root': function() {
			
			var par = this;
			
			while(par.parent()) par = par.parent();
			
			return par;	

		},

		/**
		 */

		'parent': function() {
			return parent;	
		},

		/**
		 */

		'emit': function(type) {
			
			var params = Array.apply(null, arguments),
			args = params.concat();
			params.shift();//remove type


			queue.push(function() {
				for(var name in plugins) {
					var plugin = plugins[name];
					if(plugin.instance[type]) {
						plugin.instance[type].apply(plugin.instance, params);
					}
				}	


				children.forEach(function(child) {
					child.emit.apply(child, args);
				});

				this();
			});

			return haba;
		},

		/**
		 */

		'next': function(callback) {
			queue.push(callback);
			return haba;
		},


		/**
		 */

		'ready': function() {
			if(initialized) return;
			initialized = true;

			queue.start();

			for(var name in plugins) {
				var plugin = plugins[name];
				
				(plugin.require || []).forEach(function(req) {
					var plugins = self.root().plugins(req.search);

					if(!plugins.length) throw new Error('Unable to find plugin ' + req.search + ' in ' + name);
				});
			}

			children.forEach(function(child) {
				child.ready();
			});

		}
	};

	return self;
}
});
_sardines.register("/modules/structr/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = function (target, parent)
{
	if (!parent) parent = Structr.fh({});

	var that = Structr.extend.apply(null, [parent].concat(target))

	that.__construct.prototype = that;

	if(!that.__construct.extend)
	//allow for easy extending.
	that.__construct.extend = function()
	{
		return Structr(Structr.argsToArray(arguments), that);
	};

	//return the constructor
	return that.__construct;
}; 


Structr.argsToArray = function(args)
{
	var ar = new Array(args.length);
	for(var i = args.length; i--;) ar[i] = args[i];
	return ar;
}

Structr.copy = function (from, to, lite)
{
	if(typeof to == 'boolean')
	{
		lite = to;
		to = undefined;
	}
	
	if (!to) to = from instanceof Array ? [] : {};  
	
	var i;

	for(i in from) 
	{
		var fromValue = from[i],
		toValue = to[i],
		newValue;

		//don't copy anything fancy other than objects and arrays. this could really screw classes up, such as dates.... (yuck)
		if (!lite && typeof fromValue == 'object' && (!fromValue || fromValue.__proto__ == Object.prototype || fromValue.__proto__ == Array.prototype)) 
		{

			//if the toValue exists, and the fromValue is the same data type as the TO value, then
			//merge the FROM value with the TO value, instead of replacing it
			if (toValue && fromValue instanceof toValue.constructor)
			{
				newValue = toValue;
			}

			//otherwise replace it, because FROM has priority over TO
			else
			{
				newValue = fromValue instanceof Array ? [] : {};
			}

			Structr.copy(fromValue, newValue);
		}
		else 
		{
			newValue = fromValue;
		}

		to[i] = newValue;
	}

	return to;
};


//returns a method owned by an object
Structr.getMethod = function (that, property)
{
	return function()
	{
		return that[property].apply(that, arguments);
	};
};     

Structr.wrap = function(that, prop)
{
	if(that._wrapped) return that;

	that._wrapped = true;

	function wrap(target)
	{
		return function()
		{
			return target.apply(that, arguments);
		}
	}

	if(prop)
	{
		that[prop] = wrap(target[prop]);
		return that;	
	}

	for(var property in that)
	{
		var target = that[property];
			
		if(typeof target == 'function')
		{
			that[property] = wrap(target);
		}
	}

	return that;
}  

//finds all properties with modifiers
Structr.findProperties = function (target, modifier)
{
	var props = [],
		property;

	for(property in target)
	{
		var v = target[property];

		if (v && v[modifier])
		{
			props.push(property);
		}
	}

	return props;
};

Structr.nArgs = function(func)
{
	var inf = func.toString().replace(/\{[\W\S]+\}/g, '').match(/\w+(?=[,\)])/g);
	return inf ? inf.length :0;
}

Structr.getFuncsByNArgs = function(that, property)
{
	return that.__private['overload::' + property] || (that.__private['overload::' + property] = {});
}

Structr.getOverloadedMethod = function(that, property, nArgs)
{
	var funcsByNArgs = Structr.getFuncsByNArgs(that, property);
	
	return funcsByNArgs[nArgs];
}

Structr.setOverloadedMethod = function(that, property, func, nArgs)
{
	var funcsByNArgs = Structr.getFuncsByNArgs(that, property);
	
	if(func.overloaded) return funcsByNArgs;
	
	funcsByNArgs[nArgs || Structr.nArgs(func)] = func;
	
	return funcsByNArgs;
}

//modifies how properties behave in a class
Structr.modifiers =  {

	/**
	* overrides given method
	*/

	m_override: function (that, property, newMethod)
	{
		var oldMethod = (that.__private && that.__private[property]) || that[property] || function (){},
			parentMethod = oldMethod;
		
		if(oldMethod.overloaded)
		{
			var overloadedMethod = oldMethod,
				nArgs = Structr.nArgs(newMethod);
			parentMethod = Structr.getOverloadedMethod(that, property, nArgs);
		}
		
		//wrap the method so we can access the parent overloaded function
		var wrappedMethod = function ()
		{
			this._super = parentMethod;
			var ret = newMethod.apply(this, arguments);
			delete this._super;
			return ret;
		}
		
		if(oldMethod.overloaded)
		{
			return Structr.modifiers.m_overload(that, property, wrappedMethod, nArgs);
		}
		
		return wrappedMethod;
	},


	/**
	* getter / setter which are physical functions: e.g: test.myName(), and test.myName('craig')
	*/

	m_explicit: function (that, property, gs)
	{
		var pprop = '__'+property;

		//if GS is not defined, then set defaults.
		if (typeof gs != 'object') 
		{
			gs = {};
		}

		if (!gs.get) 
		gs.get = function ()
		{
			return this._value;
		}

		if (!gs.set) 
		gs.set = function (value)
		{
			this._value = value;
		}


		return function (value)
		{
			//getter
			if (!arguments.length) 
			{
				this._value = this[pprop];
				var ret = gs.get.apply(this);
				delete this._value;
				return ret;
			}

			//setter
			else 
			{
				//don't call the gs if the value isn't the same
				if (this[pprop] == value ) 
				return;

				//set the current value to the setter value
				this._value = this[pprop];

				//set
				gs.set.apply(this, [value]);

				//set the new value. this only matters if the setter set it 
				this[pprop] = this._value;
			}
		};
	},

    /**
 	 */

	m_implicit: function (that, property, egs)
	{
		//keep the original function available so we can override it
		that.__private[property] = egs;

		that.__defineGetter__(property, egs);
		that.__defineSetter__(property, egs);
	},
	
	/**
	 */
	
	m_overload: function (that, property, value, nArgs)
	{                    
		var funcsByNArgs = Structr.setOverloadedMethod(that, property, value, nArgs);
				
		var multiFunc = function()
		{          
			var func = funcsByNArgs[arguments.length];
			
			if(func)
			{
				return funcsByNArgs[arguments.length].apply(this, arguments);
			}             
			else
			{
				var expected = [];
				
				for(var sizes in funcsByNArgs)
				{
					expected.push(sizes);
				}
				
				throw new Error('Expected '+expected.join(',')+' parameters, got '+arguments.length+'.');
			}
		}    
		
		multiFunc.overloaded = true;                                          
		
		return multiFunc; 
	}
}               


//extends from one class to another. note: the TO object should be the parent. a copy is returned.
Structr.extend = function ()
{
	var from = arguments[0],
	to = {};

	for(var i = 1, n = arguments.length; i < n; i++)
	{
		var obj = arguments[i];

		Structr.copy(obj instanceof Function ? obj() : obj, to);
	}


	var that = {
		__private: {

			//contains modifiers for all properties of object
			propertyModifiers: {}
		}
	};


	Structr.copy(from, that);

	var usedProperties = {},
	property;

	for(property in to) 
	{
		var value = to[property];


		var propModifiersAr = property.split(' '), //property is at the end of the modifiers. e.g: override bindable testProperty
		propertyName = propModifiersAr.pop(),

		modifierList = that.__private.propertyModifiers[propertyName] || (that.__private.propertyModifiers[propertyName] = []);
                                
             
		if (propModifiersAr.length) 
		{
			var propModifiers = {};
			for(var i = propModifiersAr.length; i--;) 
			{
				var modifier = propModifiersAr[i];

				propModifiers['m_' + propModifiersAr[i]] = 1;

				if (modifierList.indexOf(modifier) == -1)
				{
					modifierList.push(modifier);
				}
			}      
			
			if(propModifiers.m_merge)
			{
				value = Structr.copy(from[propertyName], value);
			}             

			//if explicit, or implicit modifiers are set, then we need an explicit modifier first
			if (propModifiers.m_explicit || propModifiers.m_implicit) 
			{
				value = Structr.modifiers.m_explicit(that, propertyName, value);
			}

			if (propModifiers.m_override) 
			{
				value = Structr.modifiers.m_override(that, propertyName, value);
			}

			if (propModifiers.m_implicit) 
			{
				//getter is set, don't continue.
				Structr.modifiers.m_implicit(that, propertyName, value);
				continue;
			}
		}

		for(var j = modifierList.length; j--;)
		{
			value[modifierList[j]] = true;
		}
		
		if(usedProperties[propertyName])
		{                       
			var oldValue = that[propertyName];
			
			//first property will NOT be overloaded, so we need to check it here
			if(!oldValue.overloaded) Structr.modifiers.m_overload(that, propertyName, oldValue, undefined);
			 
			value = Structr.modifiers.m_overload(that, propertyName, value, undefined);
		}	
		
		usedProperties[propertyName] = 1;

		that.__private[propertyName] = that[propertyName] = value;
	}

	//if the parent constructor exists, and the child constructor IS the parent constructor, it means
	//the PARENT constructor was defined, and the  CHILD constructor wasn't, so the parent prop was copied over. We need to create a new function, and 
	//call the parent constructor when the child is instantiated, otherwise it'll be the same class essentially (setting proto)
	if (that.__construct && from.__construct && that.__construct == from.__construct)
	{
		that.__construct = Structr.modifiers.m_override(that, '__construct', function()
		{
			this._super.apply(this, arguments);
		});
	}
	else
	if(!that.__construct)
	{
		that.__construct = function() {};
	}


	//copy 
	for(var property in from.__construct)
	{
		if(from.__construct[property]['static'] && !that[property])
		{
			that.__construct[property] = from.__construct[property];
		}
	}

     
	var propertyName;
	
	//apply the static props
	for(propertyName in that) 
	{
		var value = that[propertyName];

		//if the value is static, then tack it onto the constructor
		if (value && value['static'])
		{
			that.__construct[propertyName] = value;
			delete that[propertyName];
		}                                                                  
	}



	return that;
}


//really.. this isn't the greatest idea if a LOT of objects
//are being allocated in a short perioud of time. use the closure
//method instead. This is great for objects which are instantiated ONCE, or a couple of times :P.
Structr.fh = function (that)
{
	that = Structr.extend({}, that);

	//deprecated
	that.getMethod = function (property)
	{
		return Structr.getMethod(this, property);
	}

	that.extend = function ()
	{
		return Structr.extend.apply(null, [this].concat(arguments))
	}

	//copy to target object
	that.copyTo = function (target, lite)
	{
		Structr.copy(this, target, lite);
	}   

	//wraps the objects methods so this always points to the right place
	that.wrap = function(property)
	{
		return Structr.wrap(this, property);
	}

	return that;
}
                                        
module.exports = Structr;


});

_sardines.register("/modules/structr", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/structr/lib/index.js');
});
_sardines.register("/modules/punycode", function(require, module, exports, __dirname, __filename) {
	// Copyright (C) 2011 by Ben Noordhuis <info@bnoordhuis.nl>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

exports.encode = encode;
exports.decode = decode;

var TMIN = 1;
var TMAX = 26;
var BASE = 36;
var SKEW = 38;
var DAMP = 700; // initial bias scaler
var INITIAL_N = 128;
var INITIAL_BIAS = 72;
var MAX_INTEGER = Math.pow(2, 53);

function adapt_bias(delta, n_points, is_first) {
  // scale back, then increase delta
  delta /= is_first ? DAMP : 2;
  delta += ~~(delta / n_points);

  var s = (BASE - TMIN);
  var t = ~~((s * TMAX) / 2); // threshold=455

  for (var k = 0; delta > t; k += BASE) {
    delta = ~~(delta / s);
  }

  var a = (BASE - TMIN + 1) * delta;
  var b = (delta + SKEW);

  return k + ~~(a / b);
}

function next_smallest_codepoint(codepoints, n) {
  var m = 0x110000; // unicode upper bound + 1

  for (var i = 0, len = codepoints.length; i < len; ++i) {
    var c = codepoints[i];
    if (c >= n && c < m) {
      m = c;
    }
  }

  // sanity check - should not happen
  if (m >= 0x110000) {
    throw new Error('Next smallest code point not found.');
  }

  return m;
}

function encode_digit(d) {
  return d + (d < 26 ? 97 : 22);
}

function decode_digit(d) {
  if (d >= 48 && d <= 57) {
    return d - 22; // 0..9
  }
  if (d >= 65 && d <= 90) {
    return d - 65; // A..Z
  }
  if (d >= 97 && d <= 122) {
    return d - 97; // a..z
  }
  throw new Error('Illegal digit #' + d);
}

function threshold(k, bias) {
  if (k <= bias + TMIN) {
    return TMIN;
  }
  if (k >= bias + TMAX) {
    return TMAX;
  }
  return k - bias;
}

function encode_int(bias, delta) {
  var result = [];

  for (var k = BASE, q = delta;; k += BASE) {
    var t = threshold(k, bias);
    if (q < t) {
      result.push(encode_digit(q));
      break;
    }
    else {
      result.push(encode_digit(t + ((q - t) % (BASE - t))));
      q = ~~((q - t) / (BASE - t));
    }
  }

  return result;
}

function encode(input) {
  if (typeof input != 'string') {
    throw new Error('Argument must be a string.');
  }

  input = input.split('').map(function(c) {
    return c.charCodeAt(0);
  });

  var output = [];
  var non_basic = [];

  for (var i = 0, len = input.length; i < len; ++i) {
    var c = input[i];
    if (c < 128) {
      output.push(c);
    }
    else {
      non_basic.push(c);
    }
  }

  var b, h;
  b = h = output.length;

  if (b) {
    output.push(45); // delimiter '-'
  }

  var n = INITIAL_N;
  var bias = INITIAL_BIAS;
  var delta = 0;

  for (var len = input.length; h < len; ++n, ++delta) {
    var m = next_smallest_codepoint(non_basic, n);
    delta += (m - n) * (h + 1);
    n = m;

    for (var i = 0; i < len; ++i) {
      var c = input[i];
      if (c < n) {
        if (++delta == MAX_INTEGER) {
          throw new Error('Delta overflow.');
        }
      }
      else if (c == n) {
        // TODO append in-place?
        // i.e. -> output.push.apply(output, encode_int(bias, delta));
        output = output.concat(encode_int(bias, delta));
        bias = adapt_bias(delta, h + 1, b == h);
        delta = 0;
        h++;
      }
    }
  }

  return String.fromCharCode.apply(String, output);
}

function decode(input) {
  if (typeof input != 'string') {
    throw new Error('Argument must be a string.');
  }

  // find basic code points/delta separator
  var b = 1 + input.lastIndexOf('-');

  input = input.split('').map(function(c) {
    return c.charCodeAt(0);
  });

  // start with a copy of the basic code points
  var output = input.slice(0, b ? (b - 1) : 0);

  var n = INITIAL_N;
  var bias = INITIAL_BIAS;

  for (var i = 0, len = input.length; b < len; ++i) {
    var org_i = i;

    for (var k = BASE, w = 1;; k += BASE) {
      var d = decode_digit(input[b++]);

      // TODO overflow check
      i += d * w;

      var t = threshold(k, bias);
      if (d < t) {
        break;
      }

      // TODO overflow check
      w *= BASE - t;
    }

    var x = 1 + output.length;
    bias = adapt_bias(i - org_i, x, org_i == 0);
    // TODO overflow check
    n += ~~(i / x);
    i %= x;

    output.splice(i, 0, n);
  }

  return String.fromCharCode.apply(String, output);
}

});
_sardines.register("/modules/querystring", function(require, module, exports, __dirname, __filename) {
	// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// Query String Utilities

var QueryString = exports;


function charCode(c) {
  return c.charCodeAt(0);
}


QueryString.unescape = function(s, decodeSpaces) {
  return decodeURIComponent(s);////QueryString.unescapeBuffer(s, decodeSpaces).toString();
};


QueryString.escape = function(str) {
  return encodeURIComponent(str);
};

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};


QueryString.stringify = QueryString.encode = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  obj = (obj === null) ? undefined : obj;

  switch (typeof obj) {
    case 'object':
      return Object.keys(obj).map(function(k) {
        if (Array.isArray(obj[k])) {
          return obj[k].map(function(v) {
            return QueryString.escape(stringifyPrimitive(k)) +
                   eq +
                   QueryString.escape(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return QueryString.escape(stringifyPrimitive(k)) +
                 eq +
                 QueryString.escape(stringifyPrimitive(obj[k]));
        }
      }).join(sep);

    default:
      if (!name) return '';
      return QueryString.escape(stringifyPrimitive(name)) + eq +
             QueryString.escape(stringifyPrimitive(obj));
  }
};

// Parse a key=val string.
QueryString.parse = QueryString.decode = function(qs, sep, eq) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  qs.split(sep).forEach(function(kvp) {
    var x = kvp.split(eq);
    var k = QueryString.unescape(x[0], true);
    var v = QueryString.unescape(x.slice(1).join(eq), true);

    if (!obj.hasOwnProperty(k)) {
      obj[k] = v;
    } else if (!Array.isArray(obj[k])) {
      obj[k] = [obj[k], v];
    } else {
      obj[k].push(v);
    }
  });

  return obj;
};

});
_sardines.register("/modules/faebed62/views/index.js", function(require, module, exports, __dirname, __filename) {
	
});
_sardines.register("/modules/faebed62/views/model.js", function(require, module, exports, __dirname, __filename) {
	var View = require('./concrete');


var ItemView = exports.Item = View.extend({
	

	/**
	 */

	'merge _binders': {

		'value': function(action, target, properties)
		{
			var self = this;


			if(!self._data) return;

			function bind(elementProp, dataProp)
			{
				target[elementProp](self._data.get(dataProp));

				// target.attr(elementProp, self._data.get(dataProp));

				self._data.subscribe(dataProp, function(value)
				{
					target.attr(elementProp, value);
				})

				target.bind('change', function()
				{
					if(!self._data) return;

					self._data.set(dataProp, target[elementProp]());

					//todo. why the hell is this here??

					if(self._data.save) self._data.save()
				})	
			}


			for(var elementProp in properties)
			{
				bind(elementProp, properties[elementProp]);
			}
		}
	},

	/**
	 */

	'override setup': function(ops)
	{
		this._super(ops);

		if(this.ops.data) this.data(this.ops.data);

		return this;
	},


	/**
	 */

	'data': function(v, skipLoad)
	{
		if(!arguments.length) return this._data;

		this._data = v;

		if(this.initialized)
		{
			if(v) this.listenToData(v);
			if(!skipLoad) this.loadData();

			//update EVERYFING
			this.update();
		}
	},


	/**
	 */

	'override init': function()
	{
		this._super.apply(this, arguments);

		if(this._data) this.data(this._data);
	},


	/**
	 */

	'listenToData': function(data)
	{
		if(this._dataSubscription) this._dataSubscription.dispose();

		var self = this;

		this._dataSubscription = data.subscribe({
			'update': this.getMethod('onDataChange')
		});
	},

	/**
	 */

	'onDataChange': function()
	{
		this.update();
	},

	/**
	 */

	'loadData': function(next)
	{
		if(!this._data || this._data.loaded || !this._data.load) 
		{
			if(next) next();
			return;
		}


		var self = this;

		this._data.load(function()
		{
			if(next) next();
		});
	},

	/**
	 */

	'removeData': function()
	{                                                                                                            
		if(this.data()) this.data().remove();
	},

	/**
	 */

	'override instructions': function()
	{
		return this._super().concat(['loadData']);
	}

});


var CollectionView = exports.Collection = ItemView.extend({
	
	/**
	 */

	'override __construct': function(ops)
	{
		this._super(ops);


		if(this.ops.view) this.view = this.ops.view;
	},

	/**
	 */

	'override setup': function(ops)
	{
		this._super(ops);

		this.view = this.ops.view ? this.ops.view : (this.view || 'View');
		this.tag = this.ops.tag || this.tag;
	},

	/**
	 */

	'listenToData': function(data)
	{
		if(this._collectionSubscription) this._collectionSubscription.dispose();

		this._collectionSubscription = data.subscribe({
			'add': this.getMethod('add'),
			'reset': this.getMethod('render'),
			'remove': this.getMethod('remove')
		});

		if(data.loaded) this.render();
	},


	'override render': function()
	{
		this._super();

		if(!this.el || !this.data()) return;


		this.childrenEl = this.children ? this.$(this.children)[0] : this.el;
		if(!this.childrenEl) console.warn(this.children + ' does not exist');
		this.childrenEl.innerHTML = '';

		this.data().each(this.getMethod('add'));	
	},

	'add': function(item, index)
	{
		var el = this.childHolderElement(item, index);

		// var el = this.el.
		var view = this.create(item, el);

		if(this.childrenEl) this.childrenEl.appendChild(el);
	},

	/**
	 */

	'childHolderElement': function(item, index)
	{
		return this.document.createElement(this.tag || 'div');
	},

	/**
	 */

	'remove': function(item, index)
	{
		var child = this.childrenEl.childNodes[index];
		if(child) this.childrenEl.removeChild(child);
	},

	/**
	 * creates a view from an item
	 */

	'create': function(item, element)
	{
		var v = this.newView(item);
		v.setup({ el: element }, element);
		var view = this.addChild(v);
	},

	/**
	 * override me
	 */

	'newView': function(item, element)
	{
		console.log(this.views)
		return new this.views[this.view]({ data: item });
	}

});
});
_sardines.register("/modules/faebed62/views/template.js", function(require, module, exports, __dirname, __filename) {
	var model = require('./model'),
View = require('./concrete'),
Parser = require('../template/parser'),
logger = require('mesh-winston').loggers.get('fig'),
sprintf = require('sprintf').sprintf;

var TemplateViewPartial = {
	
	/**
	 */

	'override setup': function(ops) {

		this._super(ops);

		this.tpl = this.ops.tpl || this.tpl;

		return this;

	},


	/**
	 * the data to use to fill in the template
	 */

	'templateData': function() {

		return { };

	},

	/**
	 * render the template
	 */


	'override render': function() {

		var self = this, _super = this._super;


		if(!this.templateSource) return;

		var scriptsRegexp = /<script.*?>[\w\W]*?<\/script>/g;

		var scripts = this.templateSource.match(scriptsRegexp) || [],
		placeHolder = '||||script||||';
		
		
		//we need to TEMPORARILY block out templates so they don't get parsed on load
		Parser.parse(this.templateType, this.templateSource.replace(scriptsRegexp, placeHolder), this.templateData(), function(content) {

			if(!content) content = self.templateSource;

			while(scripts.length) {

				content = content.replace(placeHolder, scripts.shift());

			}

			if(self.el == self.document && typeof window != 'undefined') return;

			//server-side?
			if(typeof window == 'undefined') {

				self.el.innerHTML = String(content);

			} else {

				self.$$(self.el).html(String(content));

			}		

		});	

		_super.call(this);
	},

	/**
	 */

	'override instructions': function() {
		return ['_loadTemplate'].concat(this._super());
	},

	/**
	 * loads in a template, this should happen *once*
	 */

	'_loadTemplate': function(next) {

		logger.verbose(sprintf('loading template %s', this.tpl));

		if(!this.tpl || this.loadedTemplate) {

			console.warn('Cannot load template');

			return next();

		}

		this.loadedTemplate = true;

		var self = this;

		function onTemplate(source, type) {

			logger.verbose('loaded template');

			self.templateSource = source;
			self.templateType = type;
			next();
			
		}

		if(this.tpl.substr(0, 1) == '#') {

			var el = this.document.getElementById(this.tpl.substr(1));

			//text/x-tmpl-
			if(el) {

				onTemplate(el.innerText || el.text || el.textContent, el.getAttribute('type').substr(12));

			} else {

				console.warn('Template %s does not exist', this.tpl);

			}
		} else {


			this.router.request('template').query({ name: this.tpl }).headers({ cache: true }).success(function(content) {

				onTemplate(content, self.tpl.split('.').pop());

			}).pull();

		}
	}
}


var ModelTemplatePartial = {
	

	/**
	 */

	'templateData': function() {

		return this.data ? this.data().doc : {};

	}
};

exports.Template           = View.extend(TemplateViewPartial);
exports.ItemTemplate       = model.Item.extend(TemplateViewPartial, ModelTemplatePartial);
exports.CollectionTemplate = model.Collection.extend(TemplateViewPartial, ModelTemplatePartial);
});
_sardines.register("/modules/faebed62/views/concrete.js", function(require, module, exports, __dirname, __filename) {
	var View = require('./abstract');

module.exports = View.extend({


	/**
	 * need to override listen so we also comb through the element for any anchor links, and stuff
	 * that needs to be replaces to make the app for of an SPA
	 */

	'override listen': function() {

		this._super();
		
		//come through the element - goes through the links and replaces listens to them primarily. 
		//Not needed server-side, good client-side.
		this.router.push('comb/element', { element: this.el });
	}
});
});
_sardines.register("/modules/faebed62/template/parser.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr');


module.exports = new (Structr({

	/**
	 */

	'__construct': function()
	{
		this._parsers = {};
	},
	
	/**
	 */

	'add': function(type, adapter)
	{
		this._parsers[type] = adapter;
	},

	/**
	 */

	'parse': function(type, content, data, callback)
	{
		var parser = this._parsers[type];

		if(!parser) return callback();

		parser.parse(content, data, callback);
	}
}));

});
_sardines.register("/modules/faebed62/template/adapters/mustache/index.js", function(require, module, exports, __dirname, __filename) {
	var Mustache = require('./mustache');


exports.parse = function(template, data, callback)
{
	callback(Mustache.to_html(template, data));
}

});
_sardines.register("/modules/faebed62/mixin/errorHandling.js", function(require, module, exports, __dirname, __filename) {
	var outcome = require('outcome');

/**
 * handles error
 */


module.exports = {

	/**
	 */

	'errorEl': '.alert-message',
	
	/**
	 */

	'successCb': function(callback) {
		return this.outcome().success(callback);
	},

	/**
	 */

	'outcome': function() {
		return this._outcome || outcome.error(this.getMethod('onError'));
	},

	/**
	 * called when an error happens remotely
	 */

	'onError': function(err) {
		// console.log(this.$())
		// this.$(ths.errorEl).alert('close')
		this.$(this.errorEl).find('.message').html(err.message);
		// this.$(this.errorEl).css({'display':'block'});
		this.$(this.errorEl).slideDown(200);

		var self = this;

		setTimeout(function() {
			self.$(self.errorEl).slideUp(200);//.css({'display':'none'});
		}, 1000 * 5);
	}
	
	 
};
});
_sardines.register("/modules/faebed62/plugins/views/viewChain.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
logger = require('mesh-winston').loggers.get('views.core'),
sprintf = require('sprintf').sprintf;


                 
var ViewChain = module.exports = Structr({    

	/**
	 */

	'__construct': function(parent, root)
	{
		this._parent = parent;          
		this._root   = root || this;   
	},     

	/**
	 */

	'contains': function(name)
	{
		return this.view && this.view.name == name;
	}, 


	/**  
	 * applies the view chain to the request, or subifies it.
	 */


	'next': function(req, res, name)
	{   


		//already view chained? subify.
		if(!this.__nextViewChain || this.__nextViewChain.name != name)
		{                                                   
			if(this.__nextViewChain) logger.verbose(sprintf('"%s" replaced by view "%s" ',this.__nextViewChain.name, name));

			this._nextViewChain().clearView().apply(req, res, name);   
		}    

		return this.__nextViewChain;
	},   

	/**
	 */

	'apply': function(req, res, name)
	{
		var self = this;     
		self.name = name;

		//sets a view and adds a view to the current view
		req.addView = function(view)
		{                      
			logger.debug('add view');   

			view.name = self.name;
			self.view = view;            

			//parent exists? add the child.
			if(self._parent && self._parent.view) 
			{

				logger.verbose(sprintf('"%s" adding child "%s"', self._parent.name, self.name));

				self._parent.view.addChild(view, self.name);
			}

			return self;
		}                     

		if(!req.viewChained)
		{                         
			this.applyRoot(req, res);
		}
	},


	/**
	 */

	'clearView': function()
	{
		if(!this.view) return this;              
		this.view.remove();          
		this.view = null;   
		if(this.__nextViewChain) {
			this.__nextViewChain.clearView();
			this.__nextViewChain = null;
		}    
		return this;
	},


	/**
	 */

	'applyRoot': function(req, res)
	{                           
		var self = this;

		req.viewChained = true;     

		req.display = function(callback)
		{                          
			logger.debug('display view');


			if(callback) self._root.view.subscribeOnce('complete', callback);


			self._root.view.send(res);
		}

		req.addRootView = function(view)
		{             
			logger.debug('add root view');

			view.name = self.name;
			self.view = view;

			self._root.view.addChild(view, self.name);

			return self;
		}
	},

	/**
	 */

	'_nextViewChain': function()
	{             
		var chain = this.__nextViewChain || (this.__nextViewChain = new ViewChain(this, this._root));  
		return chain;
	}
});
});
_sardines.register("/modules/faebed62/plugins/views/index.js", function(require, module, exports, __dirname, __filename) {
	var ViewChain = require('./viewChain'),
logger = require('mesh-winston').loggers.get('views.core');
  
/** 
 * caches the views for front-end applications
 */


exports.plugin = function(router) {


    var rootView,
    rootViewPath,  
    rootViewChain,
	rootViewClass,
	serverSide = typeof window == "undefined";

	function getRootViewChain(view) {
		if(view && view.__viewChain) return view.__viewChain;

		var viewChain = new ViewChain();

		if(!view) view = rootViewClass ? new rootViewClass() : null;
		if(view) view.__viewChain = viewChain;

		viewChain.view = view;

		return viewChain;
	}

    
    router.on({

    	/**
    	 */

    	'pull load/*': function(req, res, mw) {
    		
    		logger.verbose('loading views');


    		//a root view is essential incase the root changes for any reason.
    		//for example - displaying a page over ANOTHER pager, which would be a HUD.
    		router.on('push -pull root/view', function(viewClass) {
    			
    			logger.verbose('set root view');


				rootViewClass = viewClass;
				rootViewChain = getRootViewChain();

				mw.next();
    		});
    	},


    	/**
    	 * overridable
    	 */

    	'pull -priority=-999 root/view': function(req, res) {
    		res.end(null);
    	},
    
		/**
		 */

        'pull view': function(req, res, mw) {


			var crootViewChain = rootViewChain;// = rootViewChain = rootViewChain || getRootViewChain();


			//override the current root view - useful for HUDS and such...
			if(req.query.root)
			{
				crootViewChain = getRootViewChain(req.query.root);
			}
			else
			{
				if(!rootViewChain) rootViewChain = getRootViewChain();

				crootViewChain = rootViewChain;
			}
            
            //get the path name of the view we're about to hit e.g: view -> dashboard
            var viewPath = mw.router.parse.stringifyPaths(mw.current.getNextSibling().channel.paths, mw.params),
            nextChain;

            logger.debug('view path: ' + viewPath);


                        

			//if we're running server-side, it's a new view chain each time. However, client-side - we cache. And for every
			//middleware item we pass through, we make sure that we're not replacing views which are already present. Much Faster.

			/*if(req.viewChain) {
				nextChain = req.viewChain.next(req, res, viewPath);
			} else {
				nextChain = serverSide ? getRootViewChain() : crootViewChain;
				nextChain.apply(req, res, viewPath);
			}*/

			//if we're running server-side, it's a new view chain each time. However, client-side - we cache. And for every
			//middleware item we pass through, we make sure that we're not replacing views which are already present. Much Faster.
            nextChain = req.viewChain = (req.viewChain || (serverSide ? getRootViewChain() : crootViewChain)).next(req, res, viewPath);

            console.log(nextChain)
			// req.viewChain = nextChain;
                                    
			//view exists? This could be something like the home page. Skip it.
			if(nextChain.view) {                             
            	logger.info(viewPath + ' is already visible, skipping next');	
                                 
				//skip the next path
				mw.skipNext();  
			} else {
				logger.debug('moving onto the next path');
           		mw.next();
			}
        }
    });
}
});
_sardines.register("/modules/faebed62/plugins/template/index.js", function(require, module, exports, __dirname, __filename) {
	var logger = require('mesh-winston').loggers.get('fig');

exports.plugin = function(router)
{
    var cache = {};

	router.on({

		/**
		 */

		'pull -hook template OR template/:name': function(req, res, mw)
		{                         
            var name = mw.data('name');


            logger.debug('loading template: ' + name);

            if(cache[name]) {
                logger.debug('template is cached, returning');
                return res.end(cache[name]);
            }

            var onTemplate = function(content)
            {
                logger.debug('template '+name+' loaded');
                cache[name] = content;

                res.end(content);
            }
            
            var ops = {
                url: name + '?'+ Math.random(),
                dataType: 'application/html',
                success: function(content)
                {
                     req.template = content;
                    
                    if(!mw.next())
                    {
                        onTemplate(content);
                    }
                },
                error: function(e)
                {
                    onTemplate(e.responseText);
                }
            }
            
            $.ajax(ops);

		}
	});
}
});
_sardines.register("/modules/faebed62/plugins/comb/index.js", function(require, module, exports, __dirname, __filename) {
	var logger = require('mesh-winston').loggers.get('element.core');



exports.plugin = function(router) {

	
	router.on({
		
		/**
		 * combs an element for anything that needs to be replaced by javascript ~ static page into single page app
		 */

		'push comb/element': function(data) {

			logger.debug('combing element');

			var element = data.element;

			if(element == window.document) element = element.body;


			//all the anchor tags need to be listened to, so we can intercept 
			$(element).find('a').each(function(index, anchor) {

				//external? don't replace.
				if(anchor.href.indexOf(window.location.host) == -1) return;

				var href = anchor.href;
				// anchor.href = '#';

				//need to remove the host info if it exists
				href = href.indexOf('://') > -1 ? href.split('/').slice(3).join('/') : href;

				$(anchor).bind('click', function(event) {

					logger.debug('link click');

					//if a keyboard modifier is selected, such as cmd for new tab, then ignore
					if(event.altKey || event.shiftKey || event.metaKey || event.ctrlKey || !router.request(href).type('pull').hasListeners()) return;

					logger.debug('clicked link is handleable - redirecting');
					//otherwise, prevent the user from redirecting, and handle the request in-app
					event.preventDefault();

					
					//redirect in app!
					router.push('redirect', href);
				});
			});
		},

		/**
		 * once the app's been initialized, we need to comb through the statically-served page
		 */

		'push -hook html/ready': function() {
		                
			router.push('comb/element', window.document);

		}
	})
}
});
_sardines.register("/modules/beanpoll/lib/push/director.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Director, Messenger,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Director = require("../concrete/director");

  Messenger = require("./messenger");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.passive = true;

    /*
    */

    _Class.prototype._newMessenger = function(message, middleware) {
      return new Messenger(message, middleware, this);
    };

    return _Class;

  })(Director);

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/pull/director.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Director, Messenger,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Director = require("../concrete/director");

  Messenger = require("./messenger");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.passive = false;

    /*
    */

    _Class.prototype._newMessenger = function(message, middleware) {
      return new Messenger(message, middleware, this);
    };

    /*
    */

    _Class.prototype.getListeners = function(message, search) {
      return this.prepareListeners(_Class.__super__.getListeners.call(this, message, search));
    };

    /*
    */

    _Class.prototype.prepareListeners = function(listeners) {
      if (!!listeners.length) {
        return [listeners[0]];
      } else {
        return [];
      }
    };

    return _Class;

  })(Director);

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/collect/director.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Director,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Director = require("../pull/director");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.passive = true;

    /*
    */

    _Class.prototype.prepareListeners = function(listeners) {
      return listeners;
    };

    return _Class;

  })(Director);

}).call(this);

});
_sardines.register("/modules/dolce/lib/collection.js", function(require, module, exports, __dirname, __filename) {
	var crema  = require('crema'),
tree 	   = require('./tree'),
sift 	   = require('sift');





var collection = module.exports = function() {
	
	var _rootTree = tree(),
	self = {},
	_id = 0;

	/**
	 * the *actual* add method
	 */

	var _addRoute = self.add = function(route, value) {
		
		var tree, type, lastPath = route.channel.paths[route.channel.paths.length - 1].value;

		//first lets establish whether or not the expression is OVERRIDING, or EXTENDING 
		if(lastPath == '*') {

			type = 'before';

			//remove the asterick
			route.channel.paths.pop();

		//everything AFTER this route is handleable by this data
		} else if(lastPath == '**') {
			
			type = 'greedy';

			route.channel.paths.pop();

		} else if(lastPath == '***') {
			
			type = 'greedyEndpoint';

			route.channel.paths.pop();
		} else {
			
			type = 'after';

		}

		var thru = [], cthru = route.thru;

		while(cthru) {
			thru.unshift(cthru.channel.paths);
			cthru = cthru.thru;
		}

		//next, let's find the tree this route belongs too
		tree = _findTree(route.channel.paths, true);


		//add the data to the tree obj
		return tree.addListener[type]({

			routeStr: crema.stringify(route),

			//filterable tags
			tags: route.tags,

			//path to the route -- needed to fill in extra data
			paths: route.channel.paths,

			//explicit chain which gets expanded at runtime
			thru: thru,

			id: _id++,

			//the callback function
			value: value

		}, type);

	};

	/**
	 * returns TRUE if the given type exists
	 */

	self.contains = function(channel, ops) {

		if(!ops) ops = {};

		var child = _findTree(channel.paths);

		return !!child ? !!_andSifter(ops, child.collections.after).length : false;
	}

	/**
	 * returns collections and their chained data
	 */

	self.get = function(channel, ops) {
		
		if(!ops) ops = {};


		//only allow path/to/collection in get vs pull blown parsing with metadata - not necessary
		var chains = _chains(channel.paths, ops, true);

		return {
			paths: channel.paths,
			tags: ops.tags,
			chains: chains
		}
	};

	/**
	 * finds routes based on the filter tags given WITHOUT expanding them
	 */

	self.find = function(ops) {

		var tagSifter, found = [];

		if(ops.tags) {
			tagSifter = _andSifter(ops);
		} else 
		if(ops.siftTags) {
			tagSifter = sift({ tags: ops.siftTags });
		}



		_rootTree.traverse(function(tree) {

			if(tagSifter)
			for(var i = tree.collections.after.length; i--;) {

				var data = tree.collections.after[i];

				if(tagSifter.test(data)) {
					
					found.push(data);

					break;
				}
			}

		});

		return found;
	}

	//changes {tag:value,tag2:value} to [{tag:value},{tag2:value}]
	var _tagsToArray = function(tagsObj) {
			
		var key, tag, tags = [];

		for(key in tagsObj) {
			
			tag = {};
			tag[key] = tagsObj[key];
			tags.push(tag);

		}

		return tags;
	}


	/**
	 */

	var _andSifter = function(ops, target) {

		var tags = ops.tags || {};

		for(var name in tags) {
			if(tags[name] === true) {
				tags[name] = { $exists: true };
			}
		}

		var $and = _tagsToArray(tags);

		if(ops.siftTags) $and.push(ops.siftTags);

		return sift({ tags: { $and: $and }}, target);

	}

	/**
	 */

	var _chains = function(paths, ops) {
		

		var child  = _rootTree.findChild(paths);


		//route does NOT exist? return a greedy endpoint
		if(!child) return [];//_greedyEndpoint(paths, tags);

		var entireChain = _allCollections(child),

		currentData,

		endCollection = _andSifter(ops)(child.collections.after),

		//the collections expanded with all the explicit / implicit / greedy chains
		expandedChains = [],

		expandedChain;



		//now we need to expand the EXPLICIT chain. Stuff like pass -> thru -> route
		for(var i = 0, n = endCollection.length; i < n; i++) {

			currentData = endCollection[i];
			
			expandedChains.push((ops.expand == undefined || ops.expand == true) ? _chain(currentData, paths, entireChain) : currentData);
		}



		return expandedChains;
	};

	var _chain = function(data, paths, entireChain) {

		var chain = _chainSifter(data.tags, entireChain),
		usedGreedyPaths = {};


		//filter out any greedy middleware that's used more than once. This can cause problems
		//for greedy middleware such as /**
		return _expand(chain.concat(data), paths).filter(function(route) {

			if(route.type != 'greedy') return true;
			if(usedGreedyPaths[route.id]) return false;
			return usedGreedyPaths[route.id] = true;

		});
	}

	var _greedyEndpoint = function(paths, tags) {
		
		var tree;

		for(var i = paths.length; i--;) {
			if(tree = _rootTree.findChild(paths.slice(0, i))) break;	
		}

		if(!tree) return [];

		var chain = _chainSifter(tags || {}, _greedyCollections(tree));

		return chain;

	}

	var _copy = function(target) {
		var to = {};
		for(var i in target) {
			to[i] = target[i];
		}
		return to;
	}

	/**
	 */

	var _expand = function(chain, paths) {
		
		var j, n2,  i = 0, n = chain.length;


		var expanded = [];


		for(; i < n; i++) {
			
			var data = chain[i];

			var params = _params(data.paths, paths),
			subChain = [];
			
			for(j = 0, n2 = data.thru.length; j < n2; j++) {
					
				subChain.push(_thru(_fillPaths(data.thru[j], params), data.tags));

			}

			expanded = expanded.concat.apply(expanded, subChain);

			expanded.push({
				routeStr: data.routeStr,
				paths: data.paths,
				cmpPath: paths,
				params: params,
				id: data.id,
				tags: data.tags,
				value: data.value,
				type: data.type
			});
		}

		return expanded;
	}

	/**
	 */

	var _chainSifter = function(tags, target) {

		var test = function(target) {
			
			return target.filter(function(a) {

				var atags = a.tags, av, tv;

				//metadata in the atags (chain) must match the tags given

				//examples of this:
				//-method a/**
				//-method=POST a  --- a/** -> a
				//a --- a (would not go through a/**)
				if(atags.unfilterable) return true;

				for(var tagName in atags) {

					av = atags[tagName];
					tv = tags[tagName];

					//MUST have a value - atags

					//Example:

					//-method=POST a/**

					//matches: 
					//-method=POST a

					//does not match:
					//-method a

					if(av != tv && (!tv || av !== true) && av != '*')  return false;
				}

				return true;
			});
		}

		//array exists? return the result
		if(target) return test(target);

		return test;
	}

	/**
	 */

	var _thru = function(paths, tags) {

		var child  = _rootTree.findChild(paths);

		if(!child) return [];


		//need to sort the tags because a match for say.. method=DELETE matches both method, and method=DELETE
		//NOTE - chainSifter was previously used here. Since it's EXPLICIT, we do NOT want to filter out the routes.
		var filteredChildren = child.collections.after.sort(function(a, b) {

			return _scoreTags(a.tags, tags) > _scoreTags(b.tags, tags) ? -1 : 1;

		});

		var targetChild = filteredChildren[0];

		var chainSifter = _chainSifter(targetChild.tags);

		chain = chainSifter(_allCollections(child));



		//return only ONE item to go through - this is the best match.
		return _expand(chain.concat(targetChild), paths);
	}

	/**
	 * ranks data based on how similar tags are
	 */

	var _scoreTags = function(tags, match) {
		var score = 0;


		for(var tag in match) {

			var tagV = tags[tag];
			
			if(tagV == match[tag]) {

				score += 2;

			} else 
			if(tagV) {

				score += 1;

			}
		}

		return score;
	}

	/**
	 * hydrates chain, e.g.,  validate/:firstName -> add/user/:firstName
	 */

	var _fillPaths = function(paths, params) {
		var i, path, n = paths.length, newPaths = [];

		for(i = 0; i < n; i++) {
			
			path = paths[i];

			newPaths.push({
				value: path.param ? params[path.value] : path.value,
				param: path.param
			});
		}

		return newPaths;
	}

	/**
	 * returns the parameters associated with the found path against the queried path, e.g., add/:name/:last and add/craig/condon 
	 */

	var _params = function(treePaths, queryPaths) {
		
		var i, treePath, queryPath, params = {};

		for(i = treePaths.length; i--;) {

			treePath = treePaths[i];
			queryPath = queryPaths[i];

			if(treePath.param) {

				params[treePath.value] = queryPath.value;

			}

		}


		return params;
	};

	/**
	 */

	var _greedyCollections = function(tree) {
		
		var currentParent = tree,
		collections = [],
		gcol = [],
		cpath;

		while(currentParent) {
			 
			cpath = currentParent.pathStr();
			collections = currentParent.collections.greedy.concat(collections);

			currentParent = currentParent.parent();
		}

		return collections;
	};

	/**
	 */

	var _allCollections = function(tree) {
		
		return _greedyCollections(tree).concat(tree.collections.before);

	}


	/**
	 * finds the deepest tree associated with the given paths
	 */


	var _findTree = function(paths, createIfNotFound) {
		
		var i, path, n = paths.length, currentTree = _rootTree;

		for(i = 0; i < n; i++) {
			
			path = paths[i];

			if(!(currentTree = currentTree.child(path, createIfNotFound))) break;

		}

		return currentTree;

	};



	return self;
}


});
_sardines.register("/modules/beanpoll/lib/collections/linkedList.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var LinkedList;

  module.exports = LinkedList = (function() {

    function LinkedList() {}

    /*
    */

    LinkedList.prototype.getNextSibling = function() {
      return this._nextSibling;
    };

    /*
    */

    LinkedList.prototype.addNextSibling = function(sibling, replNext) {
      if (!!this._nextSibling) this._nexSibling._prevSibling = sibling;
      sibling._prevSibling = this;
      if (!replNext) sibling._nextSibling = this._nextSibling;
      return this._nextSibling = sibling;
    };

    /*
    */

    LinkedList.prototype.getPrevSibling = function() {
      return this._prevSibling;
    };

    /*
    */

    LinkedList.prototype.addPrevSibling = function(sibling, replPrev) {
      if (!!this._prevSibling) this._prevSibling._nextSibling = sibling;
      sibling._nextSibling = this;
      if (!replPrev) sibling._prevSibling = this._prevSibling;
      return this._prevSibling = sibling;
    };

    /*
    */

    LinkedList.prototype.getFirstSibling = function() {
      var first;
      first = this;
      while (!!first._prevSibling) {
        first = first._prevSibling;
      }
      return first;
    };

    /*
    */

    LinkedList.prototype.getLastSibling = function() {
      var last;
      last = this;
      while (!!last._nextSibling) {
        last = last._nextSibling;
      }
      return last;
    };

    return LinkedList;

  })();

}).call(this);

});
_sardines.register("/modules/stream", function(require, module, exports, __dirname, __filename) {
	// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var events = require('events');
var util = require('util');

function Stream() {
  events.EventEmitter.call(this);
}
util.inherits(Stream, events.EventEmitter);
module.exports = Stream;
// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    // remove the listeners
    cleanup();

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    // remove the listeners
    cleanup();

    dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


});
_sardines.register("/modules/tq/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var EventEmitter = require('events').EventEmitter;

exports.queue = function() {
	
	
	var next = function() {
		var callback = queue.pop();

		if(!callback || !started) {
			running = false;
			return;
		}

		callback.apply(next, arguments);
	},
	running = false,
	started = false,
	queue = [],
	em = new EventEmitter();

	var self = {

		/**
		 * add a queue to the end
		 */

		push: function(callback) {
			queue.unshift(callback);

			if(!running && started) {
				next();
			}
			return this;
		},


		/**
		 * adds a queue to the begning
		 */

		unshift: function(callback) {
			queue.push(callback);
			return this;
		},

		/**
		 */

		on: function(type, callback) {
			em.addListener(type, callback);
		},


		/**
		 * starts the queue
		 */

		start: function() {
			if(started) return this;
			started = running = true;
			em.emit('start');
			next();
			return this;
		},

		/**
		 * returns a function that's added to the queue
		 * when invoked
		 */

		fn: function(fn) {
			return function() {
				var args = arguments, listeners = [];

				return self.push(function() {

					var next = this, args = arguments;
					
					fn.apply({
						next: function() {
							listeners.forEach(function(listener) {
								listener.apply(null, args);
							});
							next();
						},
						attach: function(listener) {
							listeners.push(listener);
						}
					}, callback);
				});
			}
		},

		/**
		 * stops the queue
		 */

		stop: function() {
			started = running = false;
			return this;
		}
	};

	return self;
}
});

_sardines.register("/modules/tq", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/tq/lib/index.js');
});
_sardines.register("/modules/32188c34/index.js", function(require, module, exports, __dirname, __filename) {
	var loggers = {};

var newLogger = function(module) {

	function logger(name) {

		return function(msg) {
			console.log(name + ": " + module + ": " + msg);
		}	
	}

	return {
		info: logger('info'),
		warn: logger('warn'),
		error: logger('error'),
		debug: logger('debug'),
		verbose: logger('verbose')
	};
}


exports.loggers = {
	get: function(name) {
		return loggers[name] || (loggers[name] = newLogger(name))
	}
}
});
_sardines.register("/modules/sprintf/lib/sprintf.js", function(require, module, exports, __dirname, __filename) {
	/**
sprintf() for JavaScript 0.7-beta1
http://www.diveintojavascript.com/projects/javascript-sprintf

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Changelog:
2010.11.07 - 0.7-beta1-node
  - converted it to a node.js compatible module

2010.09.06 - 0.7-beta1
  - features: vsprintf, support for named placeholders
  - enhancements: format cache, reduced global namespace pollution

2010.05.22 - 0.6:
 - reverted to 0.4 and fixed the bug regarding the sign of the number 0
 Note:
 Thanks to Raphael Pigulla <raph (at] n3rd [dot) org> (http://www.n3rd.org/)
 who warned me about a bug in 0.5, I discovered that the last update was
 a regress. I appologize for that.

2010.05.09 - 0.5:
 - bug fix: 0 is now preceeded with a + sign
 - bug fix: the sign was not at the right position on padded results (Kamal Abdali)
 - switched from GPL to BSD license

2007.10.21 - 0.4:
 - unit test and patch (David Baird)

2007.09.17 - 0.3:
 - bug fix: no longer throws exception on empty paramenters (Hans Pufal)

2007.09.11 - 0.2:
 - feature: added argument swapping

2007.04.03 - 0.1:
 - initial release
**/

var sprintf = (function() {
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}
	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}

	var str_format = function() {
		if (!str_format.cache.hasOwnProperty(arguments[0])) {
			str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
		}
		return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	};

	str_format.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = parseInt(arg, 10); break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = Math.abs(arg); break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	str_format.cache = {};

	str_format.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw('[sprintf] huh?');
							}
						}
					}
					else {
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	return str_format;
})();

var vsprintf = function(fmt, argv) {
	argv.unshift(fmt);
	return sprintf.apply(null, argv);
};

exports.sprintf = sprintf;
exports.vsprintf = vsprintf;
});

_sardines.register("/modules/sprintf", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/sprintf/lib/sprintf.js');
});
_sardines.register("/modules/faebed62/views/abstract.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
ConcreteModel = require('malt').models.Model,
Instructor = require('../instructor'),
logger = require('mesh-winston').loggers.get('fig'),
renderView = require('../renderView');



var View = module.exports = ConcreteModel.extend({

	/**
	 */

	'_binders': {


		/**
		 * binds events to the view
		 */


		'default': function(action, target, method)
		{
			var self = this;


			target.bind(action, function(event)
			{
				//otherwise, prevent the user from redirecting, and handle the request in-app
				event.preventDefault();

				self[method].call(self, event);
			})
		},

		/**
		 * binds enter on the keyboard for the view
		 */

		'enter': function(action, target, method)
		{
			var self = this;

			target.bind('keydown', function(event)
			{
				if(event.keyCode == 13)
				{
					self[method].call(self, event);
				}
			})
		}	
	},


	/**
	 */

	'override __construct': function(ops)
	{
		this._super();
		this._children = [];
		this._childrenByName = {};


		this.setup(ops);

		this._instructor = new Instructor(this);
	},

	/** 
	 * configures the view
	 */

	'setup': function(ops)
	{
		if(!ops) ops = {};
		if(!this.ops) this.ops = {};
		if(ops.el) this.el = ops.el; 



		Structr.copy(ops, this.ops, true);
		
		this.body = ops.body;
		if(ops.template) this.template = ops.template;  
		

		//web, or node
		this.$$ = typeof $ != 'undefined' ? $ : ops.$;
		this.document = typeof document != 'undefined' ? document : ops.document;

		return this;
	},


	/**
	 * updates the view if anything changes. This usually occurs if say... data changes at it impacts
	 * a template view, OR the parent changes, and the children need to change as well
	 */

	'update': function(force)
	{
		//reset the element. What if the parent innerHTML has changed? 
		if(!force && !this._setElement()) return; 		


		//now, set the view
		this.render();

		//listen to the element
		this.listen();

		//need to update all the children now. TODO: check if the element *really* changed / was replaced
		this.updateChildren();
	},

	/**
	 */

	/**
	 * initialize
	 */

	'abstract ready': function() { 
	},

	/**
	 */

	'abstract render': function() { },

	/**
	 * updates the children
	 */

	'updateChildren': function()
	{
		this.eachChild(function(child)
		{
			child.update();
			child.updateChildren();
		})
	},
  
	/**
	 */

	'eachChild': function(callback)
	{
		for(var i = this._children.length; i--;)
		{
			callback(this._children[i], i);
		}
	},

	/**
	 * adds a child to the view
	 */


	'addChild': function(view, name)
	{
		//this shouldn't happen, but just in case, we don't want to break
		//the app
		if(!view)
		{
			console.warn('Cannot add null child to ' + this.selector);
			return;
		}

		//allow the child to do shit to the parent
		view.parent = this;

		//name exists? set it
		if(name) view.name = name;

		//the view name might already exist, so af'dd it to the collection
		if(view.name) this._childrenByName[view.name] = view;

		//push the child to the children collection
		this._children.push(view);	


		//is this view *completely* done initializing? Yeah, then we need
		//to initialize the child
		if(this.initializedChildren) this._linkChild(view).init();

		return view;
	},

	/**
	 * removes the view from the parent
	 */

	'remove': function()
	{
		if(this.parent)
		{
			this.parent.removeChild(this);
		}	
	},

	/**
	 * removes a child from the view
	 */


	'removeChild': function(viewOrIndex)
	{
		var view, index, toi = typeof viewOrIndex;


		//is the value an number? it's an index
		if(toi == 'number')
		{
			view = this._children[viewOrIndex];
			index = viewOrIndex;

		}

		//or a string? it's the name of the child
		else
		if(toi == 'string')
		{
			view = this._childrenByName[viewOrIndex];
			index = this._children.indexOf(view);
		}

		//otherwise we're remoiving the ref
		else
		{
			index = this._children.indexOf(view);
			view = viewOrIndex;

		}

		//but the view might not exist, so return null to notify it doesn't...
		if(!view) return null;


		delete this._childrenByName[view.name];

		view.parent = null;

		//destroy the child
		view.dispose();
		view.el.innerHTML = '';

		//exists? remove
		if(index > -1) this._children.splice(index, 1);

		return view;
	},

	/**
	 * removes all the children of the view
	 */

	'removeAllChildren': function()
	{
		while(this._children.length) this.removeChild(0);
	},

	/**
	 * returns a child by its name. Important especially for caching routes
	 */

	'getChildByName': function(name)
	{
		return this._childrenByName[name];
	},

	/**
	 * used for a beanpole request. renders the view, and sends it to the requestor
	 */

	'send': function(res)
	{
		logger.debug('send view');

		renderView(this, res);

	},


	/**
	 * initializes the few. Used primarily for serviing static pages 
	 */

	'init': function(callbacks)
	{
		this.subscribe(callbacks);
		

		//initialize happens only *once*, and it's used to serve up static pages, so don't run through it again
		if(this.initialized) return;
		this.initialized = true;

		var self = this;

		this.subscribe('complete', function()
		{	
			self.ready();	
		});

		//build up the instructions to display the view. This is essential for serving static pages
		this._instructor.add(['_setElement'].concat(this.instructions()).concat(['_listen', '_initChildren']));

	},


	/**
	 * the instructions to build up the view for static pages
	 */
	
	'instructions': function()
	{
		return ['_render'];
	},


	/**
	 * completely disposes the view so it's unusable
	 */

	'override dispose': function()
	{
		this._super();

		//remove from the parent
		this.remove();

		//clean for any listeners
		this.clean();


		//finally, remove *all* children
		this.disposeChildren();
	},

	/**
	 * disposes *all* children. important because it also removes all bindings
	 */

	'disposeChildren': function()
	{
		this.eachChild(function(child)
		{
			//removing does the same as disposing.
			child.remove();
		})
	},


	/**
	 * cleans an element before re-rendering
	 */

	'clean': function()
	{
		this.unbind();
	},

	/**
	 * unbinds all events from the current element
	 */

	'unbind': function()
	{
		this.$('*').unbind();
	},

	/**
	 * listens to the current element for any changes. 
	 */

	'listen': function()
	{

		//element does not exist, of the window is undefiend? it's being rendered on the backend. We *don't* want to listen
		//to any elements on the backend
		if(!this.el || typeof window == 'undefined') return;

		var self = this;


		this.unbind();


		function listen(ev, method)
		{
			var parts = ev.split(' '),
			type = parts.shift();
			
			parts.forEach(function(el)
			{
				$(self.el).find(el).each(function()
				{
					(self._binders[type] || self._binders['default']).call(self, type, $(this), method);
				});
			});
		}
		
		
		for(var ev in self.bindings)
		{
			listen(ev, self.bindings[ev]);
		}
	},

	/**
	 * localized selector. Not global
	 */

	'$': function(search)
	{	
		return typeof search == 'string' ? this.$$(this.el).find(search) : this.$$(search);
	},

	/**
	 * links the child to the parent so 
	 */

	'_linkChild': function(child)
	{

		//set the original jquery function
		child.$$ = this.$$;

		//set the document so we have something to write to
		child.document = this.document;


		return child;
	},


	/**
	 * sets the element controlled by this view. Can changes on each update.
	 */

	'_setElement': function(next)
	{
		var currentElement = this.el,
		newElement = this.el;


		
		if(typeof newElement == 'string' || this.selector)
		{
			if(!this.selector) this.selector = this.el;

			if(this.parent)
			{
				var el = this.el;
				newElement = this.$$(this.parent.el).find(this.selector);
			}
			else
			{
				newElement = this.$$(this.selector);
			}
		}
	
		// this.jqel = this.parent ? this.$$(this.parent.el).find(this.selector) : this.$$(this.selector);
		

		//don't wrap in jquery
		if(newElement.context)
		{
			var newElement = newElement[0];
		}
		

		//clean up the old element before setting the new one...
		if(newElement && currentElement != newElement)
		{
			if(currentElement) this.clean();
			this.el = newElement;
		}

		if(next) next();

		//tells if whether a new element was really set...
		return currentElement != newElement;
	},

	/**
	 */

	'_render': function(next)
	{
		this.render();
		next();
	},

	/**
	 * part of the initialization. this happens ONLY on the front end of things
	 */

	'_listen': function(next)
	{
		this.listen();
		next();
	},

	/**
	 * initializes the children for their first push
	 */

	'_initChildren': function(next)
	{ 
		if(this.initializedChildren) return;
		this.initializedChildren = true;

		var running = this._children.length;


		if(!running)
		{
			return next();
		}


		function nextChild()
		{
			if(!(--running)) next();
		}


		for(var i = running; i--;)
		{
			var child = this._linkChild(this._children[i]);

			if(child.complete)
			{
				nextChild();
				continue;
			}

			this._children[i].init({
				complete: nextChild
			});
		}
	}
});



});
_sardines.register("/modules/faebed62/template/adapters/mustache/mustache.js", function(require, module, exports, __dirname, __filename) {
	/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

module.exports = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line !== "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag, "g");
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message: 
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value;
      if(is_kinda_truthy(context[name])) {
        value = context[name];
      } else if(is_kinda_truthy(this.context[name])) {
        value = this.context[name];
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();
});
_sardines.register("/modules/beanpoll/lib/push/messenger.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Messenger,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Messenger = require("../concrete/messenger");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    _Class.prototype._next = function(middleware) {
      return middleware.listener.call(this, this.message.query, this);
    };

    /*
    	 ack on end
    */

    _Class.prototype._onEnd = function() {
      return this.response.end();
    };

    return _Class;

  })(Messenger);

}).call(this);

});
_sardines.register("/modules/beanpoll/lib/pull/messenger.js", function(require, module, exports, __dirname, __filename) {
	(function() {
  var Messenger,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Messenger = require("../concrete/messenger");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    _Class.prototype.start = function() {
      return _Class.__super__.start.call(this);
    };

    /*
    */

    _Class.prototype._next = function(middleware) {
      return middleware.listener.call(this, this.message, this.response, this);
    };

    /*
    */

    _Class.prototype._onError = function(error) {
      return this.response.error(error);
    };

    return _Class;

  })(Messenger);

}).call(this);

});
_sardines.register("/modules/dolce/lib/tree.js", function(require, module, exports, __dirname, __filename) {
	var crema = require('crema');

var tree = module.exports = function(ops) {

	//ops doesn't exist? it's the root
	if(!ops) ops = { name: '', 
	param: false, 
	parent: null,
	depth: 0,
	deepest: 0};

	//child trees
	var _children = {},

	//THIS tree
	self = {},

	//parent tree obj
	_parent = ops.parent,

	//the root tree /
	_root   = ops.root || self,

	//collections added to this tree?
	_hasListeners = false,

	//the path value to THIS tree object
	_path   = { value: ops.name, param: ops.param },

	//used for debugging
	_pathStr = _parent ? _parent.path().value + '/' + ops.name : '/',

	//string rep of path to the tree
	_paths = _parent ? _parent.paths().concat(_path) : [_path],

	_pathStr = crema.stringifyPaths(_paths);

	self.collections = {

		//chain is path/**, which means everything *after* path is handled by this route, which
		//means we need to fetch the parent chain
		greedy: [],

		greedyEndpoint: [],

		//handled before after
		before: [],

		//handled last
		after: []
	};


	self.addListener = {
		

		before: function(data) {
			
			return _addListener(self.collections, 'before', data);

		},

		after: function(data) {
			
			return _addListener(self.collections, 'after', data);

		},


		greedy: function(data) {

			return _addListener(self.collections, 'greedy', data);

		},

		greedyEndpoint: function(data) {

			return _addListener(self.collections, 'greedyEndpoint', data);

		}
	};


	var _addListener = function(collection, type, data) {
		
		var collections = collection[type];
		data.path = _pathStr;
		data.type = type;

		collections.push(data);

		_hasListeners = true;

		return {

			/**
			 * removes the data from the collection
			 */

			dispose: function() {
				
				var i = collections.indexOf(data);

				//make sure the data exists before removing it from the collection
				if(i > -1) collections.splice(i, 1);

			}
		}
	}

	var _greedyListeners = function() {

		if(!_parent) return [];
	}

	/**
	 * traverse the tree
	 */

	self.traverse = function(callback) {
		callback(this);

		for(var name in _children) {
			_children[name].traverse(callback);
		}
	}


	/**
	 * retrieves a child path
	 */

	self.child = function(path, createIfNotFound) {
		
		//if the path is a parameter, then the NAME is __param as well
		var name = path.param ? '__param' : path.value;

		//return the child if it exists
		if(_children[name]) return _children[name];

		//otherwise, *create* the child 
		if(createIfNotFound) {

			return _children[name] = tree({ name: name,
				param: path.param, 
				parent: self, 
				root: _root,
				depth: ops.depth + 1, 
				deepest: 0 });

		}

		return null;
	}

	/**
	 * finds a child based paths given
	 */

	self.findChild = function(paths) {

		return _findChildren(self, paths, 0);
	};


	var _findChild = self._findChild = function(paths, index, weighTowardsParam) {

		var currentPath, foundChild, childTree;

		//are we at the end?
		if(paths.length - index == 0) {

			return _hasListeners ? self : null;

		}

		currentPath = paths[index];

		//if we're weighing for parameters, then a route has not been defined
		//for the given path
		if(!weighTowardsParam || !(childTree = _children.__param)) {

			childTree = _children[currentPath.value];

		}


		return childTree ? _findChildren(childTree, paths, index + 1) : null;
	}


	var _findChildren = function(tree, paths, index) {
		
		if(!tree) return null;

		var param = paths[index] ? paths[index].param : false, found;


		if(!param && (found = tree._findChild(paths, index, false))) return found;


		return  tree._findChild(paths, index, true);
	}


	/**
	 * returns the current parent
	 */

	self.parent = function() {

		return _parent;

	};

	self.path = function() {
		
		return _path;
	}

	self.pathStr = function() {
		
		return _pathStr;

	}

	/**
	 */

	self.paths = function() {
		
		return _paths;

	};



	return self;
}
});
_sardines.register("/modules/sift/sift.js", function(require, module, exports, __dirname, __filename) {
	/*
 * Sift
 * 
 * Copryright 2011, Craig Condon
 * Licensed under MIT
 *
 * Inspired by mongodb's query language 
 */


(function() {


	

	var _queryParser = new (function() {

		/**
		 * tests against data
		 */

		var test = this.test = function(statement, data) {

			var exprs = statement.exprs;


			//generally, expressions are ordered from least efficient, to most efficient.
			for(var i = 0, n = exprs.length; i < n; i++) {

				var expr = exprs[i];


				if(!expr.e(expr.v, _comparable(data), data)) return false;

			}

			return true;
		}


		/**
		 * parses a statement into something evaluable
		 */

		var parse = this.parse = function(statement, key) {

			var testers = [];
				
			if(statement)
			//if the statement is an object, then we're looking at something like: { key: match }
			if(statement.constructor == Object) {

				for(var k in statement) {

					//find the apropriate operator. If one doesn't exist, then it's a property, which means
					//we create a new statement (traversing) 
					var operator = !!_testers[k] ?  k : '$trav',

					//value of given statement (the match)
					value = statement[k],

					//default = match
					exprValue = value;

					//if we're working with a traversable operator, then set the expr value
					if(TRAV_OP[operator]) {
						
						//*if* the value is an array, then we're dealing with something like: $or, $and
						if(value instanceof Array) {
							
							exprValue = [];

							for(var i = value.length; i--;) {

								exprValue.push(parse(value[i]));
									
							}

						//otherwise we're dealing with $trav
						} else {
							
							exprValue = parse(statement[k], k);

						}
					} 
					

					testers.push(_getExpr(operator, k, exprValue));

				}
								

			//otherwise we're comparing a particular value, so set to eq
			} else {

				testers.push(_getExpr('$eq', k, statement));

			}

			var stmt =  { 

				exprs: testers,
				k: key,
				test: function(value) {
					
					return test(stmt, value);

				} 

			};
			
			return stmt;
		
		}


		//traversable statements
		var TRAV_OP = {

			$and: true,
			$or: true,
			$nor: true,
			$trav: true,
			$not: true

		}


		function _comparable(value) {

			if(value instanceof Date) {

				return value.getTime();
			
			} else {

				return value;
			
			}
		}


		var _testers = {

			/**
			 */

			$eq: function(a, b) {

				return a.test(b);

			},

			/**
			 */

			$ne: function(a, b) {

				return !a.test(b);

			},

			/**
			 */

			$lt: function(a, b) {

				return a > b;

			},

			/**
			 */

			$gt: function(a, b) {

				return a < b;

			},

			/**
			 */

			$lte: function(a, b) {

				return a >= b;

			},

			/**
			 */

			$gte: function(a, b) {

				return a <= b;

			},


			/**
			 */

			$exists: function(a, b) {

				return a == !!b;

			},

			/**
			 */

			$in: function(a, b) {

				//intersecting an array
				if(b instanceof Array) {

					for(var i = b.length; i--;) {

						if(a.indexOf(b[i]) > -1) return true;

					}	

				} else {

					return a.indexOf(b) > -1;

				}

			},

			/**
			 */

			$not: function(a, b) {
				return !a.test(b);
			},

			/**
			 */

			$type: function(a, b, org) {

				//instanceof doesn't work for strings / boolean. instanceof works with inheritance
				return org ? org instanceof a || org.constructor == a : false;

			},

			/**
			 */


			$nin: function(a, b) {

				return !_testers.$in(a, b);

			},

			/**
			 */

			$mod: function(a, b) {

				return b % a[0] == a[1];

			},

			/**
			 */

			$all: function(a, b) {


				for(var i = a.length; i--;) {

					var v = a[i];

					if(b.indexOf(v) == -1) return false;

				}

				return true;

			},

			/**
			 */

			$size: function(a, b) {

				return b ? a == b.length : false;

			},

			/**
			 */

			$or: function(a, b) {

				var i = a.length, n = i;

				for(; i--;) {

					if(test(a[i], b)) {

						return true;

					}

				}

				return !n;

			},

			/**
			 */

			$nor: function(a, b) {

				var i = a.length, n = i;

				for(; i--;) {

					if(!test(a[i], b)) {

						return true;

					}

				}

				return !n;

			},

			/**
			 */

			$and: function(a, b) {

				for(var i = a.length; i--;) {

					if(!test(a[i], b)) {

						return false;

					}
				}

				return true;
			},

			/**
			 */

			$trav: function(a, b) {

				if(b instanceof Array) {
					
					for(var i = b.length; i--;) {
						
						var subb = b[i];

						if(subb[a.k] && test(a, subb[a.k])) return true;

					}

					return false;
				}


				return b ? test(a, b[a.k]) : false;

			}
		}

		var _prepare = {
			
			/**
			 */

			$eq: function(a) {
				
				var fn;

				if(a instanceof RegExp) {

					return a;

				} else if (a instanceof Function) {

					fn = a;

				} else {
					
					fn = function(b) {

						return a == b;
					}

				}

				return {

					test: fn

				}

			},
			
			/**
			 */
				
			 $ne: function(a) {
				return _prepare.$eq(a);
			 }
		};



		var _getExpr = function(type, key, value) {

			var v = _comparable(value);

			return { 

				//type
				// t: type,

				//k key
				k: key, 

				//v value
				v: _prepare[type] ? _prepare[type](v) : v, 

				//e eval
				e: _testers[type] 
			};

		}


	})();

	var sifter = function(query) {

		//build the filter for the sifter
		var filter = _queryParser.parse( query );
			
		//the function used to sift through the given array
		var self = function(target) {
				
			var sifted = [];

			//I'll typically start from the end, but in this case we need to keep the order
			//of the array the same.
			for(var i = 0, n = target.length; i < n; i++) {

				if(filter.test( target[i] )) sifted.push(target[i]);

			}

			return sifted;
		}

		//set the test function incase the sifter isn't needed
		self.test   = filter.test;
		self.query  = query;

		return self;
	}


	//sifts a given array
	var sift = function(query, target) {


		var sft = sifter(query);

		//target given? sift through it and return the filtered result
		if(target) return sft(target);

		//otherwise return the sifter func
		return sft;

	}


	//node.js?
	if((typeof module != 'undefined') && (typeof module.exports != 'undefined')) {
		
		module.exports = sift;

	} else 

	//browser?
	if(typeof window != 'undefined') {
		
		window.sift = sift;

	}

})();


});

_sardines.register("/modules/sift", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/sift/sift.js');
});
_sardines.register("/modules/util", function(require, module, exports, __dirname, __filename) {
	// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var events = require('events');


var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      case '%%': return '%';
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
}


exports.print = function() {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stdout.write(String(arguments[i]));
  }
};


exports.puts = function() {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stdout.write(arguments[i] + '\n');
  }
};


exports.debug = function(x) {
  process.binding('stdio').writeError('DEBUG: ' + x + '\n');
};


var error = exports.error = function(x) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.binding('stdio').writeError(arguments[i] + '\n');
  }
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 */
function inspect(obj, showHidden, depth, colors) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: colors ? stylizeWithColor : stylizeNoColor
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
var colors = {
   'bold' : [1, 22],
   'italic' : [3, 23],
   'underline' : [4, 24],
   'inverse' : [7, 27],
   'white' : [37, 39],
   'grey' : [90, 39],
   'black' : [30, 39],
   'blue' : [34, 39],
   'cyan' : [36, 39],
   'green' : [32, 39],
   'magenta' : [35, 39],
   'red' : [31, 39],
   'yellow' : [33, 39]
};

var styles = {
   'special': 'cyan',
   'number': 'blue',
   'boolean': 'yellow',
   'undefined': 'grey',
   'null': 'bold',
   'string': 'green',
   'date': 'magenta',
   // "name": intentionally not styling
   'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = styles[styleType];

  if (style) {
    return '\033[' + colors[style][0] + 'm' + str +
           '\033[' + colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}





function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && objectToString(re) === '[object RegExp]');
}


function isDate(d) {
  return d instanceof Date ||
    (typeof d === 'object' && objectToString(d) === '[object Date]');
}


function isError(e) {
  return e instanceof Error ||
    (typeof e === 'object' && objectToString(e) === '[object Error]');
}


function objectToString(o) {
  return Object.prototype.toString.call(o);
}


var pWarning;

exports.p = function() {
  if (!pWarning) {
    pWarning = 'util.p will be removed in future versions of Node. ' +
               'Use util.puts(util.inspect()) instead.\n';
    exports.error(pWarning);
  }
  for (var i = 0, len = arguments.length; i < len; ++i) {
    error(exports.inspect(arguments[i]));
  }
};


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


exports.log = function(msg) {
  exports.puts(timestamp() + ' - ' + msg.toString());
};


var execWarning;


exports.pump = function(readStream, writeStream, callback) {
  var callbackCalled = false;

  function call(a, b, c) {
    if (callback && !callbackCalled) {
      callback(a, b, c);
      callbackCalled = true;
    }
  }

  if (!readStream.pause) {
    readStream.pause = function() {readStream.emit('pause');};
  }

  if (!readStream.resume) {
    readStream.resume = function() {readStream.emit('resume');};
  }

  readStream.addListener('data', function(chunk) {
    if (writeStream.write(chunk) === false) readStream.pause();
  });

  writeStream.addListener('pause', function() {
    readStream.pause();
  });

  writeStream.addListener('drain', function() {
    readStream.resume();
  });

  writeStream.addListener('resume', function() {
    readStream.resume();
  });

  readStream.addListener('end', function() {
    writeStream.end();
  });

  readStream.addListener('close', function() {
    call();
  });

  readStream.addListener('error', function(err) {
    writeStream.end();
    call(err);
  });

  writeStream.addListener('error', function(err) {
    readStream.destroy();
    call(err);
  });
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be revritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

});
_sardines.register("/modules/8999ac4d/index.js", function(require, module, exports, __dirname, __filename) {
	var models = require('./models'),
Schema = require('./schema'),
modifiers = require('./modifiers');

models.Item = require('./models/item');
models.Collection = require('./models/collection');
models.Model = require('./models/concrete').Model;

if(typeof global == 'undefined') global = {};

exports.models = global.malt ? global.malt.models : models;
exports.modifiers = modifiers;

if(!global.malt) global.malt = exports;




exports._initModel = function(Model, name, appModels, router)
{

	var AppModel = Model.extend({ router: router, 


		//used for serialization
		name: Model.prototype.name || name,

		//schema for the model
		_schema: new Schema(Model.schema, modifiers),


		/**
		 */

		'newModel': function(type, ops)
		{
			var clazz = this.model(type);

			return new clazz(ops);
		},

		/**
		 */

		'model': function(type)
		{
			var clazz;

			if(this.models)
			{
				clazz = appModels[this.models[type]];
			}
			
			return clazz ? clazz : appModels[type || this.channel];
		}
	});


	appModels[name] = appModels[AppModel.prototype.name]  = AppModel;
}

/**
 */


function _init(router) {
	var hostModels = {};

	for(var name in models)
	{
		var Model = models[name];

		if(!Model.extend) continue;

		exports._initModel(Model, name, hostModels , router);
	}


	router.on('pull malt', function(req, res) {

		req.models = hostModels;

		if(!req.next()) res.end(hostModels);
	});

	router.push('malt', hostModels);


	return router.models = hostModels;   
}

/**
 * connects malt to a server
 */   

exports.plugin = function(router, params)
{                               
	router.on('pull load/*', function() {
		console.log("INIT MALT")
		_init(router);
		this.next();
	});     
}


});
_sardines.register("/modules/faebed62/instructor/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr');

module.exports = Structr({
	
	/**
	 */

	'__construct': function(target)
	{
		this._instructions = [];
		this._target = target;
	},
	
	/**
	 */

	'add': function(instructions)
	{
		this._instructions = this._instructions.concat(instructions);

		this._next();
	},

	/**
	 */

	'_next': function()
	{
		if(this._running || !this._instructions.length)
		{
			return;
		}

		this._running = true;
		var self = this;


		var name = this._instructions.shift();


		this._target[name](function()
		{
			self._target.change(name);


			if(!self._instructions.length)
			{
				self._target.complete = true;
				self._target.change('complete');
			}
		
			self._running = false;
			self._next();
		});
	}
});
});
_sardines.register("/modules/faebed62/renderView/index.js", function(require, module, exports, __dirname, __filename) {
	var logger = require('mesh-winston').loggers.get('fig');

module.exports = function(view, res) {
	
	logger.debug('rendering view');
	
	view.setup({ el: window.document, $: $ }).init({
		complete: function() {

			logger.debug('finishing view');

			if(res) {
				res.header('dontPrint', true);
				res.end();
			}
		}
	});
}
});
_sardines.register("/modules/8999ac4d/models/index.js", function(require, module, exports, __dirname, __filename) {
	
});
_sardines.register("/modules/8999ac4d/schema/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr');


module.exports = Structr({
	
	/**
	 */

	'__construct': function(target, modifiers)
	{
		this._defs = {};
		this._modifiers = modifiers;

		for(var property in target)
		{
			this.add(property, target[property]);
		}	
	},

	/**
	 */


	'add': function(property, definition)
	{
		this._defs[property] = new exports.Definition(property, definition, this._modifiers);
	},

	/**
	 */

	'definition': function(property)
	{
		return this._defs[property];
	},

	/**
	 */

	'apply': function(model)
	{
		for(var prop in this._defs)
		{
			this._defs[prop].apply(model);
		}	
	},

	/**
	 */

	'set': function(model, property, value)
	{
		var def = this.definition(property);

		return def ? def.set(model, value) : value;
	}
});


exports.Definition = Structr({
	
	/**
	 */

	'__construct': function(property, def, modifiers)
	{
		this.property = property;
		this._modifiers = modifiers;
		this._def = def;

		for(var prop in def) this[prop] = def[prop];
	},

	/**
	 */

	'apply': function(model)
	{
		for(var modifier in this._def)
		{
			this._modifiers[modifier].apply(model, this);
		}
	},

	/**
	 */

	
	'set': function(model, value)
	{
		var newValue = value;

		for(var modifier in this._def)
		{
			var mod = this._modifiers[modifier];

			if(mod)
			{
				newValue = mod.set(model, newValue, this);
			}
		}

		return newValue;
	}
})

});
_sardines.register("/modules/8999ac4d/modifiers/index.js", function(require, module, exports, __dirname, __filename) {
	module.exports = require('./modifiers');

require('./setting');
require('./type');
});
_sardines.register("/modules/8999ac4d/models/item.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
RemoteModel = require('./remote'),
Collection = require('./collection'),
vine = require('vine'),
concrete = require('./concrete');
    

module.exports = RemoteModel.extend(concrete.partial, {
	

	/**
	 * id does not exist? it's new.
	 */

	'isNew': function()
	{
		return this.doc._id == undefined;
	},

	/**
	 */

	'collection': function(collectionName, model, search)
	{
		//root, or relative
		var channel = collectionName.substr(0,1) == '/' ? collectionName : this._channel() + '/' + collectionName;

		return this['__' + collectionName] || (this['__' + collectionName] = this.newModel('Collection', { channel: channel, Model: model, parent: this, doc: search }));
	},

	/**
	 */

	'save': function(doc, callback)
	{
		if(typeof doc == 'function')
		{
			callback = doc;
			doc = {};
		}

		if(!doc) doc = {};

		if(this.parent) doc.parent = this.parent.get('_id');

		this._set(doc);

		var isNew = this.isNew(), self = this;


		function onSave(err, result)
		{
			if(callback) callback(err, result);

			if(isNew && self._collection) self._collection._add(self);
		}

		this.load( isNew ? 'POST' : 'PUT', this.doc, onSave);
		return this;
	},

	/**
	 */
	
	'remove': function(onRemove)
	{                      
		console.log("Malt remove");     
		                                   
		
		this._pull('DELETE', this.removeData(), onRemove);


		//remove from the collection if it exists.
		if(this._collection) this._collection._remove(this.doc);

		this.change('remove');

		return this;
	},

	/**
	 */

	'removeData': function()
	{
		return null;
	},

	/**
	 */

	'override _load': function(method, data, callback)
	{
		if(!data) data = {};

		if(this.isNew()) data = this.doc;


		return this._super(method, data, callback);
	},


	/**
	 */

	'_channel': function()
	{
		if(this.isNew()) return this.channel;
		return this.channel + '/' + this.doc._id;
	},

	/**
	 */

	'_onResponse': function(response)
	{
		if(response.result)
		{
			this._set(response.result instanceof Array ? response.result[0] : response.result);
		}

	},

	/**
	 */

	'override _set': function(doc)
	{
		this._super(doc);

		// this.loaded = this.doc._id != undefined;
	},

	/**
	 */

	'static find': function(query, callback)
	{
		if(typeof query == 'function')
		{
			callback = query;
			query = {};
		}

		var channel = this.prototype.channel;


		if(query._id)
		{
			channel += '/' + query._id;
			delete query._id;
		}

		var model = this.prototype.model('Collection');

		var col = new model( { channel: channel, Model: this });


		col.load(query).subscribeOnce('reset', function(e)
		{
			if(callback) callback(col);
		});

		return col;
	},

	/**
	 */

	'static findOne': function(query, callback)
	{

		this.find(query, function(collection)
		{
			callback(collection.item(0));
		});
	},

	/**
	 */

	'toJSON': function()
	{
		return this.doc;
	}
});





});
_sardines.register("/modules/8999ac4d/models/collection.js", function(require, module, exports, __dirname, __filename) {
	var RemoteModel = require('./remote'),
models = require('./index');

module.exports = RemoteModel.extend({

	/**
	 */

	'override __construct': function()
	{
		this._super.apply(this, arguments);

		this._items = [];
	},
	
	/**
	 */

	'_onResponse': function(response)
	{
		if(!this._items) this._items = [];

		switch(response.method)
		{
			case 'list': return this._list(response.result);
			case 'add': return this._add(this.create(response.result));
			case 'remove': return this._remove(response.result);
			case 'update': return this._remove(response.result, response.result);
			default: return this._list(response.result);
		}
	},

	/**
	 */

	'override _load': function(method, data, callback)
	{
		if(!data) data = this.doc;

		return this._super(method, data, callback);
	},

	/**
	 */

	'toArray': function()
	{
		return this._items.concat();	
	},

	/**
	 */

	'item': function(index)
	{
		return this._items[index];	
	},

	/**
	 */

	'length': function()
	{
		return this._items.length;
	},

	/** 
	 */

	'each': function(callback)
	{
		if(this._items)
		for(var i = 0, n = this._items.length; i < n; i++)
		{ 
			callback(this._items[i], i);;
		}
	},

	/**
	 */

	'add': function(doc)
	{
		var item = this.create(doc);
		item.save();
		this._add(item);
	},

	/**
	 */

	'clone': function()
	{
		return new this.__construct({ channel: this._channel(), Model: this.Model });	
	},

	/**
	 */

	'create': function(doc)
	{
		if(!doc) doc = {};

		// console.log(item)
		var item = this.newItem(doc);
		item.router = this.router;

		if(!item.channel) item.channel = this._channel();


		//ref back to the collection so we cam remove it silently 
		item._collection = this;

		if(item._set) item._set(doc);

		item.loaded = true;

		if(this.parent) item.parent = this.parent;

		return item;
	},

	/**
	 */

	'newItem': function(doc)
	{
		var clazz = this.model(doc.type || this.channel) || this.Model;
		
		return clazz ? new clazz() : doc;	
	},

	/**
	 */

	'_list': function(collection)
	{
		if(!(collection instanceof Array)) collection = [collection];
                                       
		var batch = [];
		
		for(var i = 0, n = collection.length; i < n; i++)
		{
			batch.push(this._add(this.create(collection[i]), true));
		}
		
		this.change('reset', this._items);    
		this.change('batch', batch);
	},

	/**
	 */

	'_add': function(item, skipEmit)
	{
		this._items.push(item);

		if(!skipEmit) this.change('add', item);
		return item;
	},

	/**
	 */

	'_remove': function(item)
	{
		for(var i = this._items.length; i--;)
		{
			var oldItem = this._items[i];

			if(oldItem.doc._id == item._id)
			{
				oldItem.dispose();
				this._items.splice(i, 1);
				return this.change('remove', item, i);
			}
		}

	}

})
});
_sardines.register("/modules/8999ac4d/models/concrete.js", function(require, module, exports, __dirname, __filename) {
	var AbstractModel = require('./abstract');

exports.partial = {

	/**
	 */

	'override __construct': function(doc, ops)
	{
		this._explicit = {};


		for(var prop in this)
		{
			if(this[prop] && this[prop].explicit)
			{
				this._bindFunc(prop);
			}
		}


		this._super(ops);

		this.doc = {}
		this._set(doc);


		if(this._schema) this._schema.apply(this);
	},

	/**
	 */

	'_bindFunc': function(prop)
	{
		this._explicit[prop] = 1;

		var self = this,
		oldFunc = this[prop];

		this[prop] = function(value)
		{
			if(arguments.length)
			{
				oldFunc.call(self, value);
				self._setDoc(prop, arguments[0])
			}
			else
			{
				return oldFunc.call(self);
			}
		}

		this[prop].bind = function(callback)
		{
			self.bind(prop, callback);
		}
	},

	/**
	 */

	'get': function(property)
	{
		if(this._explicit[property]) return this[property].call(this);

		return this.doc[property];
	},

	/**
	 */

	'set': function(property, value, ignoreUpdate)
	{
		if(value == this.get(property)) return;

		value = this._schema ? this._schema.set(this, property, value) : value;


		if(this._explicit[property])
		{
			this[property].call(this, value);
		}
		else
		{
			this._setDoc(property, value, ignoreUpdate);
		}

		
	},

	/**
	 */

	'_setDoc': function(property, value, ignoreUpdate)
	{
		//might just be exposing the doc properties
		this.doc[property] = value;

		this.change(property, value);

		//notify any listeners to update 
		if(!ignoreUpdate) this._update();
	},

	/**
	 */

	'bind': function(property, callback)
	{
		var ret = this.subscribe(property, callback);

		if(this.get(property) != undefined) callback(this.get(property));
		return ret;
	},

	/**
	 */

	'_set': function(doc)
	{
		if(!doc) return;

		if(typeof doc == 'object')
		{
			for(var property in doc)
			{
				this.set(property, doc[property], true);
			}	

			// this.change('update');

			this._update();
		}
		else
		{
			this.doc = doc;
		}
	},

	/**
	 */

	'_update': function()
	{
		this.change('update');
	}
};

exports.Model = AbstractModel.extend(exports.partial);
});
_sardines.register("/modules/8999ac4d/modifiers/modifiers.js", function(require, module, exports, __dirname, __filename) {
	
});
_sardines.register("/modules/8999ac4d/modifiers/setting.js", function(require, module, exports, __dirname, __filename) {
	var modifier = require('./modifiers');


modifier.setting = {
	
	/**
	 */


	apply: function(item, definition)
	{
		var setting = modifier.setting[definition.setting];

		if(!setting) return;


		setting.get(this._key(item, definition), item, function(v)
		{
			item.set(definition.property, v);	
		});
	},

	/**
	 */


	set: function(model, value, definition)
	{
		var setting = modifier.setting[definition.setting];

		if(!setting) return value;

		setting.set(this._key(model, definition), value);

		return value;
	},

	/**
	 */

	'_key': function(model, def)
	{
		return model.name + '.' + def.property;
	}
}


});
_sardines.register("/modules/8999ac4d/modifiers/type.js", function(require, module, exports, __dirname, __filename) {
	var modifier = require('./modifiers');


modifier.type = {
	
	/**
	 */


	apply: function(model, definition) { },

	/**
	 */


	set: function(model, value, definition)
	{
		var clazz = definition.type;

		return new clazz(value);
	}
}


});
_sardines.register("/modules/8999ac4d/models/remote.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
AbstractModel = require('./abstract'),
logger = require('mesh-winston').loggers.get('malt'),
sprintf = require('sprintf').sprintf;


module.exports = AbstractModel.extend({
	

	/**
	 * syncs the model from the server
	 */

	'sync': function(listeners)
	{
		if(this.loaded)
		{
			if(listeners.loaded) listeners.loaded();

			return;	
		}

		this.subscribe(listeners);

		this.load();

		return this;
	},

	/**
	 */

	'unsync': function()
	{
		if(this._listener)
		{
			this._listener.dispose();
			this._listener = null;
		}	

		return this;
	},


	/**
	 */

	'load': function(method, data, callback)
	{
		if(typeof method == 'object')
		{
			callback = data;
			data = method;
			method = undefined;
		}

		if(typeof method == 'function')
		{
			callback = method;
			method = undefined;
			data = undefined;
		}

		if(!callback) callback = function(){}
              	       	
                                                 

		if(this._loading) {
			logger.warn(sprintf('Cannot load method "%s" because the model is still loading', this._channel()));
			return;
		}

		this._loading = true;

		var self = this;
		
		var callSuccess = this._load(method, data, function(response)
		{
			self.loaded = true;

			self._onResponse(response);

			//really - only ONE error should be sent back at a time. Multiple errors
			//should be handled on the client-side of things. 
			if(response.errors) {
				callback(new Error(response.errors[0].message));
			} else {
				callback(null, response.result);
			}

			self._loading = false;
			self.change('loaded', self);
		});   
		
		if(!callSuccess && callback)
		{
			callback(new Error('route does not exist'));
		}
			
		return this;
	},

	/**
	 */

	'_load': function(method, data, callback)
	{ 
		return this._pull(method, data, callback);	
	},


	/**
	 */

	'toJSON': function()
	{
		return this.doc;
	},

	/**
	 */

	'_channel': function()
	{
		return this.channel;
	},

	/**
	 */

	'_onResponse': function(response)
	{
		//abstract
	},

	/**

	 */

	'_pull': function(method, data, onResponse)
	{
		if(typeof data == 'function')
		{
			onResponse = data;
			data = null;
		}         
		
		logger.debug(sprintf('Malt pull method=%s channel=%s', method, this._channel()));    
		 
		return this.router.
		request(this._channel()).
		header('method', method || 'GET').
		error(function(err) {
			logger.error(err.stack);
		}).
		success(function() {
			if(onResponse) onResponse.apply(null, arguments);
		}).
		query(data).
		pull();               
	},


	/**
	 */

	'_initPush': function()
	{
		if(this._listener) return this;

                         

		this._listener = this.router.on(this._channel(), { type: 'push', meta: { 'public': 1 } }, this.getMethod('_onResponse'));	
		return this;
	}

});




});
_sardines.register("/modules/vine/index.js", function(require, module, exports, __dirname, __filename) {
	var outcome = require('outcome'),
EventEmitter = require('events').EventEmitter;


//meh, shit's ugly.
function combineArrays(c1,c2,target,property)
{
	var c1p = c1[property];
		c2p = c2[property];
		
	if(!c1p && !c2p) return;
	
	c1p = c1p || [];
	c2p = c2p || [];
	
	c1p = c1p instanceof Array ? c1p : [c1p];
	c2p = c2p instanceof Array ? c2p : [c2p];
	
	target[property] = c1p.concat(c2p);
}

function _buildMessage()
{
	var msg = arguments[0];

	//error object
	if(msg.message) msg = msg.message;
	
	for(var i = 1, n = arguments.length; i < n; i++)
	{
		msg = msg.replace(/%\w/, arguments[i]);
	}
	
	return msg;
}


var Vine = 
{

	/**
	 */
	 
	setApi: function(request)
	{
		request.api = Vine.api(request);
		
		return request;
	},

	/**
	 */

	api: function(request,methods,data)
	{
		if(!data) data = {};
		
		var methods  = methods || {};
		

		var invoker = 
		{

			/**
			 */

			error: function()
			{
				if(!arguments.length) return data.errors;

				if(arguments[0] instanceof Array) {
					arguments[0].forEach(function(err) {
						invoker.error(err);
					})
					return this;
				}
				
				if(!data.errors) data.errors = [];
				
				data.errors.push({ message: _buildMessage.apply(null, arguments)});
				return this;
			},


			/**
			 * the type of data. Used for 
			 */

			type: function(type)
			{
				if(!arguments.length) return data.type;

				data.type = type;

				return this;
			},

			/**
			 */
			 
			warning: function()
			{
				if(!arguments.length) return data.warnings;
				
				if(!data.warnings) data.warnings = [];
				
				data.warnings.push({ message: _buildMessage.apply(null, arguments)});
				return this;
			},
			
			/**
			 */
			
			'success': function()
			{
				if(!arguments.length) return data.messages;
				
				if(!data.messages) data.messages = [];
				
				data.messages.push({ message: _buildMessage.apply(null, arguments)});
				
				return this;
			},
			
			/**
			 */
			 
			combine: function(api)
			{
				var thisData = data,
					thatData = api.data || api,
					newData = {};
					
				for(var i in thisData) newData[i] = thisData;
				
				combineArrays(thisData,thatData,newData,'errors');
				combineArrays(thisData,thatData,newData,'warnings');
				combineArrays(thisData,thatData,newData,'messages');
				combineArrays(thisData,thatData,newData,'result');
				
				return Vine.api(null,null,newData);
			},

			/**
			 */
			 

			redirect: function(to)
			{
				if(!arguments.length) return data.redirect;
				
				data.redirect = to;
				return this;
			},

			/**
			 */
			 
			message: function(msg)
			{
				if(!arguments.length) return data.message;
				
				data.message = _buildMessage.apply(null, arguments);
				return this;
			},

			/**
			 */

			method: function(method)
			{
				if(!arguments.length) return data.method;
				data.method = method;
				return this;
			},

			/**
			 */

			list: function(data)
			{
				this.result(data);
				return this.method('list');
			},

			/**
			 */

			add: function(data)
			{
				this.result(data);
				return this.method('add');
			},

			/**
			 */

			remove: function(data)
			{
				this.result(data);
				return this.method('remove');
			},

			/**
			 */

			update: function(data)
			{
				this.result(data);
				return this.method('update');
			},

			/**
			 */
			 
			result: function(result)
			{
				if(!arguments.length) return data.result;
				
				data.result = result;
				return this;
			},

			/**
			 */
			 
			results: function(result)
			{
				if(!arguments.length) return data.result;
				
				if(!(data.result instanceof Array)) data.result = [];
				data.result.push(result);
				return this;
			},
			
			/**
			 */
			 
			ttl:function(ttl)
			{
				if(ttl > -1)
					data.ttl = ttl;
					
				return this;
			},


			/**
			 */
			 
			end: function(target)
			{
				if(target)
				if(target.end)
				{
					target.end(data);
				}
				else
				if(typeof target == 'function')
				{
					target(data);
				}
				
				return data;
			},

			/**
			 */

			fn: function(fn)
			{
				if(data.errors) 
				{
					target(data.errors.length > 1 ? data.errors : data.errors[0]);
				}
				else
				{
					fn(null, data.result);
				}	
			},

			/**
			 */

			onOutcome: function(resp, messages) 
			{
				if(messages) {
					messages.resp = resp;
				}

				if(!messages) messages = {};


				return outcome.error(function(err) 
				{
					invoker.error(messages.error || (err ? err.message : err));
						
				}).success(function(result) 
				{
					invoker.result(messages.success || result);

				}).done(function() 
				{
					if(messages.resp) invoker.end(messages.resp);

				});
			},

			/**
			 */
			 
			toJSON: function()
			{
				return invoker.data;
			}
		}
		
		invoker.data = data;


		return invoker;

	}
}

exports.api = Vine.api;

var v = Vine.api();

Object.keys(v).forEach(function(method) {
	exports[method] = function() {
		var api = exports.api();

		return api[method].apply(api, arguments);
	}
})




});

_sardines.register("/modules/vine", function(require, module, exports, __dirname, __filename) {
	module.exports = require('modules/vine/index.js');
});
_sardines.register("/modules/8999ac4d/models/abstract.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
Janitor = require('sk/core/garbage').Janitor,
Bindable = require('../bindable');






module.exports = Bindable.extend({
	
	/**
	 */

	 'override __construct': function(ops)
	 {
	 	this._super();

	 	for(var i in ops) this[i] = ops[i];
	 }


});




});
_sardines.register("/modules/20637ccc/index.js", function(require, module, exports, __dirname, __filename) {
	var loggers = {};

var newLogger = function(module) {

	function logger(name) {

		return function(msg) {
			console.log(name + ": " + module + ": " + msg);
		}	
	}

	return {
		info: logger('info'),
		warn: logger('warn'),
		error: logger('error'),
		debug: logger('debug'),
		verbose: logger('verbose')
	};
}


exports.loggers = {
	get: function(name) {
		return loggers[name] || (loggers[name] = newLogger(name))
	}
}
});
_sardines.register("/modules/sk/core/garbage.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('./struct');

exports.Janitor = Structr({
	
	/**
	 */
	
	'__construct': function()
	{
		this.dispose();
	},
	
	/**
	 * adds an item which can be disposed of later
	 */
	
	'addDisposable': function()
	{
		var args = arguments[0] instanceof Array ? arguments[0] : arguments;
		
		for(var i = args.length; i--;)
		{
			var target = args[i];
			
//			console.log(target)
			if(target && target['dispose'])
			{
				if(this.disposables.indexOf(target) == -1) this.disposables.push(target);
			}
		}
	},
	
	/**
	 * disposes all disposables
	 */
	
	'dispose': function()
	{
		if(this.disposables)
		for(var i = this.disposables.length; i--;)
		{
			this.disposables[i].dispose();
		}
		
		this.disposables = [];
	}
});

});
_sardines.register("/modules/8999ac4d/bindable/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
Janitor = require('sk/core/garbage').Janitor;

module.exports = Structr({
	
	/**
	 */

	 '__construct': function()
	 {
	 	this._bindings = {};
	 },

	 /**
	  */

	 'subscribe': function(listeners)
	 {
	 	var jan = new Janitor();

	 	for(var type in listeners)
	 	{
		 	jan.addDisposable(this.subscribe(type, listeners[type]));
		}

		 return jan;
	 },

	 /**
	  */

	 'second subscribe': function(property, callback)
	 {
	 	var collection = this._bindings[property] || (this._bindings[property] = []);

	 	collection.push(callback);

	 	return { 
	 		dispose: function()
	 		{
	 			var i = collection.indexOf(callback);

	 			if(i > -1) collection.splice(i, 1);
	 		}
		};
	 },

	 /**
	  */

	 'subscribeOnce': function(property, callback)
	 {
	 	var disp,
	 	onChange = function()
	 	{
	 		callback.apply(null, arguments);

	 		disp.dispose();
	 	}

	 	return disp = this.subscribe(property, onChange);
	 },

	 /**
	  */

	 'change': function()
	 {
	 	var args = Structr.argsToArray(arguments);

	 	var collection = this._bindings[args.shift()];

	 	if(collection)
	 	for(var i = collection.length; i--;)
	 	{
	 		collection[i].apply(null, args)
	 	}
	 },

	 /**
	  */

	 'dispose': function()
	 {
	 	this._bindings = [];
	 }
})
});
_sardines.register("/modules/sk/core/struct.js", function(require, module, exports, __dirname, __filename) {
	require('./sk');
module.exports = require('structr');
});
_sardines.register("/modules/sk/core/sk.js", function(require, module, exports, __dirname, __filename) {
	
//IE
if(!Array.prototype.indexOf)
{      
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}
//Spice Kit! Let's make 'em plugabble babby.

if(this.window && !window.console)
{                         
	var console = {log:function(){}}  
}
    
//le NAMESPACE
var	sk = { };

});
var entries = ["modules/edd6af44/src/index.js"],
	module = {};

for(var i = entries.length; i--;)
{
	var entry = _sardines.require(entries[i]);

	for(var property in entry)
	{
		module[property] = entry[property];
	}
}

return module;

})();


if(typeof module != 'undefined') module.exports = __app;