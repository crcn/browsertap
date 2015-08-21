(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BaseApplication = require(3);
var extend          = require(56);

/**
 */

function BrowserClientApplication() {

}

/**
 */

extend(BrowserClientApplication.prototype, BaseApplication.prototype, {

});

/**
 */

module.exports = BrowserClientApplication;

},{"3":3,"56":56}],2:[function(require,module,exports){
var Application = require(1);
var getConfig   = require(14);

var app = new Application({
  config: getConfig({})
});

app.initialize(function() {
  console.log("initialize");
});

},{"1":1,"14":14}],3:[function(require,module,exports){
var BaseModel       = require(18);
var extend          = require(56);
var mesh            = require(79);
var registerPlugins = require(7);
var flatten         = require(29);

/**
 */

function Application(properties) {
  BaseModel.call(this, properties);
  this.use.apply(this, this.plugins);
}

/**
 */

extend(Application.prototype, BaseModel.prototype, {

  /**
   */

  bus: mesh.noop,

  /**
   */

  plugins: [
    require(6),
    require(15),
    require(8)
  ],

  /**
   */

  use: function() {
    registerPlugins(this, flatten(Array.prototype.slice.call(arguments)));
  },

  /**
   */

  initialize: function(next) {
    return this.bus({ name: "initialize", special: true }).once("end", next || function() { });
  },

  /**
   */

  terminate: function(next) {
    return this.bus({ name: "terminate", special: true  }).once("end", next || function() { });
  }
});

/**
 */

module.exports = Application;

},{"15":15,"18":18,"29":29,"56":56,"6":6,"7":7,"79":79,"8":8}],4:[function(require,module,exports){
var Loggly = require(62);

exports.createClient = function(config) {
  var logger = new Loggly(config.token);
  return {
    log: function(data) {
      logger.push(data);
    }
  };
};

},{"62":62}],5:[function(require,module,exports){
var mesh = require(79);

module.exports = function(handlers, defaultBus) {
  var busses = {};
  if (!defaultBus) defaultBus = mesh.noop;

  function commands(operation) {
    var bus = busses[operation.name] || defaultBus;
    return bus(operation);
  }

  commands.addHandler = function(name, handler) {
    var bus;

    if (handler.length === 2) {
      bus = mesh.wrap(handler);
    } else {
      bus = handler;
    }

    var __handlers = [];

    if (!busses[name]) {
      busses[name] = mesh.parallel(__handlers);
      busses[name].__handlers = __handlers;
    }

    __handlers = busses[name].__handlers;
    __handlers.push(bus);

    return {
      dispose: function() {
        var i = __handlers.indexOf(bus);
        if (~i) __handlers.splice(i, 1);
      }
    };
  };

  for (var name in handlers) commands.addHandler(name, handlers[name]);

  return commands;
};

},{"79":79}],6:[function(require,module,exports){
var commands  = require(5);

module.exports = function(app) {
  app.bus = app.commands = commands({}, app.bus);
};

},{"5":5}],7:[function(require,module,exports){
module.exports = function(app, plugins) {
  plugins.forEach(function(plugin) {
    var commands = plugin(app);

    if (!commands) return;

    var disposables = [];

    for (var name in commands) {
      disposables.push(app.commands.addHandler(name, commands[name]));
    }

    app.commands.addHandler("terminate", function(operation, next) {
      disposables.forEach(function(disposable) {
        disposable.dispose();
      });
      next();
    });
  });
};

},{}],8:[function(require,module,exports){
module.exports = [
  require(10),
  require(12),
  require(9),
  require(11),
  require(13)
];

},{"10":10,"11":11,"12":12,"13":13,"9":9}],9:[function(require,module,exports){
var loggly = require(4);

module.exports = function(app) {

  var config = app.get("config.loggly");

  if (!config) return;

  var client = loggly.createClient(config);

  return {
    log: function(operation, next) {

      if (/warn|error/.test(operation.type)) {
        client.log(operation);
      }

      next();
    }
  };
};

},{"4":4}],10:[function(require,module,exports){
module.exports = function(app) {
  var oldBus = app.bus;
  app.bus = function(operation) {

    if (operation.name !== "log") {
      app.logger.verbose("bus ", operation);
    }

    return oldBus(operation);
  };
};

},{}],11:[function(require,module,exports){
module.exports = function(app) {
  var oldBus = app.bus;
  app.bus = function(operation) {
    if (!operation.special) return oldBus(operation);
    app.logger.notice(":break");
    return oldBus(operation).on("end", app.logger.notice.bind(app.logger, ":break"));
  };
};

},{}],12:[function(require,module,exports){
var padRight = require(59);
var chalk    = require(21);

module.exports = function(app) {

  var colors = {
    notice   : "blue",
    warn     : "yellow",
    error    : "red",
    verbose  : "grey",
    info     : "cyan"
  };

  var snippets = {
    ":break": function() {
      return "------------------------------------------------";
    }
  };

  return {
    log: function(operation, next) {

      // TODO - calc log info here such as log(":break");

      var args = operation.args.map(function(arg) {
        if (typeof arg !== "object") return arg;
        return JSON.stringify(arg);
      }).concat();

      var msg = args.shift();

      msg     = typeof msg === "string" ? msg.replace(/%./g, args.shift.bind(args)) : "";

      msg = [msg].concat(args).join(" ");

      if (snippets[msg]) {
        msg = snippets[msg]();
      }

      var color = colors[operation.type];

      var label = ": ";

      if (color) {
        label = chalk[color](label);
      }

      msg =  label + msg;

      if (/warn|error/.test(operation.type)) {
        console.error(msg);
      } else {
        console.log(msg);
      }
    }
  };
};

},{"21":21,"59":59}],13:[function(require,module,exports){
(function (process){
var platform = require(107);

/**
 */

module.exports = process.browser ? browser : server;

/**
 */

var platformInfo = {
  name    : platform.name,
  version : platform.version
};

/**
 */

function browser(app) {
  window.onerror = function(error, url, lineNumber) {
    app.logger.error(error.message, {
      url        : url,
      lineNumber : lineNumber,
      stack      : error.stack,
      platform   : platformInfo
    });
  };
}

/**
 */

function server(app) {
  process.on("uncaughtException", function(error) {
    app.logger.error(error.message, { stack: error.stack, platform: platformInfo });
    app.logger.notice("gracefully shutting down");

    // give some time for the op to send to loggly
    setTimeout(process.exit.bind(process, 1), 1000 * 4);
  });
}

}).call(this,require(20))
},{"107":107,"20":20}],14:[function(require,module,exports){
module.exports = function() {
  return {
    loggly: {

      // https://browsertap.loggly.com/login
      token: "8b127293-b6a6-40a8-b010-fbbcf9ea3437",
      subdomain: "browsertap"
    }
  };
};

},{}],15:[function(require,module,exports){
var Logger = require(17);
var extend = require(56);

/**
 */

module.exports = function(app) {

  var config = extend({
    bus: function(operation) {
      return app.bus(operation);
    }
  }, app.get("config.log"));

  app.logger = new Logger(config);
};

},{"17":17,"56":56}],16:[function(require,module,exports){

exports.NONE     = 1;
exports.NOTICE   = exports.NONE   << 1;
exports.INFO     = exports.NOTICE << 1;
exports.WARN     = exports.INFO   << 1;
exports.ERROR    = exports.WARN   << 1;
exports.VERBOSE  = exports.ERROR  << 1;

exports.ALL         = exports.NONE | exports.INFO | exports.NOTICE | exports.WARN | exports.ERROR | exports.VERBOSE;
exports.PRODUCTION  = exports.NONE | exports.WARN | exports.ERROR;
exports.STAGING     = exports.NOTICE | exports.INFO | exports.PRODUCTION;
exports.DEVELOPMENT = exports.ALL;

exports.fromString = function(level) {
  return level.toUpperCase().split("|").map(function(level) {
    return exports[level] || exports.NONE;
  }).reduce(function(a, b) {
    return a | b;
  });
};

},{}],17:[function(require,module,exports){
var BaseModel = require(18);
var extend    = require(56);
var LogLevels = require(16);
var mesh      = require(79);

/**
 */

function Logger(properties) {
  BaseModel.call(this, properties);
}

/**
 */

extend(Logger.prototype, BaseModel.prototype, {

  /**
   */

  bus: mesh.noop,

  /**
   */

  level: LogLevels.ALL
});

/**
 * attach the methods
 */

Object.keys(LogLevels).forEach(function(key) {
  var code = LogLevels[key];
  if (!(code & LogLevels.NONE)) {
    var type = key.toLowerCase();
    Logger.prototype[type] = function() {
      if (!(this.level & code)) return;
      this.bus({

        // blast off into the either. Enable any handler for logs.
        name: "log",

        // add english term to log
        type: type,

        // maintain consistent property
        level: code,

        // don't do anything to the arguments
        args: Array.prototype.slice.call(arguments, 0)
      });
    };
  }
});

/**
 */

module.exports = Logger;

},{"16":16,"18":18,"56":56,"79":79}],18:[function(require,module,exports){
var extend       = require(56);
var EventEmitter = require(19);

var __getters = {};

/**
 */

function BaseModel(properties) {
  EventEmitter.call(this);
  if (properties) extend(this, properties);
}

/**
 */

extend(BaseModel.prototype, EventEmitter.prototype, {

  /**
   * sets properties on the model
   */

  setProperties: function(properties) {

    var oldProps   = {};
    var newProps   = {};
    var hasChanged = false;

    for (var key in properties) {
      if (this[key] !== properties[key]) {
        hasChanged = true;
        oldProps[key] = this[key];
        newProps[key] = this[key] = properties[key];
      }
    }

    if (hasChanged) this.emit("change", { properties: newProps }, { properties: oldProps });
  },

  /**
   * GET properties on the model without busting
   */

  get: function(keypath) {
    if (__getters[keypath]) return __getters[keypath](this);
    __getters[keypath] = new Function("self", "try { return self." + keypath + "} catch(e) { }");
    return this.get(keypath);
  }
});

/**
 */

module.exports = BaseModel;

},{"19":19,"56":56}],19:[function(require,module,exports){
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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
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
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],20:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],21:[function(require,module,exports){
(function (process){
'use strict';
var escapeStringRegexp = require(23);
var ansiStyles = require(22);
var stripAnsi = require(26);
var hasAnsi = require(24);
var supportsColor = require(28);
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;

}).call(this,require(20))
},{"20":20,"22":22,"23":23,"24":24,"26":26,"28":28}],22:[function(require,module,exports){
'use strict';

function assembleStyles () {
	var styles = {
		modifiers: {
			reset: [0, 0],
			bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		colors: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39]
		},
		bgColors: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49]
		}
	};

	// fix humans
	styles.colors.grey = styles.colors.gray;

	Object.keys(styles).forEach(function (groupName) {
		var group = styles[groupName];

		Object.keys(group).forEach(function (styleName) {
			var style = group[styleName];

			styles[styleName] = group[styleName] = {
				open: '\u001b[' + style[0] + 'm',
				close: '\u001b[' + style[1] + 'm'
			};
		});

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	});

	return styles;
}

Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

},{}],23:[function(require,module,exports){
'use strict';

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe,  '\\$&');
};

},{}],24:[function(require,module,exports){
'use strict';
var ansiRegex = require(25);
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);

},{"25":25}],25:[function(require,module,exports){
'use strict';
module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
};

},{}],26:[function(require,module,exports){
'use strict';
var ansiRegex = require(27)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

},{"27":27}],27:[function(require,module,exports){
'use strict';
module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
};

},{}],28:[function(require,module,exports){
(function (process){
'use strict';
var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();

}).call(this,require(20))
},{"20":20}],29:[function(require,module,exports){
var baseFlatten = require(35);

/**
 * Recursively flattens a nested array.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to recursively flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, 3, [4]]]);
 * // => [1, 2, 3, 4]
 */
function flattenDeep(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, true) : [];
}

module.exports = flattenDeep;

},{"35":35}],30:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],31:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],32:[function(require,module,exports){
var keys = require(57);

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

module.exports = assignWith;

},{"57":57}],33:[function(require,module,exports){
var baseCopy = require(34),
    keys = require(57);

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"34":34,"57":57}],34:[function(require,module,exports){
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],35:[function(require,module,exports){
var arrayPush = require(31),
    isArguments = require(50),
    isArray = require(51),
    isArrayLike = require(44),
    isObjectLike = require(48);

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"31":31,"44":44,"48":48,"50":50,"51":51}],36:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],37:[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],38:[function(require,module,exports){
var identity = require(61);

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"61":61}],39:[function(require,module,exports){
var bindCallback = require(38),
    isIterateeCall = require(46),
    restParam = require(30);

/**
 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"30":30,"38":38,"46":46}],40:[function(require,module,exports){
var baseToString = require(37),
    createPadding = require(41);

/**
 * Creates a function for `_.padLeft` or `_.padRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify padding from the right.
 * @returns {Function} Returns the new pad function.
 */
function createPadDir(fromRight) {
  return function(string, length, chars) {
    string = baseToString(string);
    return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
  };
}

module.exports = createPadDir;

},{"37":37,"41":41}],41:[function(require,module,exports){
(function (global){
var repeat = require(60);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeIsFinite = global.isFinite;

/**
 * Creates the padding required for `string` based on the given `length`.
 * The `chars` string is truncated if the number of characters exceeds `length`.
 *
 * @private
 * @param {string} string The string to create padding for.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the pad for `string`.
 */
function createPadding(string, length, chars) {
  var strLength = string.length;
  length = +length;

  if (strLength >= length || !nativeIsFinite(length)) {
    return '';
  }
  var padLength = length - strLength;
  chars = chars == null ? ' ' : (chars + '');
  return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
}

module.exports = createPadding;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"60":60}],42:[function(require,module,exports){
var baseProperty = require(36);

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"36":36}],43:[function(require,module,exports){
var isNative = require(53);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"53":53}],44:[function(require,module,exports){
var getLength = require(42),
    isLength = require(47);

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"42":42,"47":47}],45:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],46:[function(require,module,exports){
var isArrayLike = require(44),
    isIndex = require(45),
    isObject = require(54);

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"44":44,"45":45,"54":54}],47:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],48:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],49:[function(require,module,exports){
var isArguments = require(50),
    isArray = require(51),
    isIndex = require(45),
    isLength = require(47),
    keysIn = require(58);

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"45":45,"47":47,"50":50,"51":51,"58":58}],50:[function(require,module,exports){
var isArrayLike = require(44),
    isObjectLike = require(48);

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"44":44,"48":48}],51:[function(require,module,exports){
var getNative = require(43),
    isLength = require(47),
    isObjectLike = require(48);

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"43":43,"47":47,"48":48}],52:[function(require,module,exports){
var isObject = require(54);

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"54":54}],53:[function(require,module,exports){
var isFunction = require(52),
    isObjectLike = require(48);

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"48":48,"52":52}],54:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],55:[function(require,module,exports){
var assignWith = require(32),
    baseAssign = require(33),
    createAssigner = require(39);

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it's invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"32":32,"33":33,"39":39}],56:[function(require,module,exports){
module.exports = require(55);

},{"55":55}],57:[function(require,module,exports){
var getNative = require(43),
    isArrayLike = require(44),
    isObject = require(54),
    shimKeys = require(49);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"43":43,"44":44,"49":49,"54":54}],58:[function(require,module,exports){
var isArguments = require(50),
    isArray = require(51),
    isIndex = require(45),
    isLength = require(47),
    isObject = require(54);

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"45":45,"47":47,"50":50,"51":51,"54":54}],59:[function(require,module,exports){
var createPadDir = require(40);

/**
 * Pads `string` on the right side if it's shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padRight('abc', 6);
 * // => 'abc   '
 *
 * _.padRight('abc', 6, '_-');
 * // => 'abc_-_'
 *
 * _.padRight('abc', 3);
 * // => 'abc'
 */
var padRight = createPadDir(true);

module.exports = padRight;

},{"40":40}],60:[function(require,module,exports){
(function (global){
var baseToString = require(37);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
    nativeIsFinite = global.isFinite;

/**
 * Repeats the given string `n` times.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to repeat.
 * @param {number} [n=0] The number of times to repeat the string.
 * @returns {string} Returns the repeated string.
 * @example
 *
 * _.repeat('*', 3);
 * // => '***'
 *
 * _.repeat('abc', 2);
 * // => 'abcabc'
 *
 * _.repeat('abc', 0);
 * // => ''
 */
function repeat(string, n) {
  var result = '';
  string = baseToString(string);
  n = +n;
  if (n < 1 || !string || !nativeIsFinite(n)) {
    return result;
  }
  // Leverage the exponentiation by squaring algorithm for a faster repeat.
  // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
  do {
    if (n % 2) {
      result += string;
    }
    n = nativeFloor(n / 2);
    string += string;
  } while (n);

  return result;
}

module.exports = repeat;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"37":37}],61:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],62:[function(require,module,exports){
var LOGGLY_INPUT_PREFIX = 'http' + (('https:' === document.location.protocol ? 's' : '')) + '://',
    LOGGLY_COLLECTOR_DOMAIN = 'logs-01.loggly.com',
    LOGGLY_INPUT_SUFFIX = '.gif?',
    LOGGLY_SESSION_KEY = 'logglytrackingsession',
    LOGGLY_SESSION_KEY_LENGTH = LOGGLY_SESSION_KEY.length + 1;

function uuid() {
    // lifted from here -> http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function LogglyTracker(key, sessionID) {
    this.key = key;
    this.setSession(sessionID);
    setInputUrl(this);
}


function setInputUrl(tracker) {
    tracker.inputUrl = LOGGLY_INPUT_PREFIX + (tracker.logglyCollectorDomain || LOGGLY_COLLECTOR_DOMAIN) + '/inputs/' + tracker.key + LOGGLY_INPUT_SUFFIX;
}

LogglyTracker.prototype = {
    setSession: function(session_id) {
        if (session_id) {
            this.session_id = session_id;
            this.setCookie(this.session_id);
        } else if (!this.session_id) {
            this.session_id = this.readCookie();
            if (!this.session_id) {
                this.session_id = uuid();
                this.setCookie(this.session_id);
            }
        }
    },
    push: function(data) {
        var type = typeof data;

        if (!data || !(type === 'object' || type === 'string')) {
            return;
        }

        var self = this;

        setTimeout(function() {
            if (type === 'string') {
                data = {
                    'text': data
                };
            } else {
                if (data.logglyCollectorDomain) {
                    self.logglyCollectorDomain = data.logglyCollectorDomain;
                    return;
                }

                if (data.logglyKey) {
                    setKey(self, data.logglyKey);
                    return;
                }

                if (data.session_id) {
                    self.setSession(data.session_id);
                    return;
                }
            }

            if (!self.key) {
                return;
            }

            self.track(data);
        }, 0);

    },
    track: function(data) {
        // inject session id
        data.sessionId = this.session_id;

        try {
            var im = new Image(),
                q = 'PLAINTEXT=' + encodeURIComponent(JSON.stringify(data));
            im.src = this.inputUrl + q;
        } catch (ex) {
            if (window && window.console && typeof window.console.log === 'function') {
                console.log("Failed to log to loggly because of this exception:\n" + ex);
                console.log("Failed log data:", data);
            }
        }
    },
    /**
     *  These cookie functions are not a global utilities.  It is for purpose of this tracker only
     */
    readCookie: function() {
        var cookie = document.cookie,
            i = cookie.indexOf(LOGGLY_SESSION_KEY);
        if (i < 0) {
            return false;
        } else {
            var end = cookie.indexOf(';', i + 1);
            end = end < 0 ? cookie.length : end;
            return cookie.slice(i + LOGGLY_SESSION_KEY_LENGTH, end);
        }
    },
    setCookie: function(value) {
        document.cookie = LOGGLY_SESSION_KEY + '=' + value;
    }
};

module.exports = LogglyTracker;

},{}],63:[function(require,module,exports){
(function (process){
var Stream = require(98).Stream;

/**
 */

module.exports = function(fn) {
  var stream = new Stream();

  process.nextTick(function() {
    fn(stream);
  });

  stream.reader = stream;

  return stream;
};

}).call(this,require(20))
},{"20":20,"98":98}],64:[function(require,module,exports){
module.exports = function(items, each, complete) {
  var i = 0;
  var completed = false;

  function done() {
    if (completed) return;
    completed = true;
    return complete.apply(this, arguments);
  }

  items.forEach(function(item) {
    each(item, function(err, item) {
      if (err) return done(err);
      if (++i >= items.length) return done();
    });
  });

  if (!items.length) done();
};

},{}],65:[function(require,module,exports){
module.exports = function(items, each, complete) {
  var i = 0;

  function run() {
    if (i >= items.length) return complete();
    each(items[i++], function(err, item) {
      if (err) return complete(err);
      run();
    });
  }

  run();
};

},{}],66:[function(require,module,exports){

function _equals(a, b) {

  var toa = typeof a;
  var tob = typeof b;

  if (toa !== tob) return false;

  if (toa === "object") {
    for (var k in a) {
      if (!_equals(a[k], b[k])) return false;
    }

    return true;
  }

  return a === b;
}

module.exports = _equals;

},{}],67:[function(require,module,exports){

module.exports = function(match) {

  if (match instanceof RegExp) {
    return function(operation) {
      return match.test(operation.name);
    };
  } else if (match.test) {
    return function(operation) {
      return match.test(operation);
    };
  } else if (typeof match === "function") {
    return match;
  } else {
    return function(operation) {
      return operation.name === match;
    };
  }

  return function() {
    return false;
  };
};

},{}],68:[function(require,module,exports){
var _isArray = require(69);

module.exports = function(targetBus) {
  return function(/* ... */ busses) {

    busses = _isArray(busses) ? busses : Array.prototype.slice.call(arguments);

    return function(operation) {
      return targetBus(operation, busses);
    };
  };
};

},{"69":69}],69:[function(require,module,exports){
module.exports = function(data) {
  return Object.prototype.toString.call(data) === "[object Array]";
};

},{}],70:[function(require,module,exports){
var _group  = require(68);
var _async  = require(63);

module.exports = function(iterator) {
  return _group(function(operation, busses) {
    return _async(function(stream) {
      iterator(busses, function(bus, complete) {
        bus(operation).once("error", complete).once("end", complete).pipe(stream, { end: false });
      }, function(err) {
        if (!err) stream.end();
      });
    });
  });
};

},{"63":63,"68":68}],71:[function(require,module,exports){
var Writable    = require(98).Writable;
var _async      = require(63);
var _eachSeries = require(65);
var _group      = require(68);
var through     = require(98).through;

/**
 */

module.exports = function(iterator) {
  return _group(function(operation, busses) {
    return _async(function(stream) {

      var found;
      var i = 0;

      iterator(busses, function(bus, next) {
        var index = ++i;
        var bs;

        // TODO - duplex this

        (bs = bus(operation)).pipe(through(function(data, next) {
          if (!found || found === index) {
            found = index;
            this.push(data);
          }
          next();
        })).once("end", function() {
          if (found) {
            stream.end();
          } else {
            next();
          }
        }).pipe(stream, { end: false });

        if (bs.writable) {
          stream.once("end", bs.end.bind(bs));
        }
      }, function() {
        stream.end();
      });
    });
  });
};

},{"63":63,"65":65,"68":68,"98":98}],72:[function(require,module,exports){
var _isArray = require(69);

module.exports = function(data) {
  if (data == void 0) return [];
  return _isArray(data) ? data : [data];
};

},{"69":69}],73:[function(require,module,exports){
var _async     = require(63);
var _getFilter = require(67);
var noop       = require(82);

module.exports = function(accept, bus, elseBus) {

  var filter = _getFilter(accept);

  if (!elseBus) elseBus = noop;

  return function(operation) {
    if (filter(operation)) return bus(operation);
    return elseBus(operation);
  };
};

},{"63":63,"67":67,"82":82}],74:[function(require,module,exports){
var createOperation = require(84);
var extend          = require(106);

// TODO - check if bus is a child. If so, grab target & options and return that instead
module.exports = function(options, bus) {

  if (typeof options === "string") {
    var prop = options;
    options = function(operation) {
      return operation[prop];
    };
  }

  if (bus.__attached && typeof bus.options !== "function" && typeof options !== "function") {
    options = extend({}, bus.options, options);
    bus     = bus.target;
  }

  function ret(operation) {
    return bus(extend({}, operation, typeof options === "function" ? options(operation) : options));
  }

  ret.__attached = true;
  ret.options    = options;
  ret.target     = bus;

  return ret;
};

},{"106":106,"84":84}],75:[function(require,module,exports){
var stream = require(92);

module.exports = function(bus) {
  return stream(function(operation, stream) {
    var buffer = [];
    var error;
    bus(operation)
    .on("error", function(err) {
      error = err;
      stream.emit("error", err);
    })
    .on("data", buffer.push.bind(buffer))
    .on("end", function() {
      if (!error) {
        buffer.forEach(stream.write.bind(stream));
      }
      stream.end();
    });
  });
};

},{"92":92}],76:[function(require,module,exports){
var stream = require(92);
module.exports = function(bus, handler) {
  return stream(function(operation, stream) {
    bus(operation).on("error", handler).pipe(stream);
  });
};

},{"92":92}],77:[function(require,module,exports){
var noop = require(82);

function _defaults(from, to) {
  for (var key in from) {
    if (to[key] == void 0) to[key] = from[key];
  }
  return to;
}

module.exports = function(properties, bus) {

  if (bus.__defaults && typeof bus.__defaults !== "function") {
    bus.__defaults = _defaults(properties, bus.__defaults);
  }

  var ret = function(operation) {
    return bus(_defaults(typeof ret.__defaults === "function" ? ret.__defaults(operation) : ret.__defaults, operation));
  };

  ret.__defaults = typeof properties === "function" ? properties : _defaults(properties, {});

  return ret;
};

},{"82":82}],78:[function(require,module,exports){
var _eachSeries = require(65);
var _pickOne    = require(71);

/**
 */

module.exports = _pickOne(_eachSeries);

},{"65":65,"71":71}],79:[function(require,module,exports){

/**
 */

module.exports = {
  parallel     : require(85),
  sequence     : require(91),
  first        : require(78),
  fallback     : require(78),
  race         : require(86),
  operation    : require(84),
  op           : require(84),
  attach       : require(74),
  defaults     : require(77),
  retry        : require(89),
  run          : require(90),
  map          : require(81),
  noop         : require(82),
  reduce       : require(87),
  catchError   : require(76),
  timeout      : require(94),
  wrap         : require(96),
  stream       : require(92),
  wait         : require(95),
  open         : require(83),
  tailable     : require(93),
  accept       : require(73),
  reject       : require(88),
  limit        : require(80),
  yields       : require(97),
  buffer       : require(75)
};

},{"73":73,"74":74,"75":75,"76":76,"77":77,"78":78,"80":80,"81":81,"82":82,"83":83,"84":84,"85":85,"86":86,"87":87,"88":88,"89":89,"90":90,"91":91,"92":92,"93":93,"94":94,"95":95,"96":96,"97":97}],80:[function(require,module,exports){
var stream = require(92);

module.exports = function(count, bus) {

  var numRunning = 0;
  var queue      = [];

  function dequeue() {
    if (--numRunning < count && !!queue.length) run.apply(void 0, queue.shift());
  }

  function run(operation, writer) {
    numRunning++;
    bus(operation).once("error", dequeue).once("end", dequeue).pipe(writer);
  }

  return stream(function(operation, writer) {
    if (numRunning >= count) {
      queue.push([operation, writer]);
    } else {
      run(operation, writer);
    }
  });
};

},{"92":92}],81:[function(require,module,exports){
var s  = require(98);
var stream  = require(92);
var through = s.through;

module.exports = function(bus, map) {
  return stream(function(operation, writable) {
    bus(operation).pipe(through(function(data, next) {
      var mapper = s.stream();
      mapper.pipe(writable, { end: false });
      mapper.once("end", next);
      map(operation, data, mapper);
    })).on("data", function() { }).on("end", writable.end.bind(writable));
  });
};

},{"92":92,"98":98}],82:[function(require,module,exports){
var stream = require(92);

module.exports = stream(function(operation, stream) {
  stream.end();
});

},{"92":92}],83:[function(require,module,exports){
var through = require(98).through;

module.exports = function(bus) {
  return through(function(operation, next) {
    var self = this;
    bus(operation).on("data", function(data) {
      self.push(data);
    }).on("end", next);
  });
};

},{"98":98}],84:[function(require,module,exports){
var extend = require(106);

/**
 */

function Operation(name, options) {
  if (!options) options = {};
  extend(this, options);
  this.name = name;
}

/**
 */

module.exports = function(name, options) {
  return new Operation(name, options);
};

},{"106":106}],85:[function(require,module,exports){
var _eachParallel = require(64);
var _merge        = require(70);

/**
 */

module.exports = _merge(_eachParallel);

},{"64":64,"70":70}],86:[function(require,module,exports){
var _eachParallel = require(64);
var _pickOne      = require(71);

/**
 */

module.exports = _pickOne(_eachParallel);

},{"64":64,"71":71}],87:[function(require,module,exports){
var stream  = require(92);
var through = require(98).through;

module.exports = function(bus, reduce) {
  return stream(function(operation, writable) {
    var buffer;
    bus(operation).pipe(through(function(data, next) {

      if (buffer) {
        buffer = reduce(operation, buffer, data);
      } else {
        buffer = data;
      }

      next();
    }, function() {
      this.push(buffer);
    })).pipe(writable);
  });
};

},{"92":92,"98":98}],88:[function(require,module,exports){
var _getFilter = require(67);
var accept     = require(73);

module.exports = function(reject, bus, elseBus) {
  var filter = _getFilter(reject);
  return accept(function(operation) {
    return !filter(operation);
  }, bus, elseBus);
};

},{"67":67,"73":73}],89:[function(require,module,exports){
var stream = require(92);

module.exports = function(count, errorFilter, bus) {

  if (arguments.length === 2) {
    bus         = errorFilter;
    errorFilter = void 0;
  }

  if (!errorFilter) {
    errorFilter = function(operation, error) {
      return true;
    };
  }

  return stream(function(operation, stream) {

    var retryCountdown = count;

    function run(error) {

      if (error) {
        if (!errorFilter(error) || retryCountdown <= 0) {
          return stream.emit("error", error);
        }
      }

      retryCountdown--;

      bus(operation)
      .on("data", function(data) {
        retryCountdown = 0;
        stream.write(data);
      })
      .on("error", run)
      .on("end", function() {
        stream.end();
      });
    }

    run();
  });
};

},{"92":92}],90:[function(require,module,exports){
var operation = require(84);

module.exports = function(bus, operationName, options, onRun) {
  var buffer = [];

  if (typeof options === "function") {
    onRun   = options;
    options = {};
  }

  // TODO - use through here
  bus(operation(operationName, options)).
  on("data", function(data) {
    buffer.push(data);
  }).
  on("error", onRun).
  on("end", function() {
    if (options.multi) {
      return onRun(void 0, buffer);
    } else {
      return onRun(void 0, buffer.length ? buffer[0] : void 0);
    }
  });
};

},{"84":84}],91:[function(require,module,exports){
var _eachSeries = require(65);
var _merge      = require(70);

/**
 */

module.exports = _merge(_eachSeries);

},{"65":65,"70":70}],92:[function(require,module,exports){
var _async = require(63);

module.exports = function(fn) {
  return function(operation) {
    return _async(function(writable) {
      return fn(operation, writable);
    });
  };
};

},{"63":63}],93:[function(require,module,exports){
var fallback = require(78);
var sequence = require(91);
var accept   = require(73);
var stream   = require(92);
var _equals  = require(66);
var extend   = require(106);

module.exports = function(bus, compare) {

  if (!compare) {
    compare = _equals;
  }

  var listeners = [];
  var testOps   = {};

  return fallback(
    accept("tail", stream(function(a, writable) {

      a = extend({}, a);
      delete a.name;

      writable.test = function(b) {
        return compare(a, b);
      };

      listeners.push(writable);
      writable.once("end", function() {
        listeners.splice(listeners.indexOf(writable), 1);
      });
    })),
    sequence(
      bus,
      stream(function(operation, stream) {
        for (var i = listeners.length; i--;) {
          var listener = listeners[i];
          if (listener.test(operation)) {
            listeners[i].write(operation);
          }
        }
        stream.end();
      })
    )
  );
};

},{"106":106,"66":66,"73":73,"78":78,"91":91,"92":92}],94:[function(require,module,exports){
var stream = require(92);

module.exports = function(ms, bus) {
  return stream(function(operation, response) {

    bus(operation).pipe(response);

    var timer = setTimeout(function() {
      response.emit("error", new Error("timeout"));
    }, ms);

    function clearTimer() {
      if (timer) clearTimeout(timer);
      timer = void 0;
    }

    response.once("data", clearTimer);
    response.once("end", clearTimer);
  });
};

},{"92":92}],95:[function(require,module,exports){
var stream = require(92);

module.exports = function(wait, bus) {
  return stream(function(operation, stream) {
    wait(function(error) {
      if (error) return stream.emit("error", error);
      bus(operation).pipe(stream);
    });
  });
};

},{"92":92}],96:[function(require,module,exports){
var _toArray = require(72);
var stream   = require(92);

module.exports = function(callback) {
  return stream(function(operation, stream) {
    callback(operation, function(err, data) {
      if (err) return stream.emit("error", err);

      var items = _toArray(data);

      _toArray(data).forEach(function(data) {
        stream.write(data);
      });

      stream.end();
    });
  });
};

},{"72":72,"92":92}],97:[function(require,module,exports){
var wrap     = require(96);
var attach       = require(74);

module.exports = function(error, data) {

  var errorFn = typeof error === "function" ? error : function() {
    return error;
  };

  var dataFn = typeof data === "function" ? data : function() {
    return data;
  };

  return attach({ multi: true }, wrap(function(operation, next) {
    next(errorFn(operation), dataFn(operation));
  }));
};

},{"74":74,"96":96}],98:[function(require,module,exports){
var Readable = require(100);
var Writable = require(104);
var Stream   = require(101);
var through  = require(102);
var wrap     = require(103);

exports.Readable = Readable;
exports.readable = Readable;

exports.Writable = Writable;
exports.writable = Writable;

exports.Stream = Stream;
exports.stream = Stream;

exports.through = through;

exports.wrap    = wrap;

},{"100":100,"101":101,"102":102,"103":103,"104":104}],99:[function(require,module,exports){
module.exports = function(src, dst, ops) {

  var listeners = [];

  function cleanup() {
    for (var i = listeners.length; i--;) listeners[i].dispose();
  }

  function onData(data) {
    if (dst.writable && dst.write(data) === false) {
      src.pause();
    }
  }

  function onDrain() {
    if (src.readable) {
      src.resume();
    }
  }

  function onError(error) {
    cleanup();
    dst.emit("error", error);
    // TODO: throw error if there are no handlers here
  }

  var didEnd = false;

  function onEnd() {
    if (didEnd) return;
    didEnd = true;
    dst.end();
  }

  function onClose() {
    if (didEnd) return;
    didEnd = true;
    if (typeof dst.destroy === "function") dst.destroy();
  }

  function listen(target, event, listener) {
    target.on(event, listener);
    return {
      dispose: function() {
        return target.removeListener(event, listener);
      }
    };
  }

  if (!ops || ops.end !== false) {
    listeners.push(
      listen(src, "end", onEnd),
      listen(src, "close", onClose)
    );
  }

  listeners.push(
    listen(src, "data", onData),
    listen(dst, "drain", onDrain),
    listen(src, "end", cleanup),
    listen(src, "close", cleanup),
    listen(dst, "close", cleanup),
    listen(src, "error", onError),
    listen(dst, "error", cleanup)
  );

  dst.emit("pipe", src);

  return dst;
};

},{}],100:[function(require,module,exports){
var protoclass   = require(105);
var EventEmitter = require(19).EventEmitter;
var pipe         = require(99);

/**
 */

function Readable () {
  if (!(this instanceof Readable)) return new Readable();
  EventEmitter.call(this);
  this.setMaxListeners(0);
}

/**
 */

protoclass(EventEmitter, Readable, {

  /**
   */

  _flowing: true,
  readable: true,
  writable: false,

  /**
   */

  pause: function() {
    if (!this._flowing) return;
    this._flowing = false;
    this.emit("pause");
  },

  /**
   */

  resume: function() {
    if (this._flowing) return;
    this._flowing = true;
    this.emit("resume");
  },

  /**
   */

  isPaused: function() {
    return !this._flowing;
  },

  /**
   */

  pipe: function(dst, ops) {
    return pipe(this, dst, ops);
  }
});

module.exports = Readable;

},{"105":105,"19":19,"99":99}],101:[function(require,module,exports){
var protoclass = require(105);
var Writer     = require(104);

/**
 */

function Stream (reader, writer) {
  if (!(this instanceof Stream)) return new Stream();
  this._writer = writer || new Writer();
  this._reader = reader || this._writer.reader;
}

/**
 */

protoclass(Stream, {

  /**
   */

  readable: true,
  writable: true,

  /**
   */

  pause: function() {
    return this._reader.pause();
  },

  /**
   */

  resume: function() {
    return this._reader.resume();
  },

  /**
   */

  write: function(object) {
    return this._writer.write.apply(this._writer, arguments);
  },

  /**
   */

  end: function(object) {
    return this._writer.end.apply(this._writer, arguments);
  },

  /**
   */

  emit: function() {
    return this._reader.emit.apply(this._reader, arguments);
  },

  /**
   */

  on: function() {
    this._reader.on.apply(this._reader, arguments);
    return this;
  },

  /**
   */

  once: function() {
    this._reader.once.apply(this._reader, arguments);
    return this;
  },

  /**
   */

  removeListener: function() {
    return this._reader.removeListener.apply(this._reader, arguments);
  },

  /**
   */

  pipe: function() {
    return this._reader.pipe.apply(this._reader, arguments);
  }
});

module.exports = Stream;

},{"104":104,"105":105}],102:[function(require,module,exports){
(function (process){
var protoclass = require(105);
var Readable   = require(100);
var Stream     = require(101);
var Writable   = require(104);

/**
 */

function Through (stream) {
  this._stream = stream;
  this._reader = stream.reader;
}

/**
 */

protoclass(Through, {
  push: function(object) {

    if (!this._reader._events.data) {
      this._waitForListener();
    }

    this._stream.write(object);
  },

  /**
   */

  _waitForListener: function() {
    if (this._waiting) return;
    this._waiting = true;

    var self = this;
    function onListener(name) {
      if (name === "data") {
        self._reader.removeListener("newListener", onListener);
        process.nextTick(function() {
          self._reader.resume();
        });
      }
    }

    this._reader.on("newListener", onListener);
    this._reader.pause();
  }
});

/**
 */

module.exports = function(write, end) {

  var dstWriter = new Writable();
  var srcWriter = new Writable();
  var stream    = new Stream(dstWriter.reader, srcWriter);
  var through   = new Through(dstWriter);

  var buffer  = [];
  var running = false;
  var ended   = false;

  function _write() {
    if (running) return;

    if (buffer.length) {
      running = true;
      return write.call(through, buffer.shift(), function() {
        running = false;
        _write();
      });
    }

    if (ended) {
      if (end) end.call(through);
      dstWriter.end();
    }
  }

  srcWriter.reader.on("data", function(data) {
    buffer.push(data);
    _write();
  }).on("end", function() {
    ended = true;
    _write();
  });

  return stream;
};

}).call(this,require(20))
},{"100":100,"101":101,"104":104,"105":105,"20":20}],103:[function(require,module,exports){
var Stream = require(101);

module.exports = function(fn) {
  return function() {
    var s = new Stream();
    setTimeout(function(args) {
      fn.apply(void 0, args.concat(function(err, data) {
        if (err) return s.emit("error", err);
        s.end(data);
      }));
    }, 0, Array.prototype.slice.call(arguments));
    return s;
  };
};

},{"101":101}],104:[function(require,module,exports){
var protoclass   = require(105);
var EventEmitter = require(19).EventEmitter;
var Reader       = require(100);

/**
 */

function Writable () {
  if (!(this instanceof Writable)) return new Writable();
  EventEmitter.call(this);
  this.setMaxListeners(0);

  this._pool  = [];
  this.reader = new Reader();

  var self = this;

  this.reader.on("pause", function() {
    self._pause();
  });

  this.reader.on("resume", function() {
    self._resume();
  });

}

/**
 */

protoclass(EventEmitter, Writable, {

  /**
   */

  _flowing: true,
  readable: false,
  writable: true,

  /**
   */

  write: function(object) {
    if (!this._write(object)) {
      this._pool.push(object);
      return false;
    }
    return true;
  },

  /**
   */

  end: function(object) {

    this._ended = true;

    if (object != void 0) {
      this.write(object);
    }

    if (this._flowing) {
      this.reader.emit("end");
    }
  },

  /**
   */

  _write: function(object) {
    if (this._flowing) {
      this.reader.emit("data", object);

      // might have changed on emit
      return this._flowing;
    } else {
      return false;
    }
  },

  /**
   */

  _pause: function() {
    this._flowing = false;
  },

  /**
   */

  _resume: function() {
    if (this._flowing) return;
    this._flowing = true;
    this.reader.emit("drain");

    while (this._pool.length) {
      var item = this._pool.shift();
      if (!this._write(item)) {
        this._pool.unshift(item);
        break;
      }
    }

    if (!this._pool.length && this._ended) {
      this.end();
    }
  }
});

module.exports = Writable;

},{"100":100,"105":105,"19":19}],105:[function(require,module,exports){
function _copy (to, from) {

  for (var i = 0, n = from.length; i < n; i++) {

    var target = from[i];

    for (var property in target) {
      to[property] = target[property];
    }
  }

  return to;
}

function protoclass (parent, child) {

  var mixins = Array.prototype.slice.call(arguments, 2);

  if (typeof child !== "function") {
    if(child) mixins.unshift(child); // constructor is a mixin
    child   = parent;
    parent  = function() { };
  }

  _copy(child, parent); 

  function ctor () {
    this.constructor = child;
  }

  ctor.prototype  = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  child.parent    = child.superclass = parent;

  _copy(child.prototype, mixins);

  protoclass.setup(child);

  return child;
}

protoclass.setup = function (child) {


  if (!child.extend) {
    child.extend = function(constructor) {

      var args = Array.prototype.slice.call(arguments, 0);

      if (typeof constructor !== "function") {
        args.unshift(constructor = function () {
          constructor.parent.apply(this, arguments);
        });
      }

      return protoclass.apply(this, [this].concat(args));
    }

    child.mixin = function(proto) {
      _copy(this.prototype, arguments);
    }

    child.create = function () {
      var obj = Object.create(child.prototype);
      child.apply(obj, arguments);
      return obj;
    }
  }

  return child;
}


module.exports = protoclass;

},{}],106:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],107:[function(require,module,exports){
(function (global){
/*!
 * Platform.js v1.3.0 <http://mths.be/platform>
 * Copyright 2010-2014 John-David Dalton <http://allyoucanleet.com/>
 * Available under MIT license <http://mths.be/mit>
 */
;(function() {
  'use strict';

  /** Used to determine if values are of the language type `Object` */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Backup possible global object */
  var oldRoot = root;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /**
   * Used as the maximum length of an array-like object.
   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   */
  var maxSafeInteger = Math.pow(2, 53) - 1;

  /** Opera regexp */
  var reOpera = /\bOpera/;

  /** Possible global object */
  var thisBinding = this;

  /** Used for native method references */
  var objectProto = Object.prototype;

  /** Used to check for own properties of an object */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to resolve the internal `[[Class]]` of values */
  var toString = objectProto.toString;

  /*--------------------------------------------------------------------------*/

  /**
   * Capitalizes a string value.
   *
   * @private
   * @param {string} string The string to capitalize.
   * @returns {string} The capitalized string.
   */
  function capitalize(string) {
    string = String(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * A utility function to clean up the OS name.
   *
   * @private
   * @param {string} os The OS name to clean up.
   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
   * @param {string} [label] A label for the OS.
   */
  function cleanupOS(os, pattern, label) {
    // platform tokens defined at
    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    var data = {
      '6.4':  '10',
      '6.3':  '8.1',
      '6.2':  '8',
      '6.1':  'Server 2008 R2 / 7',
      '6.0':  'Server 2008 / Vista',
      '5.2':  'Server 2003 / XP 64-bit',
      '5.1':  'XP',
      '5.01': '2000 SP1',
      '5.0':  '2000',
      '4.0':  'NT',
      '4.90': 'ME'
    };
    // detect Windows version from platform tokens
    if (pattern && label && /^Win/i.test(os) &&
        (data = data[0/*Opera 9.25 fix*/, /[\d.]+$/.exec(os)])) {
      os = 'Windows ' + data;
    }
    // correct character case and cleanup
    os = String(os);

    if (pattern && label) {
      os = os.replace(RegExp(pattern, 'i'), label);
    }

    os = format(
      os.replace(/ ce$/i, ' CE')
        .replace(/\bhpw/i, 'web')
        .replace(/\bMacintosh\b/, 'Mac OS')
        .replace(/_PowerPC\b/i, ' OS')
        .replace(/\b(OS X) [^ \d]+/i, '$1')
        .replace(/\bMac (OS X)\b/, '$1')
        .replace(/\/(\d)/, ' $1')
        .replace(/_/g, '.')
        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
        .replace(/\bx86\.64\b/gi, 'x86_64')
        .replace(/\b(Windows Phone) OS\b/, '$1')
        .split(' on ')[0]
    );

    return os;
  }

  /**
   * An iteration utility for arrays and objects.
   *
   * @private
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   */
  function each(object, callback) {
    var index = -1,
        length = object ? object.length : 0;

    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
      while (++index < length) {
        callback(object[index], index, object);
      }
    } else {
      forOwn(object, callback);
    }
  }

  /**
   * Trim and conditionally capitalize string values.
   *
   * @private
   * @param {string} string The string to format.
   * @returns {string} The formatted string.
   */
  function format(string) {
    string = trim(string);
    return /^(?:webOS|i(?:OS|P))/.test(string)
      ? string
      : capitalize(string);
  }

  /**
   * Iterates over an object's own properties, executing the `callback` for each.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function executed per own property.
   */
  function forOwn(object, callback) {
    for (var key in object) {
      if (hasOwnProperty.call(object, key)) {
        callback(object[key], key, object);
      }
    }
  }

  /**
   * Gets the internal `[[Class]]` of a value.
   *
   * @private
   * @param {*} value The value.
   * @returns {string} The `[[Class]]`.
   */
  function getClassOf(value) {
    return value == null
      ? capitalize(value)
      : toString.call(value).slice(8, -1);
  }

  /**
   * Host objects can return type values that are different from their actual
   * data type. The objects we are concerned with usually return non-primitive
   * types of "object", "function", or "unknown".
   *
   * @private
   * @param {*} object The owner of the property.
   * @param {string} property The property to check.
   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
   */
  function isHostType(object, property) {
    var type = object != null ? typeof object[property] : 'number';
    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
      (type == 'object' ? !!object[property] : true);
  }

  /**
   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
   *
   * @private
   * @param {string} string The string to qualify.
   * @returns {string} The qualified string.
   */
  function qualify(string) {
    return String(string).replace(/([ -])(?!$)/g, '$1?');
  }

  /**
   * A bare-bones `Array#reduce` like utility function.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {*} The accumulated result.
   */
  function reduce(array, callback) {
    var accumulator = null;
    each(array, function(value, index) {
      accumulator = callback(accumulator, value, index, array);
    });
    return accumulator;
  }

  /**
   * Removes leading and trailing whitespace from a string.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} The trimmed string.
   */
  function trim(string) {
    return String(string).replace(/^ +| +$/g, '');
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new platform object.
   *
   * @memberOf platform
   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
   *  context object.
   * @returns {Object} A platform object.
   */
  function parse(ua) {

    /** The environment context object */
    var context = root;

    /** Used to flag when a custom context is provided */
    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

    // juggle arguments
    if (isCustomContext) {
      context = ua;
      ua = null;
    }

    /** Browser navigator object */
    var nav = context.navigator || {};

    /** Browser user agent string */
    var userAgent = nav.userAgent || '';

    ua || (ua = userAgent);

    /** Used to flag when `thisBinding` is the [ModuleScope] */
    var isModuleScope = isCustomContext || thisBinding == oldRoot;

    /** Used to detect if browser is like Chrome */
    var likeChrome = isCustomContext
      ? !!nav.likeChrome
      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

    /** Internal `[[Class]]` value shortcuts */
    var objectClass = 'Object',
        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
        enviroClass = isCustomContext ? objectClass : 'Environment',
        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

    /** Detect Java environment */
    var java = /\bJava/.test(javaClass) && context.java;

    /** Detect Rhino */
    var rhino = java && getClassOf(context.environment) == enviroClass;

    /** A character to represent alpha */
    var alpha = java ? 'a' : '\u03b1';

    /** A character to represent beta */
    var beta = java ? 'b' : '\u03b2';

    /** Browser document object */
    var doc = context.document || {};

    /**
     * Detect Opera browser (Presto-based)
     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
     */
    var opera = context.operamini || context.opera;

    /** Opera `[[Class]]` */
    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
      ? operaClass
      : (opera = null);

    /*------------------------------------------------------------------------*/

    /** Temporary variable used over the script's lifetime */
    var data;

    /** The CPU architecture */
    var arch = ua;

    /** Platform description array */
    var description = [];

    /** Platform alpha/beta indicator */
    var prerelease = null;

    /** A flag to indicate that environment features should be used to resolve the platform */
    var useFeatures = ua == userAgent;

    /** The browser/environment version */
    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

    /** A flag to indicate if the OS ends with "/ Version" */
    var isSpecialCasedOS;

    /* Detectable layout engines (order is important) */
    var layout = getLayout([
      'Trident',
      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
      'iCab',
      'Presto',
      'NetFront',
      'Tasman',
      'KHTML',
      'Gecko'
    ]);

    /* Detectable browser names (order is important) */
    var name = getName([
      'Adobe AIR',
      'Arora',
      'Avant Browser',
      'Breach',
      'Camino',
      'Epiphany',
      'Fennec',
      'Flock',
      'Galeon',
      'GreenBrowser',
      'iCab',
      'Iceweasel',
      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
      'K-Meleon',
      'Konqueror',
      'Lunascape',
      'Maxthon',
      'Midori',
      'Nook Browser',
      'PhantomJS',
      'Raven',
      'Rekonq',
      'RockMelt',
      'SeaMonkey',
      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Sleipnir',
      'SlimBrowser',
      'Sunrise',
      'Swiftfox',
      'WebPositive',
      'Opera Mini',
      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
      'Opera',
      { 'label': 'Opera', 'pattern': 'OPR' },
      'Chrome',
      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
      { 'label': 'IE', 'pattern': 'IEMobile' },
      { 'label': 'IE', 'pattern': 'MSIE' },
      'Safari'
    ]);

    /* Detectable products (order is important) */
    var product = getProduct([
      { 'label': 'BlackBerry', 'pattern': 'BB10' },
      'BlackBerry',
      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
      'Google TV',
      'Lumia',
      'iPad',
      'iPod',
      'iPhone',
      'Kindle',
      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Nook',
      'PlayBook',
      'PlayStation 4',
      'PlayStation 3',
      'PlayStation Vita',
      'TouchPad',
      'Transformer',
      { 'label': 'Wii U', 'pattern': 'WiiU' },
      'Wii',
      'Xbox One',
      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
      'Xoom'
    ]);

    /* Detectable manufacturers */
    var manufacturer = getManufacturer({
      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
      'Asus': { 'Transformer': 1 },
      'Barnes & Noble': { 'Nook': 1 },
      'BlackBerry': { 'PlayBook': 1 },
      'Google': { 'Google TV': 1 },
      'HP': { 'TouchPad': 1 },
      'HTC': {},
      'LG': {},
      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
      'Motorola': { 'Xoom': 1 },
      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
      'Nokia': { 'Lumia': 1 },
      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
      'Sony': { 'PlayStation 4': 1, 'PlayStation 3': 1, 'PlayStation Vita': 1 }
    });

    /* Detectable OSes (order is important) */
    var os = getOS([
      'Windows Phone ',
      'Android',
      'CentOS',
      'Debian',
      'Fedora',
      'FreeBSD',
      'Gentoo',
      'Haiku',
      'Kubuntu',
      'Linux Mint',
      'Red Hat',
      'SuSE',
      'Ubuntu',
      'Xubuntu',
      'Cygwin',
      'Symbian OS',
      'hpwOS',
      'webOS ',
      'webOS',
      'Tablet OS',
      'Linux',
      'Mac OS X',
      'Macintosh',
      'Mac',
      'Windows 98;',
      'Windows '
    ]);

    /*------------------------------------------------------------------------*/

    /**
     * Picks the layout engine from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected layout engine.
     */
    function getLayout(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the manufacturer from an array of guesses.
     *
     * @private
     * @param {Array} guesses An object of guesses.
     * @returns {null|string} The detected manufacturer.
     */
    function getManufacturer(guesses) {
      return reduce(guesses, function(result, value, key) {
        // lookup the manufacturer by product or scan the UA for the manufacturer
        return result || (
          value[product] ||
          value[0/*Opera 9.25 fix*/, /^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
        ) && key;
      });
    }

    /**
     * Picks the browser name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected browser name.
     */
    function getName(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the OS name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected OS name.
     */
    function getOS(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
            )) {
          result = cleanupOS(result, pattern, guess.label || guess);
        }
        return result;
      });
    }

    /**
     * Picks the product name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected product name.
     */
    function getProduct(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
            )) {
          // split by forward slash and append product version if needed
          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
            result[0] += ' ' + result[1];
          }
          // correct character case and cleanup
          guess = guess.label || guess;
          result = format(result[0]
            .replace(RegExp(pattern, 'i'), guess)
            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
        }
        return result;
      });
    }

    /**
     * Resolves the version using an array of UA patterns.
     *
     * @private
     * @param {Array} patterns An array of UA patterns.
     * @returns {null|string} The detected version.
     */
    function getVersion(patterns) {
      return reduce(patterns, function(result, pattern) {
        return result || (RegExp(pattern +
          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
      });
    }

    /**
     * Returns `platform.description` when the platform object is coerced to a string.
     *
     * @name toString
     * @memberOf platform
     * @returns {string} Returns `platform.description` if available, else an empty string.
     */
    function toStringPlatform() {
      return this.description || '';
    }

    /*------------------------------------------------------------------------*/

    // convert layout to an array so we can add extra details
    layout && (layout = [layout]);

    // detect product names that contain their manufacturer's name
    if (manufacturer && !product) {
      product = getProduct([manufacturer]);
    }
    // clean up Google TV
    if ((data = /\bGoogle TV\b/.exec(product))) {
      product = data[0];
    }
    // detect simulators
    if (/\bSimulator\b/i.test(ua)) {
      product = (product ? product + ' ' : '') + 'Simulator';
    }
    // detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS
    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
      description.push('running in Turbo/Uncompressed mode');
    }
    // detect iOS
    if (/^iP/.test(product)) {
      name || (name = 'Safari');
      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
        ? ' ' + data[1].replace(/_/g, '.')
        : '');
    }
    // detect Kubuntu
    else if (name == 'Konqueror' && !/buntu/i.test(os)) {
      os = 'Kubuntu';
    }
    // detect Android browsers
    else if (manufacturer && manufacturer != 'Google' &&
        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) {
      name = 'Android Browser';
      os = /\bAndroid\b/.test(os) ? os : 'Android';
    }
    // detect false positives for Firefox/Safari
    else if (!name || (data = !/\bMinefield\b|\(Android;/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
      // escape the `/` for Firefox 1
      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
        // clear name of false positives
        name = null;
      }
      // reassign a generic name
      if ((data = product || manufacturer || os) &&
          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
      }
    }
    // detect Firefox OS
    if ((data = /\((Mobile|Tablet).*?Firefox\b/i.exec(ua)) && data[1]) {
      os = 'Firefox OS';
      if (!product) {
        product = data[1];
      }
    }
    // detect non-Opera versions (order is important)
    if (!version) {
      version = getVersion([
        '(?:Cloud9|CriOS|CrMo|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|Silk(?!/[\\d.]+$))',
        'Version',
        qualify(name),
        '(?:Firefox|Minefield|NetFront)'
      ]);
    }
    // detect stubborn layout engines
    if (layout == 'iCab' && parseFloat(version) > 3) {
      layout = ['WebKit'];
    } else if (
        layout != 'Trident' &&
        (data =
          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && 'WebKit' ||
          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident')
        )
    ) {
      layout = [data];
    }
    // detect NetFront on PlayStation
    else if (/\bPlayStation\b(?! Vita\b)/i.test(name) && layout == 'WebKit') {
      layout = ['NetFront'];
    }
    // detect Windows Phone 7 desktop mode
    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
      name += ' Mobile';
      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
      description.unshift('desktop mode');
    }
    // detect Windows Phone 8+ desktop mode
    else if (/\bWPDesktop\b/i.test(ua)) {
      name = 'IE Mobile';
      os = 'Windows Phone 8+';
      description.unshift('desktop mode');
      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
    }
    // detect IE 11 and above
    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
      if (!/\bWPDesktop\b/i.test(ua)) {
        if (name) {
          description.push('identifying as ' + name + (version ? ' ' + version : ''));
        }
        name = 'IE';
      }
      version = data[1];
    }
    // detect IE Tech Preview
    else if ((name == 'Chrome' || name != 'IE') && (data = /\bEdge\/([\d.]+)/.exec(ua))) {
      name = 'IE';
      version = data[1];
      layout = ['Trident'];
      description.unshift('platform preview');
    }
    // leverage environment features
    if (useFeatures) {
      // detect server-side environments
      // Rhino has a global function while others have a global object
      if (isHostType(context, 'global')) {
        if (java) {
          data = java.lang.System;
          arch = data.getProperty('os.arch');
          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
        }
        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
          os || (os = data[0].os || null);
          try {
            data[1] = context.require('ringo/engine').version;
            version = data[1].join('.');
            name = 'RingoJS';
          } catch(e) {
            if (data[0].global.system == context.system) {
              name = 'Narwhal';
            }
          }
        }
        else if (typeof context.process == 'object' && (data = context.process)) {
          name = 'Node.js';
          arch = data.arch;
          os = data.platform;
          version = /[\d.]+/.exec(data.version)[0];
        }
        else if (rhino) {
          name = 'Rhino';
        }
      }
      // detect Adobe AIR
      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
        name = 'Adobe AIR';
        os = data.flash.system.Capabilities.os;
      }
      // detect PhantomJS
      else if (getClassOf((data = context.phantom)) == phantomClass) {
        name = 'PhantomJS';
        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
      }
      // detect IE compatibility modes
      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
        // we're in compatibility mode when the Trident version + 4 doesn't
        // equal the document mode
        version = [version, doc.documentMode];
        if ((data = +data[1] + 4) != version[1]) {
          description.push('IE ' + version[1] + ' mode');
          layout && (layout[1] = '');
          version[1] = data;
        }
        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
      }
      os = os && format(os);
    }
    // detect prerelease phases
    if (version && (data =
          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
          /\bMinefield\b/i.test(ua) && 'a'
        )) {
      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
      version = version.replace(RegExp(data + '\\+?$'), '') +
        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
    }
    // detect Firefox Mobile
    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
      name = 'Firefox Mobile';
    }
    // obscure Maxthon's unreliable version
    else if (name == 'Maxthon' && version) {
      version = version.replace(/\.[\d.]+/, '.x');
    }
    // detect Silk desktop/accelerated modes
    else if (name == 'Silk') {
      if (!/\bMobi/i.test(ua)) {
        os = 'Android';
        description.unshift('desktop mode');
      }
      if (/Accelerated *= *true/i.test(ua)) {
        description.unshift('accelerated');
      }
    }
    // detect Xbox 360 and Xbox One
    else if (/\bXbox\b/i.test(product)) {
      os = null;
      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
        description.unshift('mobile mode');
      }
    }
    // add mobile postfix
    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
        (os == 'Windows CE' || /Mobi/i.test(ua))) {
      name += ' Mobile';
    }
    // detect IE platform preview
    else if (name == 'IE' && useFeatures && context.external === null) {
      description.unshift('platform preview');
    }
    // detect BlackBerry OS version
    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
          version
        )) {
      data = [data, /BB10/.test(ua)];
      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
      version = null;
    }
    // detect Opera identifying/masking itself as another browser
    // http://www.opera.com/support/kb/view/843/
    else if (this != forOwn && (
          product != 'Wii' && (
            (useFeatures && opera) ||
            (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
            (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
            (name == 'IE' && (
              (os && !/^Win/.test(os) && version > 5.5) ||
              /\bWindows XP\b/.test(os) && version > 8 ||
              version == 8 && !/\bTrident\b/.test(ua)
            ))
          )
        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {

      // when "indentifying", the UA contains both Opera and the other browser's name
      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
      if (reOpera.test(name)) {
        if (/\bIE\b/.test(data) && os == 'Mac OS') {
          os = null;
        }
        data = 'identify' + data;
      }
      // when "masking", the UA contains only the other browser's name
      else {
        data = 'mask' + data;
        if (operaClass) {
          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
        } else {
          name = 'Opera';
        }
        if (/\bIE\b/.test(data)) {
          os = null;
        }
        if (!useFeatures) {
          version = null;
        }
      }
      layout = ['Presto'];
      description.push(data);
    }
    // detect WebKit Nightly and approximate Chrome/Safari versions
    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
      // correct build for numeric comparison
      // (e.g. "532.5" becomes "532.05")
      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
      // nightly builds are postfixed with a `+`
      if (name == 'Safari' && data[1].slice(-1) == '+') {
        name = 'WebKit Nightly';
        prerelease = 'alpha';
        version = data[1].slice(0, -1);
      }
      // clear incorrect browser versions
      else if (version == data[1] ||
          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
        version = null;
      }
      // use the full Chrome version when available
      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
      // detect Blink layout engine
      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && name != 'IE') {
        layout = ['Blink'];
      }
      // detect JavaScriptCore
      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
      if (!useFeatures || (!likeChrome && !data[1])) {
        layout && (layout[1] = 'like Safari');
        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
      } else {
        layout && (layout[1] = 'like Chrome');
        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
      }
      // add the postfix of ".x" or "+" for approximate versions
      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
      // obscure version for some Safari 1-2 releases
      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
        version = data;
      }
    }
    // detect Opera desktop modes
    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
      name += ' ';
      description.unshift('desktop mode');
      if (data == 'zvav') {
        name += 'Mini';
        version = null;
      } else {
        name += 'Mobile';
      }
      os = os.replace(RegExp(' *' + data + '$'), '');
    }
    // detect Chrome desktop mode
    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
      description.unshift('desktop mode');
      name = 'Chrome Mobile';
      version = null;

      if (/\bOS X\b/.test(os)) {
        manufacturer = 'Apple';
        os = 'iOS 4.3+';
      } else {
        os = null;
      }
    }
    // strip incorrect OS versions
    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
        ua.indexOf('/' + data + '-') > -1) {
      os = trim(os.replace(data, ''));
    }
    // add layout engine
    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
        /Browser|Lunascape|Maxthon/.test(name) ||
        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Sleipnir|Web)/.test(name) && layout[1])) {
      // don't add layout details to description if they are falsey
      (data = layout[layout.length - 1]) && description.push(data);
    }
    // combine contextual information
    if (description.length) {
      description = ['(' + description.join('; ') + ')'];
    }
    // append manufacturer
    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
      description.push('on ' + manufacturer);
    }
    // append product
    if (product) {
      description.push((/^on /.test(description[description.length -1]) ? '' : 'on ') + product);
    }
    // parse OS into an object
    if (os) {
      data = / ([\d.+]+)$/.exec(os);
      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
      os = {
        'architecture': 32,
        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
        'version': data ? data[1] : null,
        'toString': function() {
          var version = this.version;
          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
        }
      };
    }
    // add browser/OS architecture
    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
      if (os) {
        os.architecture = 64;
        os.family = os.family.replace(RegExp(' *' + data), '');
      }
      if (
          name && (/\bWOW64\b/i.test(ua) ||
          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
      ) {
        description.unshift('32-bit');
      }
    }

    ua || (ua = null);

    /*------------------------------------------------------------------------*/

    /**
     * The platform object.
     *
     * @name platform
     * @type Object
     */
    var platform = {};

    /**
     * The platform description.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.description = ua;

    /**
     * The name of the browser's layout engine.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.layout = layout && layout[0];

    /**
     * The name of the product's manufacturer.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.manufacturer = manufacturer;

    /**
     * The name of the browser/environment.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.name = name;

    /**
     * The alpha/beta release indicator.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.prerelease = prerelease;

    /**
     * The name of the product hosting the browser.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.product = product;

    /**
     * The browser's user agent string.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.ua = ua;

    /**
     * The browser/environment version.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.version = name && version;

    /**
     * The name of the operating system.
     *
     * @memberOf platform
     * @type Object
     */
    platform.os = os || {

      /**
       * The CPU architecture the OS is built for.
       *
       * @memberOf platform.os
       * @type number|null
       */
      'architecture': null,

      /**
       * The family of the OS.
       *
       * Common values include:
       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
       * "Android", "iOS" and "Windows Phone"
       *
       * @memberOf platform.os
       * @type string|null
       */
      'family': null,

      /**
       * The version of the OS.
       *
       * @memberOf platform.os
       * @type string|null
       */
      'version': null,

      /**
       * Returns the OS string.
       *
       * @memberOf platform.os
       * @returns {string} The OS string.
       */
      'toString': function() { return 'null'; }
    };

    platform.parse = parse;
    platform.toString = toStringPlatform;

    if (platform.version) {
      description.unshift(version);
    }
    if (platform.name) {
      description.unshift(name);
    }
    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
      description.push(product ? '(' + os + ')' : 'on ' + os);
    }
    if (description.length) {
      platform.description = description.join(' ');
    }
    return platform;
  }

  /*--------------------------------------------------------------------------*/

  // export platform
  // some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // define as an anonymous module so, through path mapping, it can be aliased
    define(function() {
      return parse();
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Narwhal, Node.js, Rhino -require, or RingoJS
    forOwn(parse(), function(value, key) {
      freeExports[key] = value;
    });
  }
  // in a browser or Rhino
  else {
    root.platform = parse();
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2]);
