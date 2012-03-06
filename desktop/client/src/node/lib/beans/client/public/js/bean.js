var sardines = (function(){
	
if(!Array.prototype.forEach) Array.prototype.forEach = function(callback) {
	for(var i = 0, n = this.length; i < n; i++) {
		callback(this[i], i);
	}
}

if(!Object.keys) Object.keys = function(obj) {
	var keys = [];
	for(var key in obj) {
		keys.push(key);
	}
	return keys;
}


if(!Date.now) Date.now = function() {
	return new Date().getTime();
}


if(!Array.isArray) Array.isArray = function(target) {
	return target instanceof Array;
}



var _sardines = (function()
{
	var paths = { '':1 }, 
	nodeRequire,
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
		dir = dirname(path),
		modulePaths = dir.split('node_modules');
		
		for(var i = 0, n = modulePaths.length; i < n; i++)
		{
			var cpath = [cpath, modulePaths[i], 'node_modules'].join('/').replace(/\/+/g,'/');
			
			paths[cpath] = 1;
		}
		
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
		var tryPaths = [path, path + '/index.js', path + '.js'];
		
		
		for(var requirePath in paths)
		{
			for(var i = tryPaths.length; i--;)
			{
				var fullPath = normalizePath(requirePath+'/'+tryPaths[i]);
				
				
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

_sardines.register("/node_modules/leche/lib/web/beans/template.core/index.js", function(require, module, exports, __dirname, __filename) {
	exports.plugin = function(router)
{
    var cache = {};
	
	router.on({
		
		/**
		 */

		'pull -public (template or template/:name)': function(request)
		{                         
            var name = request.data.name;

            if(cache[name]) return cache[name];

            var onTemplate = function(content)
            {
                cache[name] = content;

                request.end(content);
            }
            
            var ops = {
                url: name,
                dataType: 'application/html',
                success: function(content)
                {
                     request.inner.template = content;
                    
                    if(!request.next())
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

_sardines.register("/node_modules/leche/lib/web/beans/store.core/store/index.js", function(require, module, exports, __dirname, __filename) {
	/* Copyright (c) 2010-2011 Marcus Westin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

;(function(){
	var store = {},
		win = window,
		doc = win.document,
		localStorageName = 'localStorage',
		globalStorageName = 'globalStorage',
		namespace = '__storejs__',
		storage

	store.disabled = false
	store.set = function(key, value) {}
	store.get = function(key) {}
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, transactionFn) {
		var val = store.get(key)
		if (typeof val == 'undefined') { val = {} }
		transactionFn(val)
		store.set(key, val)
	}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		return JSON.parse(value)
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior 
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	function isGlobalStorageNameSupported() {
		try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]) }
		catch(err) { return false }
	}	

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
		}
		store.get = function(key) { return store.deserialize(storage.getItem(key)) }
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }

	} else if (isGlobalStorageNameSupported()) {
		storage = win[globalStorageName][win.location.hostname]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage[key] = store.serialize(val)
		}
		store.get = function(key) { return store.deserialize(storage[key] && storage[key].value) }
		store.remove = function(key) { delete storage[key] }
		store.clear = function() { for (var key in storage ) { delete storage[key] } }

	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		function withIEStorage(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}
		store.set = withIEStorage(function(storage, key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
		})
		store.get = withIEStorage(function(storage, key) {
			return store.deserialize(storage.getAttribute(key))
		})
		store.remove = withIEStorage(function(storage, key) {
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr = attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
	}

	try {
		store.set(namespace, namespace)
		if (store.get(namespace) != namespace) { store.disabled = true }
		store.remove(namespace)
	} catch(e) {
		store.disabled = true
	}

	if (typeof module != 'undefined') { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { this.store = store }
})()
});

_sardines.register("/node_modules/leche/lib/web/beans/store.core/index.js", function(require, module, exports, __dirname, __filename) {
	
var store = require('./store');

exports.plugin = function(router)
{
	
	var channelsKey = 'stored/channels3';

	var storedChannels = store.get(channelsKey) || {},
	models;

	function getData(channel)
	{
		var d = store.get(channel);


		//model? deserialize it.
		if(d.name && models[d.name])
		{
			var md = new models[d.name]();

			if(md._set) md._set(d.data);

			return md;
		}
		else
		{
			return d.data;
		}
	}


	function listenOnPull(channel)
	{
		try
		{
			router.on(channel, { type: 'pull' }, function()
			{
				return getData(channel);
			});
		}

		//error thrown IF it already exists...
		catch(e)
		{
			
		}
	}




	router.on({
		
		/**
		 */

		
		'push store': function(ops)
		{
			var toStore;

			if(ops.data)
			{

				//is it a model? serialize it.
				if(ops.data._bindings && ops.data.doc)
				{
					toStore = { name: ops.data.name, data: ops.data.doc };
				}
				else
				{
					toStore = { data: ops.data };
				}

				storedChannels[ops.channel] = 1;

				//data exists? listen on pull since it's cached
				listenOnPull(ops.channel);
			}

			//otherwise delete the store channel so we don't listen for it on startup
			else
			{
				delete storedChannels[ops.channel];
			}

			store.set(channelsKey, storedChannels);

			
			//cache the data now.
			store.set(ops.channel, toStore);

			//PUSH the data out now
			router.push(ops.channel, ops.data);
		},

		/**
		 * used for deserializing data
		 */

		'push models': function(m)
		{
			models = m;
		},

		/**
		 */

		'push -one /:app/ready': function()
		{
			console.log("store::ready");
			
			for(var channel in storedChannels)
			{
				listenOnPull(channel);

				router.push(channel, getData(channel));
			}	
			
		}
	});

}
});

_sardines.register("/node_modules/leche/lib/web/beans/history.core/history/history.js", function(require, module, exports, __dirname, __filename) {
	/**
 * History.js Core
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// --------------------------------------------------------------------------
	// Initialise

	// Localise Globals
	var
		console = window.console||undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		amplify = window.amplify||false, // Amplify.js
		setTimeout = window.setTimeout,
		clearTimeout = window.clearTimeout,
		setInterval = window.setInterval,
		clearInterval = window.clearInterval,
		JSON = window.JSON,
		History = window.History = window.History||{}, // Public History Object
		history = window.history; // Old History Object

	// MooTools Compatibility
	JSON.stringify = JSON.stringify||JSON.encode;
	JSON.parse = JSON.parse||JSON.decode;

	// Check Existence
	if ( typeof History.init !== 'undefined' ) {
		throw new Error('History.js Core has already been loaded...');
	}

	// Initialise History
	History.init = function(){
		// Check Load Status of Adapter
		if ( typeof History.Adapter === 'undefined' ) {
			return false;
		}

		// Check Load Status of Core
		if ( typeof History.initCore !== 'undefined' ) {
			History.initCore();
		}

		// Check Load Status of HTML4 Support
		if ( typeof History.initHtml4 !== 'undefined' ) {
			History.initHtml4();
		}

		// Return true
		return true;
	};

	// --------------------------------------------------------------------------
	// Initialise Core

	// Initialise Core
	History.initCore = function(){
		// Initialise
		if ( typeof History.initCore.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initCore.initialized = true;
		}

		// ----------------------------------------------------------------------
		// Options

		/**
		 * History.options
		 * Configurable options
		 */
		History.options = History.options||{};

		/**
		 * History.options.hashChangeInterval
		 * How long should the interval be before hashchange checks
		 */
		History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

		/**
		 * History.options.safariPollInterval
		 * How long should the interval be before safari poll checks
		 */
		History.options.safariPollInterval = History.options.safariPollInterval || 500;

		/**
		 * History.options.doubleCheckInterval
		 * How long should the interval be before we perform a double check
		 */
		History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

		/**
		 * History.options.storeInterval
		 * How long should we wait between store calls
		 */
		History.options.storeInterval = History.options.storeInterval || 1000;

		/**
		 * History.options.busyDelay
		 * How long should we wait between busy events
		 */
		History.options.busyDelay = History.options.busyDelay || 250;

		/**
		 * History.options.debug
		 * If true will enable debug messages to be logged
		 */
		History.options.debug = History.options.debug || false;

		/**
		 * History.options.initialTitle
		 * What is the title of the initial state
		 */
		History.options.initialTitle = History.options.initialTitle || document.title;


		// ----------------------------------------------------------------------
		// Interval record

		/**
		 * History.intervalList
		 * List of intervals set, to be cleared when document is unloaded.
		 */
		History.intervalList = [];

		/**
		 * History.clearAllIntervals
		 * Clears all setInterval instances.
		 */
		History.clearAllIntervals = function(){
			var i, il = History.intervalList;
			if (typeof il !== "undefined" && il !== null) {
				for (i = 0; i < il.length; i++) {
					clearInterval(il[i]);
				}
				History.intervalList = null;
			}
		};
		History.Adapter.bind(window,"beforeunload",History.clearAllIntervals);
		History.Adapter.bind(window,"unload",History.clearAllIntervals);


		// ----------------------------------------------------------------------
		// Debug

		/**
		 * History.debug(message,...)
		 * Logs the passed arguments if debug enabled
		 */
		History.debug = function(){
			if ( (History.options.debug||false) ) {
				History.log.apply(History,arguments);
			}
		};

		/**
		 * History.log(message,...)
		 * Logs the passed arguments
		 */
		History.log = function(){
			// Prepare
			var
				consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
				textarea = document.getElementById('log'),
				message,
				i,n
				;

			// Write to Console
			if ( consoleExists ) {
				var args = Array.prototype.slice.call(arguments);
				message = args.shift();
				if ( typeof console.debug !== 'undefined' ) {
					console.debug.apply(console,[message,args]);
				}
				else {
					console.log.apply(console,[message,args]);
				}
			}
			else {
				message = ("\n"+arguments[0]+"\n");
			}

			// Write to log
			for ( i=1,n=arguments.length; i<n; ++i ) {
				var arg = arguments[i];
				if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
					try {
						arg = JSON.stringify(arg);
					}
					catch ( Exception ) {
						// Recursive Object
					}
				}
				message += "\n"+arg+"\n";
			}

			// Textarea
			if ( textarea ) {
				textarea.value += message+"\n-----\n";
				textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
			}
			// No Textarea, No Console
			else if ( !consoleExists ) {
				alert(message);
			}

			// Return true
			return true;
		};

		// ----------------------------------------------------------------------
		// Emulated Status

		/**
		 * History.getInternetExplorerMajorVersion()
		 * Get's the major version of Internet Explorer
		 * @return {integer}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 * @author James Padolsey <https://gist.github.com/527683>
		 */
		History.getInternetExplorerMajorVersion = function(){
			var result = History.getInternetExplorerMajorVersion.cached =
					(typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
				?	History.getInternetExplorerMajorVersion.cached
				:	(function(){
						var v = 3,
								div = document.createElement('div'),
								all = div.getElementsByTagName('i');
						while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
						return (v > 4) ? v : false;
					})()
				;
			return result;
		};

		/**
		 * History.isInternetExplorer()
		 * Are we using Internet Explorer?
		 * @return {boolean}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 */
		History.isInternetExplorer = function(){
			var result =
				History.isInternetExplorer.cached =
				(typeof History.isInternetExplorer.cached !== 'undefined')
					?	History.isInternetExplorer.cached
					:	Boolean(History.getInternetExplorerMajorVersion())
				;
			return result;
		};

		/**
		 * History.emulated
		 * Which features require emulating?
		 */
		History.emulated = {
			pushState: !Boolean(
				window.history && window.history.pushState && window.history.replaceState
				&& !(
					(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
					|| (/AppleWebKit\/5([0-2]|3[0-3])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
				)
			),
			hashChange: Boolean(
				!(('onhashchange' in window) || ('onhashchange' in document))
				||
				(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
			)
		};


		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = !History.emulated.pushState;

		/**
		 * History.bugs
		 * Which bugs are present
		 */
		History.bugs = {
			/**
			 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
			 * https://bugs.webkit.org/show_bug.cgi?id=56249
			 */
			setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
			 * https://bugs.webkit.org/show_bug.cgi?id=42940
			 */
			safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
			 */
			ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),

			/**
			 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
			 */
			hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
		};

		/**
		 * History.isEmptyObject(obj)
		 * Checks to see if the Object is Empty
		 * @param {Object} obj
		 * @return {boolean}
		 */
		History.isEmptyObject = function(obj) {
			for ( var name in obj ) {
				return false;
			}
			return true;
		};

		/**
		 * History.cloneObject(obj)
		 * Clones a object
		 * @param {Object} obj
		 * @return {Object}
		 */
		History.cloneObject = function(obj) {
			var hash,newObj;
			if ( obj ) {
				hash = JSON.stringify(obj);
				newObj = JSON.parse(hash);
			}
			else {
				newObj = {};
			}
			return newObj;
		};

		// ----------------------------------------------------------------------
		// URL Helpers

		/**
		 * History.getRootUrl()
		 * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
		 * @return {String} rootUrl
		 */
		History.getRootUrl = function(){
			// Create
			var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
			if ( document.location.port||false ) {
				rootUrl += ':'+document.location.port;
			}
			rootUrl += '/';

			// Return
			return rootUrl;
		};

		/**
		 * History.getBaseHref()
		 * Fetches the `href` attribute of the `<base href="...">` element if it exists
		 * @return {String} baseHref
		 */
		History.getBaseHref = function(){
			// Create
			var
				baseElements = document.getElementsByTagName('base'),
				baseElement = null,
				baseHref = '';

			// Test for Base Element
			if ( baseElements.length === 1 ) {
				// Prepare for Base Element
				baseElement = baseElements[0];
				baseHref = baseElement.href.replace(/[^\/]+$/,'');
			}

			// Adjust trailing slash
			baseHref = baseHref.replace(/\/+$/,'');
			if ( baseHref ) baseHref += '/';

			// Return
			return baseHref;
		};

		/**
		 * History.getBaseUrl()
		 * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
		 * @return {String} baseUrl
		 */
		History.getBaseUrl = function(){
			// Create
			var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

			// Return
			return baseUrl;
		};

		/**
		 * History.getPageUrl()
		 * Fetches the URL of the current page
		 * @return {String} pageUrl
		 */
		History.getPageUrl = function(){
			// Fetch
			var
				State = History.getState(false,false),
				stateUrl = (State||{}).url||document.location.href;

			// Create
			var pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/\./).test(part) ? part : part+'/';
			});

			// Return
			return pageUrl;
		};

		/**
		 * History.getBasePageUrl()
		 * Fetches the Url of the directory of the current page
		 * @return {String} basePageUrl
		 */
		History.getBasePageUrl = function(){
			// Create
			var basePageUrl = document.location.href.replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/[^\/]$/).test(part) ? '' : part;
			}).replace(/\/+$/,'')+'/';

			// Return
			return basePageUrl;
		};

		/**
		 * History.getFullUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @param {Boolean} allowBaseHref
		 * @return {string} fullUrl
		 */
		History.getFullUrl = function(url,allowBaseHref){
			// Prepare
			var fullUrl = url, firstChar = url.substring(0,1);
			allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

			// Check
			if ( /[a-z]+\:\/\//.test(url) ) {
				// Full URL
			}
			else if ( firstChar === '/' ) {
				// Root URL
				fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
			}
			else if ( firstChar === '#' ) {
				// Anchor URL
				fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
			}
			else if ( firstChar === '?' ) {
				// Query URL
				fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
			}
			else {
				// Relative URL
				if ( allowBaseHref ) {
					fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
				} else {
					fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
				}
				// We have an if condition above as we do not want hashes
				// which are relative to the baseHref in our URLs
				// as if the baseHref changes, then all our bookmarks
				// would now point to different locations
				// whereas the basePageUrl will always stay the same
			}

			// Return
			return fullUrl.replace(/\#$/,'');
		};

		/**
		 * History.getShortUrl(url)
		 * Ensures that we have a relative URL and not a absolute URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getShortUrl = function(url){
			// Prepare
			var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

			// Trim baseUrl
			if ( History.emulated.pushState ) {
				// We are in a if statement as when pushState is not emulated
				// The actual url these short urls are relative to can change
				// So within the same session, we the url may end up somewhere different
				shortUrl = shortUrl.replace(baseUrl,'');
			}

			// Trim rootUrl
			shortUrl = shortUrl.replace(rootUrl,'/');

			// Ensure we can still detect it as a state
			if ( History.isTraditionalAnchor(shortUrl) ) {
				shortUrl = './'+shortUrl;
			}

			// Clean It
			shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

			// Return
			return shortUrl;
		};

		// ----------------------------------------------------------------------
		// State Storage

		/**
		 * History.store
		 * The store for all session specific data
		 */
		History.store = amplify ? (amplify.store('History.store')||{}) : {};
		History.store.idToState = History.store.idToState||{};
		History.store.urlToId = History.store.urlToId||{};
		History.store.stateToId = History.store.stateToId||{};

		/**
		 * History.idToState
		 * 1-1: State ID to State Object
		 */
		History.idToState = History.idToState||{};

		/**
		 * History.stateToId
		 * 1-1: State String to State ID
		 */
		History.stateToId = History.stateToId||{};

		/**
		 * History.urlToId
		 * 1-1: State URL to State ID
		 */
		History.urlToId = History.urlToId||{};

		/**
		 * History.storedStates
		 * Store the states in an array
		 */
		History.storedStates = History.storedStates||[];

		/**
		 * History.savedStates
		 * Saved the states in an array
		 */
		History.savedStates = History.savedStates||[];

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @param {Boolean} friendly
		 * @param {Boolean} create
		 * @return {Object} State
		 */
		History.getState = function(friendly,create){
			// Prepare
			if ( typeof friendly === 'undefined' ) { friendly = true; }
			if ( typeof create === 'undefined' ) { create = true; }

			// Fetch
			var State = History.getLastSavedState();

			// Create
			if ( !State && create ) {
				State = History.createStateObject();
			}

			// Adjust
			if ( friendly ) {
				State = History.cloneObject(State);
				State.url = State.cleanUrl||State.url;
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByState(State)
		 * Gets a ID for a State
		 * @param {State} newState
		 * @return {String} id
		 */
		History.getIdByState = function(newState){

			// Fetch ID
			var id = History.extractId(newState.url);
			if ( !id ) {
				// Find ID via State String
				var str = History.getStateString(newState);
				if ( typeof History.stateToId[str] !== 'undefined' ) {
					id = History.stateToId[str];
				}
				else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
					id = History.store.stateToId[str];
				}
				else {
					// Generate a new ID
					while ( true ) {
						id = String(Math.floor(Math.random()*1000));
						if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
							break;
						}
					}

					// Apply the new State to the ID
					History.stateToId[str] = id;
					History.idToState[id] = newState;
				}
			}

			// Return ID
			return id;
		};

		/**
		 * History.normalizeState(State)
		 * Expands a State Object
		 * @param {object} State
		 * @return {object}
		 */
		History.normalizeState = function(oldState){
			// Prepare
			if ( !oldState || (typeof oldState !== 'object') ) {
				oldState = {};
			}

			// Check
			if ( typeof oldState.normalized !== 'undefined' ) {
				return oldState;
			}

			// Adjust
			if ( !oldState.data || (typeof oldState.data !== 'object') ) {
				oldState.data = {};
			}

			// ----------------------------------------------------------------------

			// Create
			var newState = {};
			newState.normalized = true;
			newState.title = oldState.title||'';
			newState.url = History.getFullUrl(History.unescapeString(oldState.url||document.location.href));
			newState.hash = History.getShortUrl(newState.url);
			newState.data = History.cloneObject(oldState.data);

			// Fetch ID
			newState.id = History.getIdByState(newState);

			// ----------------------------------------------------------------------

			// Clean the URL
			newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
			newState.url = newState.cleanUrl;

			// Check to see if we have more than just a url
			var dataNotEmpty = !History.isEmptyObject(newState.data);

			// Apply
			if ( newState.title || dataNotEmpty ) {
				// Add ID to Hash
				newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
				if ( !/\?/.test(newState.hash) ) {
					newState.hash += '?';
				}
				newState.hash += '&_suid='+newState.id;
			}

			// Create the Hashed URL
			newState.hashedUrl = History.getFullUrl(newState.hash);

			// ----------------------------------------------------------------------

			// Update the URL if we have a duplicate
			if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
				newState.url = newState.hashedUrl;
			}

			// ----------------------------------------------------------------------

			// Return
			return newState;
		};

		/**
		 * History.createStateObject(data,title,url)
		 * Creates a object based on the data, title and url state params
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {object}
		 */
		History.createStateObject = function(data,title,url){
			// Hashify
			var State = {
				'data': data,
				'title': title,
				'url': url
			};

			// Expand the State
			State = History.normalizeState(State);

			// Return object
			return State;
		};

		/**
		 * History.getStateById(id)
		 * Get a state by it's UID
		 * @param {String} id
		 */
		History.getStateById = function(id){
			// Prepare
			id = String(id);

			// Retrieve
			var State = History.idToState[id] || History.store.idToState[id] || undefined;

			// Return State
			return State;
		};

		/**
		 * Get a State's String
		 * @param {State} passedState
		 */
		History.getStateString = function(passedState){
			// Prepare
			var State = History.normalizeState(passedState);

			// Clean
			var cleanedState = {
				data: State.data,
				title: passedState.title,
				url: passedState.url
			};

			// Fetch
			var str = JSON.stringify(cleanedState);

			// Return
			return str;
		};

		/**
		 * Get a State's ID
		 * @param {State} passedState
		 * @return {String} id
		 */
		History.getStateId = function(passedState){
			// Prepare
			var State = History.normalizeState(passedState);

			// Fetch
			var id = State.id;

			// Return
			return id;
		};

		/**
		 * History.getHashByState(State)
		 * Creates a Hash for the State Object
		 * @param {State} passedState
		 * @return {String} hash
		 */
		History.getHashByState = function(passedState){
			// Prepare
			var hash, State = History.normalizeState(passedState);

			// Fetch
			hash = State.hash;

			// Return
			return hash;
		};

		/**
		 * History.extractId(url_or_hash)
		 * Get a State ID by it's URL or Hash
		 * @param {string} url_or_hash
		 * @return {string} id
		 */
		History.extractId = function ( url_or_hash ) {
			// Prepare
			var id;

			// Extract
			var parts,url;
			parts = /(.*)\&_suid=([0-9]+)$/.exec(url_or_hash);
			url = parts ? (parts[1]||url_or_hash) : url_or_hash;
			id = parts ? String(parts[2]||'') : '';

			// Return
			return id||false;
		};

		/**
		 * History.isTraditionalAnchor
		 * Checks to see if the url is a traditional anchor or not
		 * @param {String} url_or_hash
		 * @return {Boolean}
		 */
		History.isTraditionalAnchor = function(url_or_hash){
			// Check
			var isTraditional = !(/[\/\?\.]/.test(url_or_hash));

			// Return
			return isTraditional;
		};

		/**
		 * History.extractState
		 * Get a State by it's URL or Hash
		 * @param {String} url_or_hash
		 * @return {State|null}
		 */
		History.extractState = function(url_or_hash,create){
			// Prepare
			var State = null;
			create = create||false;

			// Fetch SUID
			var id = History.extractId(url_or_hash);
			if ( id ) {
				State = History.getStateById(id);
			}

			// Fetch SUID returned no State
			if ( !State ) {
				// Fetch URL
				var url = History.getFullUrl(url_or_hash);

				// Check URL
				id = History.getIdByUrl(url)||false;
				if ( id ) {
					State = History.getStateById(id);
				}

				// Create State
				if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
					State = History.createStateObject(null,null,url);
				}
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByUrl()
		 * Get a State ID by a State URL
		 */
		History.getIdByUrl = function(url){
			// Fetch
			var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

			// Return
			return id;
		};

		/**
		 * History.getLastSavedState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastSavedState = function(){
			return History.savedStates[History.savedStates.length-1]||undefined;
		};

		/**
		 * History.getLastStoredState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastStoredState = function(){
			return History.storedStates[History.storedStates.length-1]||undefined;
		};

		/**
		 * History.hasUrlDuplicate
		 * Checks if a Url will have a url conflict
		 * @param {Object} newState
		 * @return {Boolean} hasDuplicate
		 */
		History.hasUrlDuplicate = function(newState) {
			// Prepare
			var hasDuplicate = false;

			// Fetch
			var oldState = History.extractState(newState.url);

			// Check
			hasDuplicate = oldState && oldState.id !== newState.id;

			// Return
			return hasDuplicate;
		};

		/**
		 * History.storeState
		 * Store a State
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		History.storeState = function(newState){
			// Store the State
			History.urlToId[newState.url] = newState.id;

			// Push the State
			History.storedStates.push(History.cloneObject(newState));

			// Return newState
			return newState;
		};

		/**
		 * History.isLastSavedState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @return {boolean} isLast
		 */
		History.isLastSavedState = function(newState){
			// Prepare
			var isLast = false;

			// Check
			if ( History.savedStates.length ) {
				var
					newId = newState.id,
					oldState = History.getLastSavedState(),
					oldId = oldState.id;

				// Check
				isLast = (newId === oldId);
			}

			// Return
			return isLast;
		};

		/**
		 * History.saveState
		 * Push a State
		 * @param {Object} newState
		 * @return {boolean} changed
		 */
		History.saveState = function(newState){
			// Check Hash
			if ( History.isLastSavedState(newState) ) {
				return false;
			}

			// Push the State
			History.savedStates.push(History.cloneObject(newState));

			// Return true
			return true;
		};

		/**
		 * History.getStateByIndex()
		 * Gets a state by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		History.getStateByIndex = function(index){
			// Prepare
			var State = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				State = History.savedStates[History.savedStates.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				State = History.savedStates[History.savedStates.length+index];
			}
			else {
				// Get from the beginning
				State = History.savedStates[index];
			}

			// Return State
			return State;
		};

		// ----------------------------------------------------------------------
		// Hash Helpers

		/**
		 * History.getHash()
		 * Gets the current document hash
		 * @return {string}
		 */
		History.getHash = function(){
			var hash = History.unescapeHash(document.location.hash);
			return hash;
		};

		/**
		 * History.unescapeString()
		 * Unescape a string
		 * @param {String} str
		 * @return {string}
		 */
		History.unescapeString = function(str){
			// Prepare
			var result = str;

			// Unescape hash
			var tmp;
			while ( true ) {
				tmp = window.unescape(result);
				if ( tmp === result ) {
					break;
				}
				result = tmp;
			}

			// Return result
			return result;
		};

		/**
		 * History.unescapeHash()
		 * normalize and Unescape a Hash
		 * @param {String} hash
		 * @return {string}
		 */
		History.unescapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Unescape hash
			result = History.unescapeString(result);

			// Return result
			return result;
		};

		/**
		 * History.normalizeHash()
		 * normalize a hash across browsers
		 * @return {string}
		 */
		History.normalizeHash = function(hash){
			var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

			// Return result
			return result;
		};

		/**
		 * History.setHash(hash)
		 * Sets the document hash
		 * @param {string} hash
		 * @return {History}
		 */
		History.setHash = function(hash,queue){
			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.setHash: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.setHash,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Log
			//History.debug('History.setHash: called',hash);

			// Prepare
			var adjustedHash = History.escapeHash(hash);

			// Make Busy + Continue
			History.busy(true);

			// Check if hash is a state
			var State = History.extractState(hash,true);
			if ( State && !History.emulated.pushState ) {
				// Hash is a state so skip the setHash
				//History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

				// PushState
				History.pushState(State.data,State.title,State.url,false);
			}
			else if ( document.location.hash !== adjustedHash ) {
				// Hash is a proper hash, so apply it

				// Handle browser bugs
				if ( History.bugs.setHash ) {
					// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

					// Fetch the base page
					var pageUrl = History.getPageUrl();

					// Safari hash apply
					History.pushState(null,null,pageUrl+'#'+adjustedHash,false);
				}
				else {
					// Normal hash apply
					document.location.hash = adjustedHash;
				}
			}

			// Chain
			return History;
		};

		/**
		 * History.escape()
		 * normalize and Escape a Hash
		 * @return {string}
		 */
		History.escapeHash = function(hash){
			var result = History.normalizeHash(hash);

			// Escape hash
			result = window.escape(result);

			// IE6 Escape Bug
			if ( !History.bugs.hashEscape ) {
				// Restore common parts
				result = result
					.replace(/\%21/g,'!')
					.replace(/\%26/g,'&')
					.replace(/\%3D/g,'=')
					.replace(/\%3F/g,'?');
			}

			// Return result
			return result;
		};

		/**
		 * History.getHashByUrl(url)
		 * Extracts the Hash from a URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getHashByUrl = function(url){
			// Extract the hash
			var hash = String(url)
				.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
				;

			// Unescape hash
			hash = History.unescapeHash(hash);

			// Return hash
			return hash;
		};

		/**
		 * History.setTitle(title)
		 * Applies the title to the document
		 * @param {State} newState
		 * @return {Boolean}
		 */
		History.setTitle = function(newState){
			// Prepare
			var title = newState.title;

			// Initial
			if ( !title ) {
				var firstState = History.getStateByIndex(0);
				if ( firstState && firstState.url === newState.url ) {
					title = firstState.title||History.options.initialTitle;
				}
			}

			// Apply
			try {
				document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
			}
			catch ( Exception ) { }
			document.title = title;

			// Chain
			return History;
		};

		// ----------------------------------------------------------------------
		// Queueing

		/**
		 * History.queues
		 * The list of queues to use
		 * First In, First Out
		 */
		History.queues = [];

		/**
		 * History.busy(value)
		 * @param {boolean} value [optional]
		 * @return {boolean} busy
		 */
		History.busy = function(value){
			// Apply
			if ( typeof value !== 'undefined' ) {
				//History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
				History.busy.flag = value;
			}
			// Default
			else if ( typeof History.busy.flag === 'undefined' ) {
				History.busy.flag = false;
			}

			// Queue
			if ( !History.busy.flag ) {
				// Execute the next item in the queue
				clearTimeout(History.busy.timeout);
				var fireNext = function(){
					if ( History.busy.flag ) return;
					for ( var i=History.queues.length-1; i >= 0; --i ) {
						var queue = History.queues[i];
						if ( queue.length === 0 ) continue;
						var item = queue.shift();
						History.fireQueueItem(item);
						History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
					}
				};
				History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
			}

			// Return
			return History.busy.flag;
		};

		/**
		 * History.fireQueueItem(item)
		 * Fire a Queue Item
		 * @param {Object} item
		 * @return {Mixed} result
		 */
		History.fireQueueItem = function(item){
			return item.callback.apply(item.scope||History,item.args||[]);
		};

		/**
		 * History.pushQueue(callback,args)
		 * Add an item to the queue
		 * @param {Object} item [scope,callback,args,queue]
		 */
		History.pushQueue = function(item){
			// Prepare the queue
			History.queues[item.queue||0] = History.queues[item.queue||0]||[];

			// Add to the queue
			History.queues[item.queue||0].push(item);

			// Chain
			return History;
		};

		/**
		 * History.queue (item,queue), (func,queue), (func), (item)
		 * Either firs the item now if not busy, or adds it to the queue
		 */
		History.queue = function(item,queue){
			// Prepare
			if ( typeof item === 'function' ) {
				item = {
					callback: item
				};
			}
			if ( typeof queue !== 'undefined' ) {
				item.queue = queue;
			}

			// Handle
			if ( History.busy() ) {
				History.pushQueue(item);
			} else {
				History.fireQueueItem(item);
			}

			// Chain
			return History;
		};

		/**
		 * History.clearQueue()
		 * Clears the Queue
		 */
		History.clearQueue = function(){
			History.busy.flag = false;
			History.queues = [];
			return History;
		};


		// ----------------------------------------------------------------------
		// IE Bug Fix

		/**
		 * History.stateChanged
		 * States whether or not the state has changed since the last double check was initialised
		 */
		History.stateChanged = false;

		/**
		 * History.doubleChecker
		 * Contains the timeout used for the double checks
		 */
		History.doubleChecker = false;

		/**
		 * History.doubleCheckComplete()
		 * Complete a double check
		 * @return {History}
		 */
		History.doubleCheckComplete = function(){
			// Update
			History.stateChanged = true;

			// Clear
			History.doubleCheckClear();

			// Chain
			return History;
		};

		/**
		 * History.doubleCheckClear()
		 * Clear a double check
		 * @return {History}
		 */
		History.doubleCheckClear = function(){
			// Clear
			if ( History.doubleChecker ) {
				clearTimeout(History.doubleChecker);
				History.doubleChecker = false;
			}

			// Chain
			return History;
		};

		/**
		 * History.doubleCheck()
		 * Create a double check
		 * @return {History}
		 */
		History.doubleCheck = function(tryAgain){
			// Reset
			History.stateChanged = false;
			History.doubleCheckClear();

			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
			if ( History.bugs.ieDoubleCheck ) {
				// Apply Check
				History.doubleChecker = setTimeout(
					function(){
						History.doubleCheckClear();
						if ( !History.stateChanged ) {
							//History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
							// Re-Attempt
							tryAgain();
						}
						return true;
					},
					History.options.doubleCheckInterval
				);
			}

			// Chain
			return History;
		};

		// ----------------------------------------------------------------------
		// Safari Bug Fix

		/**
		 * History.safariStatePoll()
		 * Poll the current state
		 * @return {History}
		 */
		History.safariStatePoll = function(){
			// Poll the URL

			// Get the Last State which has the new URL
			var
				urlState = History.extractState(document.location.href),
				newState;

			// Check for a difference
			if ( !History.isLastSavedState(urlState) ) {
				newState = urlState;
			}
			else {
				return;
			}

			// Check if we have a state with that url
			// If not create it
			if ( !newState ) {
				//History.debug('History.safariStatePoll: new');
				newState = History.createStateObject();
			}

			// Apply the New State
			//History.debug('History.safariStatePoll: trigger');
			History.Adapter.trigger(window,'popstate');

			// Chain
			return History;
		};

		// ----------------------------------------------------------------------
		// State Aliases

		/**
		 * History.back(queue)
		 * Send the browser history back one item
		 * @param {Integer} queue [optional]
		 */
		History.back = function(queue){
			//History.debug('History.back: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.back: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.back,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.back(false);
			});

			// Go back
			history.go(-1);

			// End back closure
			return true;
		};

		/**
		 * History.forward(queue)
		 * Send the browser history forward one item
		 * @param {Integer} queue [optional]
		 */
		History.forward = function(queue){
			//History.debug('History.forward: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.forward: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.forward,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.forward(false);
			});

			// Go forward
			history.go(1);

			// End forward closure
			return true;
		};

		/**
		 * History.go(index,queue)
		 * Send the browser history back or forward index times
		 * @param {Integer} queue [optional]
		 */
		History.go = function(index,queue){
			//History.debug('History.go: called', arguments);

			// Prepare
			var i;

			// Handle
			if ( index > 0 ) {
				// Forward
				for ( i=1; i<=index; ++i ) {
					History.forward(queue);
				}
			}
			else if ( index < 0 ) {
				// Backward
				for ( i=-1; i>=index; --i ) {
					History.back(queue);
				}
			}
			else {
				throw new Error('History.go: History.go requires a positive or negative integer passed.');
			}

			// Chain
			return History;
		};


		// ----------------------------------------------------------------------
		// Initialise

		/**
		 * Create the initial State
		 */
		History.saveState(History.storeState(History.extractState(document.location.href,true)));

		/**
		 * Bind for Saving Store
		 */
		if ( amplify ) {
			History.onUnload = function(){
				// Prepare
				var
					currentStore = amplify.store('History.store')||{},
					item;

				// Ensure
				currentStore.idToState = currentStore.idToState || {};
				currentStore.urlToId = currentStore.urlToId || {};
				currentStore.stateToId = currentStore.stateToId || {};

				// Sync
				for ( item in History.idToState ) {
					if ( !History.idToState.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.idToState[item] = History.idToState[item];
				}
				for ( item in History.urlToId ) {
					if ( !History.urlToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.urlToId[item] = History.urlToId[item];
				}
				for ( item in History.stateToId ) {
					if ( !History.stateToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.stateToId[item] = History.stateToId[item];
				}

				// Update
				History.store = currentStore;

				// Store
				amplify.store('History.store',currentStore);
			};
			// For Internet Explorer
			History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));
			// For Other Browsers
			History.Adapter.bind(window,'beforeunload',History.onUnload);
			History.Adapter.bind(window,'unload',History.onUnload);
			// Both are enabled for consistency
		}


		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( History.emulated.pushState ) {
			/*
			 * Provide Skeleton for HTML4 Browsers
			 */

			// Prepare
			var emptyFunction = function(){};
			History.pushState = History.pushState||emptyFunction;
			History.replaceState = History.replaceState||emptyFunction;
		}
		else {
			/*
			 * Use native HTML5 History API Implementation
			 */

			/**
			 * History.onPopState(event,extra)
			 * Refresh the Current State
			 */
			History.onPopState = function(event){
				// Reset the double check
				History.doubleCheckComplete();

				// Check for a Hash, and handle apporiatly
				var currentHash	= History.getHash();
				if ( currentHash ) {
					// Expand Hash
					var currentState = History.extractState(currentHash||document.location.href,true);
					if ( currentState ) {
						// We were able to parse it, it must be a State!
						// Let's forward to replaceState
						//History.debug('History.onPopState: state anchor', currentHash, currentState);
						History.replaceState(currentState.data, currentState.title, currentState.url, false);
					}
					else {
						// Traditional Anchor
						//History.debug('History.onPopState: traditional anchor', currentHash);
						History.Adapter.trigger(window,'anchorchange');
						History.busy(false);
					}

					// We don't care for hashes
					History.expectedStateId = false;
					return false;
				}

				// Prepare
				var newState = false;

				// Prepare
				event = event||{};
				if ( typeof event.state === 'undefined' ) {
					// jQuery
					if ( typeof event.originalEvent !== 'undefined' && typeof event.originalEvent.state !== 'undefined' ) {
						event.state = event.originalEvent.state||false;
					}
					// MooTools
					else if ( typeof event.event !== 'undefined' && typeof event.event.state !== 'undefined' ) {
						event.state = event.event.state||false;
					}
				}

				// Ensure
				event.state = (event.state||false);

				// Fetch State
				if ( event.state ) {
					// Vanilla: Back/forward button was used
					newState = History.getStateById(event.state);
				}
				else if ( History.expectedStateId ) {
					// Vanilla: A new state was pushed, and popstate was called manually
					newState = History.getStateById(History.expectedStateId);
				}
				else {
					// Initial State
					newState = History.extractState(document.location.href);
				}

				// The State did not exist in our store
				if ( !newState ) {
					// Regenerate the State
					newState = History.createStateObject(null,null,document.location.href);
				}

				// Clean
				History.expectedStateId = false;

				// Check if we are the same state
				if ( History.isLastSavedState(newState) ) {
					// There has been no change (just the page's hash has finally propagated)
					//History.debug('History.onPopState: no change', newState, History.savedStates);
					History.busy(false);
					return false;
				}

				// Store the State
				History.storeState(newState);
				History.saveState(newState);

				// Force update of the title
				History.setTitle(newState);

				// Fire Our Event
				History.Adapter.trigger(window,'statechange');
				History.busy(false);

				// Return true
				return true;
			};
			History.Adapter.bind(window,'popstate',History.onPopState);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				//History.debug('History.pushState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.pushState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End pushState closure
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url,queue){
				//History.debug('History.replaceState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.replaceState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End replaceState closure
				return true;
			};

			// Be aware, the following is only for native pushState implementations
			// If you are wanting to include something for all browsers
			// Then include it above this if block

			/**
			 * Setup Safari Fix
			 */
			if ( History.bugs.safariPoll ) {
				History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
			}

			/**
			 * Ensure Cross Browser Compatibility
			 */
			if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
				/**
				 * Fix Safari HashChange Issue
				 */

				// Setup Alias
				History.Adapter.bind(window,'hashchange',function(){
					History.Adapter.trigger(window,'popstate');
				});

				// Initialise Alias
				if ( History.getHash() ) {
					History.Adapter.onDomLoad(function(){
						History.Adapter.trigger(window,'hashchange');
					});
				}
			}

		} // !History.emulated.pushState

	}; // History.initCore

	// Try and Initialise History
	History.init();

})(window);

});

_sardines.register("/node_modules/leche/lib/web/beans/history.core/history/history.html4.js", function(require, module, exports, __dirname, __filename) {
	/**
 * History.js HTML4 Support
 * Depends on the HTML5 Support
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// --------------------------------------------------------------------------
	// Initialise

	// Localise Globals
	var
		document = window.document, // Make sure we are using the correct document
		setTimeout = window.setTimeout||setTimeout,
		clearTimeout = window.clearTimeout||clearTimeout,
		setInterval = window.setInterval||setInterval,
		History = window.History = window.History||{}; // Public History Object

	// Check Existence
	if ( typeof History.initHtml4 !== 'undefined' ) {
		throw new Error('History.js HTML4 Support has already been loaded...');
	}

	// --------------------------------------------------------------------------
	// Initialise HTML4 Support

	// Initialise HTML4 Support
	History.initHtml4 = function(){
		// Initialise
		if ( typeof History.initHtml4.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initHtml4.initialized = true;
		}

		// ----------------------------------------------------------------------
		// Properties

		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = true;


		// ----------------------------------------------------------------------
		// Hash Storage

		/**
		 * History.savedHashes
		 * Store the hashes in an array
		 */
		History.savedHashes = [];

		/**
		 * History.isLastHash(newHash)
		 * Checks if the hash is the last hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.isLastHash = function(newHash){
			// Prepare
			var oldHash = History.getHashByIndex();

			// Check
			var isLast = newHash === oldHash;

			// Return isLast
			return isLast;
		};

		/**
		 * History.saveHash(newHash)
		 * Push a Hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.saveHash = function(newHash){
			// Check Hash
			if ( History.isLastHash(newHash) ) {
				return false;
			}

			// Push the Hash
			History.savedHashes.push(newHash);

			// Return true
			return true;
		};

		/**
		 * History.getHashByIndex()
		 * Gets a hash by the index
		 * @param {integer} index
		 * @return {string}
		 */
		History.getHashByIndex = function(index){
			// Prepare
			var hash = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				hash = History.savedHashes[History.savedHashes.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				hash = History.savedHashes[History.savedHashes.length+index];
			}
			else {
				// Get from the beginning
				hash = History.savedHashes[index];
			}

			// Return hash
			return hash;
		};

		// ----------------------------------------------------------------------
		// Discarded States

		/**
		 * History.discardedHashes
		 * A hashed array of discarded hashes
		 */
		History.discardedHashes = {};

		/**
		 * History.discardedStates
		 * A hashed array of discarded states
		 */
		History.discardedStates = {};

		/**
		 * History.discardState(State)
		 * Discards the state by ignoring it through History
		 * @param {object} State
		 * @return {true}
		 */
		History.discardState = function(discardedState,forwardState,backState){
			//History.debug('History.discardState', arguments);
			// Prepare
			var discardedStateHash = History.getHashByState(discardedState);

			// Create Discard Object
			var discardObject = {
				'discardedState': discardedState,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to DiscardedStates
			History.discardedStates[discardedStateHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardHash(hash)
		 * Discards the hash by ignoring it through History
		 * @param {string} hash
		 * @return {true}
		 */
		History.discardHash = function(discardedHash,forwardState,backState){
			//History.debug('History.discardState', arguments);
			// Create Discard Object
			var discardObject = {
				'discardedHash': discardedHash,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to discardedHash
			History.discardedHashes[discardedHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardState(State)
		 * Checks to see if the state is discarded
		 * @param {object} State
		 * @return {bool}
		 */
		History.discardedState = function(State){
			// Prepare
			var StateHash = History.getHashByState(State);

			// Check
			var discarded = History.discardedStates[StateHash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.discardedHash(hash)
		 * Checks to see if the state is discarded
		 * @param {string} State
		 * @return {bool}
		 */
		History.discardedHash = function(hash){
			// Check
			var discarded = History.discardedHashes[hash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.recycleState(State)
		 * Allows a discarded state to be used again
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {true}
		 */
		History.recycleState = function(State){
			//History.debug('History.recycleState', arguments);
			// Prepare
			var StateHash = History.getHashByState(State);

			// Remove from DiscardedStates
			if ( History.discardedState(State) ) {
				delete History.discardedStates[StateHash];
			}

			// Return true
			return true;
		};

		// ----------------------------------------------------------------------
		// HTML4 HashChange Support

		if ( History.emulated.hashChange ) {
			/*
			 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
			 */

			/**
			 * History.hashChangeInit()
			 * Init the HashChange Emulation
			 */
			History.hashChangeInit = function(){
				// Define our Checker Function
				History.checkerFunction = null;

				// Define some variables that will help in our checker function
				var
					lastDocumentHash = '';

				// Handle depending on the browser
				if ( History.isInternetExplorer() ) {
					// IE6 and IE7
					// We need to use an iframe to emulate the back and forward buttons

					// Create iFrame
					var
						iframeId = 'historyjs-iframe',
						iframe = document.createElement('iframe');

					// Adjust iFarme
					iframe.setAttribute('id', iframeId);
					iframe.style.display = 'none';

					// Append iFrame
					document.body.appendChild(iframe);

					// Create initial history entry
					iframe.contentWindow.document.open();
					iframe.contentWindow.document.close();

					// Define some variables that will help in our checker function
					var
						lastIframeHash = '',
						checkerRunning = false;

					// Define the checker function
					History.checkerFunction = function(){
						// Check Running
						if ( checkerRunning ) {
							return false;
						}

						// Update Running
						checkerRunning = true;

						// Fetch
						var
							documentHash = History.getHash()||'',
							iframeHash = History.unescapeHash(iframe.contentWindow.document.location.hash)||'';

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Create a history entry in the iframe
							if ( iframeHash !== documentHash ) {
								//History.debug('hashchange.checker: iframe hash change', 'documentHash (new):', documentHash, 'iframeHash (old):', iframeHash);

								// Equalise
								lastIframeHash = iframeHash = documentHash;

								// Create History Entry
								iframe.contentWindow.document.open();
								iframe.contentWindow.document.close();

								// Update the iframe's hash
								iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
							}

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// The iFrame Hash has changed (back button caused)
						else if ( iframeHash !== lastIframeHash ) {
							//History.debug('hashchange.checker: iframe hash out of sync', 'iframeHash (new):', iframeHash, 'documentHash (old):', documentHash);

							// Equalise
							lastIframeHash = iframeHash;

							// Update the Hash
							History.setHash(iframeHash,false);
						}

						// Reset Running
						checkerRunning = false;

						// Return true
						return true;
					};
				}
				else {
					// We are not IE
					// Firefox 1 or 2, Opera

					// Define the checker function
					History.checkerFunction = function(){
						// Prepare
						var documentHash = History.getHash();

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// Return true
						return true;
					};
				}

				// Apply the checker function
				History.intervalList.push(setInterval(History.checkerFunction, History.options.hashChangeInterval));

				// Done
				return true;
			}; // History.hashChangeInit

			// Bind hashChangeInit
			History.Adapter.onDomLoad(History.hashChangeInit);

		} // History.emulated.hashChange


		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( History.emulated.pushState ) {
			/*
			 * We must emulate the HTML5 State Management by using HTML4 HashChange
			 */

			/**
			 * History.onHashChange(event)
			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
			 */
			History.onHashChange = function(event){
				//History.debug('History.onHashChange', arguments);

				// Prepare
				var
					currentUrl						= ((event && event.newURL) || document.location.href),
					currentHash						= History.getHashByUrl(currentUrl),
					currentState					= null,
					currentStateHash			= null,
					currentStateHashExits	= null;

				// Check if we are the same state
				if ( History.isLastHash(currentHash) ) {
					// There has been no change (just the page's hash has finally propagated)
					//History.debug('History.onHashChange: no change');
					History.busy(false);
					return false;
				}

				// Reset the double check
				History.doubleCheckComplete();

				// Store our location for use in detecting back/forward direction
				History.saveHash(currentHash);

				// Expand Hash
				if ( currentHash && History.isTraditionalAnchor(currentHash) ) {
					//History.debug('History.onHashChange: traditional anchor', currentHash);
					// Traditional Anchor Hash
					History.Adapter.trigger(window,'anchorchange');
					History.busy(false);
					return false;
				}

				// Create State
				currentState = History.extractState(History.getFullUrl(currentHash||document.location.href,false),true);

				// Check if we are the same state
				if ( History.isLastSavedState(currentState) ) {
					//History.debug('History.onHashChange: no change');
					// There has been no change (just the page's hash has finally propagated)
					History.busy(false);
					return false;
				}

				// Create the state Hash
				currentStateHash = History.getHashByState(currentState);

				// Check if we are DiscardedState
				var discardObject = History.discardedState(currentState);
				if ( discardObject ) {
					// Ignore this state as it has been discarded and go back to the state before it
					if ( History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState) ) {
						// We are going backwards
						//History.debug('History.onHashChange: go backwards');
						History.back(false);
					} else {
						// We are going forwards
						//History.debug('History.onHashChange: go forwards');
						History.forward(false);
					}
					return false;
				}

				// Push the new HTML5 State
				//History.debug('History.onHashChange: success hashchange');
				History.pushState(currentState.data,currentState.title,currentState.url,false);

				// End onHashChange closure
				return true;
			};
			History.Adapter.bind(window,'hashchange',History.onHashChange);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				//History.debug('History.pushState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Object
				var
					newState = History.createStateObject(data,title,url),
					newStateHash = History.getHashByState(newState),
					oldState = History.getState(false),
					oldStateHash = History.getHashByState(oldState),
					html4Hash = History.getHash();

				// Store the newState
				History.storeState(newState);
				History.expectedStateId = newState.id;

				// Recycle the State
				History.recycleState(newState);

				// Force update of the title
				History.setTitle(newState);

				// Check if we are the same State
				if ( newStateHash === oldStateHash ) {
					//History.debug('History.pushState: no change', newStateHash);
					History.busy(false);
					return false;
				}

				// Update HTML4 Hash
				if ( newStateHash !== html4Hash && newStateHash !== History.getShortUrl(document.location.href) ) {
					//History.debug('History.pushState: update hash', newStateHash, html4Hash);
					History.setHash(newStateHash,false);
					return false;
				}

				// Update HTML5 State
				History.saveState(newState);

				// Fire HTML5 Event
				//History.debug('History.pushState: trigger popstate');
				History.Adapter.trigger(window,'statechange');
				History.busy(false);

				// End pushState closure
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url,queue){
				//History.debug('History.replaceState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Objects
				var
					newState        = History.createStateObject(data,title,url),
					oldState        = History.getState(false),
					previousState   = History.getStateByIndex(-2);

				// Discard Old State
				History.discardState(oldState,newState,previousState);

				// Alias to PushState
				History.pushState(newState.data,newState.title,newState.url,false);

				// End replaceState closure
				return true;
			};

			/**
			 * Ensure initial state is handled correctly
			 */
			if ( History.getHash() && !History.emulated.hashChange ) {
				History.Adapter.onDomLoad(function(){
					History.Adapter.trigger(window,'hashchange');
				});
			}

		} // History.emulated.pushState

	}; // History.initHtml4

	// Try and Initialise History
	History.init();

})(window);

});

_sardines.register("/node_modules/leche/lib/web/beans/history.core/history/index.js", function(require, module, exports, __dirname, __filename) {
	// require('./history');

// require('./history.html4');



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

_sardines.register("/node_modules/leche/lib/web/beans/history.core/utils/index.js", function(require, module, exports, __dirname, __filename) {
	exports.urlPath = function(url)
{
	return url.indexOf('://') > -1 ? url.split('/').slice(3).join('/') : url;
}
});

_sardines.register("/node_modules/structr", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/structr/lib/index.js")
});

_sardines.register("/node_modules/structr/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = function (target, parent)
{
	if (!parent) parent = Structr.fh({});

	var that = Structr.extend.apply(null, [parent].concat(target))

	for(var prop in that) {
		that.__construct.prototype[prop] = that[prop];
	}

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
		if (!lite && typeof fromValue == 'object' && (!fromValue || fromValue.constructor == Object || fromValue instanceof Array)) 
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

function getWrappedStep(property, index, steps)
{
	return function() {

		var args = arguments;

		
		this.next = function() {
			steps[index + 1].apply(this, args);
		}

		this[property].apply(this, args);

		this.next = undefined;
	}
} 

function getStepper(inner, middleware, last) {

	var steps = [];

	for(var i = 0, n = middleware.length; i < n; i++) {
		steps.push(getWrappedStep(middleware, i, steps));
	}


	steps.push(last);

	return function() {

		steps[0].apply(this, arguments);
	};
}


//check for middleware: some -> value
function wrapAround(target, property) 
{
	
	var fn = target[property];
		
	if(property.indexOf('->') == -1) return { property: property, value: fn };

	var mw = property.split(/\s*->\s*/g),
	accessorParts = mw[0].split(' ');

	mw[0] = accessorParts.pop();
	accessorParts.push(mw[mw.length - 1]);

	mw.pop();


	return { property: accessorParts.join(' '), value: getStepper(target, mw, fn) };
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
		/*var propInfo = wrapAround(to, property),
		property = propInfo.property,
		value = propInfo.value;*/

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

_sardines.register("/node_modules/crema", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/crema/lib/index.js")
});

_sardines.register("/node_modules/crema/lib/index.js", function(require, module, exports, __dirname, __filename) {
	

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

module.exports.stringifyPaths = function(paths) {
	var stringified = [];

	for(var i = 0, n = paths.length; i < n; i++) {

		stringified.push((paths[i].param ? ':' : '') + paths[i].value);

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

_sardines.register("/node_modules/beanpole/lib/core/concrete/parser.js", function(require, module, exports, __dirname, __filename) {
	
var crema = require('crema')
var Structr = require('structr');

/**
 * parses syntactic sugar. 

 Why the hell are you using a parser for something so simple?  Because I wanted to. Yeah, I could have done it in Regexp, but fuck that >.>... This
 Is much more fun.
 */



//follow the pattern below when adding tokens plz.

var Token = {

 	// A-Z
 	WORD: 1, 

 	// -metadata
 	METADATA: 1 << 1,
    
    
 	// =
 	PATH: 1 << 2,


 	// :param
 	PARAM: 1 << 3, 

 	// ->
 	TO: 1 << 4,

 	// for routing
 	BACKSLASH: 1 << 5,

 	// .
 	DOT: 1 << 6, 

 	// * - this is an auto-middleware
 	STAR: 1 << 7,

 	// "or"
 	OR: 1 << 8,

 	// (
 	LP: 1 << 9,

 	// )
 	RP: 1 << 10,

 	// =
 	EQ: 1 << 11,
    

 	//whitespace
 	WHITESPACE: 1 << 12
};


//reserved keywords
var Reversed = {
	or: Token.OR
}


var Tokenizer = function()
{

	//source of the string to tokenize
	var source = '',

	//the position of the parser
	pos = 0,

	//the current token
	currentToken,

	self = this;


	/**
	 * getter / setter for the source
	 */

	this.source = function(value)
	{
		if(value)
		{
			source = value+' '; //padding
			pos = 0;
		}

		return source;
	} 

	/**
	 * next token
	 */

	this.next = function(keepWhite)
	{
		return currentToken = nextToken(keepWhite);
	}

	/**
	 */

	this.peekChars = function(n)
	{
		return source.substr(pos, n);
	}



	/**
	 */

	this.current = function(keepWhite)
	{
		return currentToken || self.next(keepWhite);
	}


	/**
	 */

	this.position = function()
	{
		return pos;
	}

	/**
	 */

	var nextToken = function(keepWhite, ignoreError)
	{
		if(!keepWhite) skipWhite();

		if(eof()) return null;
		
		var c = currentChar(), ccode = c.charCodeAt(0);

		if(isWhite(ccode))
		{

			skipWhite();
			return token(' ',Token.WHITESPACE);
		}

		//a-z0-9
		if(isAlpha(ccode))
		{
			var w = nextPath();

			return token(w, Reversed[w.toLowerCase()] || Token.WORD);
		}
		


		switch(c)
		{

			//for middleware
			case '-':
				if(nextChar() == '>') return token('->', Token.TO, true);
				if(isAlpha(currentCharCode())) return token(nextPath(), Token.METADATA); 

				error();

			//parameters for routes
			case ':':
				if(isAlpha(nextCharCode())) return token(nextPath(), Token.PARAM);

				error();

			case '/': return token('/', Token.BACKSLASH, true);
			case '.': return token('.', Token.DOT, true);
			case '*': return token('*', Token.STAR, true);
			case '(': return token('(', Token.LP, true);
			case ')': return token(')', Token.RP, true);
			case '=': return token('=', Token.EQ, true);
            
            //path part
			default: return token(nextPath(), Token.PATH);
		}

		//eof
		return null;
	}

	var error = function()
	{
		throw new Error('Unexpected character "'+currentChar()+'" at position '+pos+' in "'+source+'"');
	}

	/**
	 */

	var token = function(value, type, skipOne)
	{
		if(skipOne) nextChar();


		return { value: value, type: type };
	}


	/**
	 */

	var nextChar = this.nextChar = function()
	{
		return source[++pos];
	}

	/**
	 */

	var currentChar = this.currentChar = function()
	{
		return source[pos];
	}

	/**
	 */

	var isAlpha = this.isAlpha = function(c)
	{
		return (c > 96 && c < 123) || (c > 64 && c < 91) || isNumber(c) || c == 95;
	}

	/**
	 */

	var isWhite = this.isWhite = function(c)
	{
		return c == 32 || c == 9 || c == 10;
	}

	/**
	 */

	var isNumber = this.isNumber = function(c)
	{
		return c > 47 && c < 58;
	}

	/**
	 */

	var nextCharCode = function()
	{
		return nextChar().charCodeAt(0);
	}
	/**
	 */

	var currentCharCode = function()
	{
		return currentChar().charCodeAt(0);
	}

	/**
	 */

	var rewind = function(steps)
	{
		pos -= (steps || 1);
	}


	/**
	 */

	var skipWhite = function()
	{
		var end = false;

		while(!(end = eof()))
		{
			if(!isWhite(currentCharCode())) break;

			nextChar();
		}
		return !end;
	}


	/**
	 */

	var nextNumber = function()
	{
		var buffer = currentChar();

		while(!eof())
		{
			if(isNumber(nextCharCode()))
			{
				buffer += currentChar();
			}
			else
			{
				break;
			}
		}

		return buffer;
	}
    

	/**
	 */

	var nextPath = function()
	{
		var buffer = currentChar();

		while(!eof())
		{
			if(!isWhite(nextCharCode()) && !currentChar().match(/[\/=()]/g))
			// if(isAlpha(nextCharCode()) || isNumber(currentCharCode()))
			{
				buffer += currentChar();
			}
			else
			{
				break;
			}
		}

		return buffer;
	}


	/**
	 * end of file
	 */

	var eof = function()
	{
		return pos > source.length-2;
	}
}


var ChannelParser = function()
{
	var tokenizer = new Tokenizer(),
		cache = {};
	
	/**
	 * parses a string into a handleable expression
	 */

	this.parse = function(source)
	{
		//cannot handle 'push init :type'
		if(source.indexOf('/') > -1) return parse2(source);

		if(!source) throw new Error('Source is not defined');

		//stuff might have happened to the expression, so we need to clone it. it DEFINITELY changes
		//when pull requests are made...
		if(cache[source]) return Structr.copy(cache[source]);
		
		tokenizer.source(source);

		return Structr.copy(cache[source] = rootExpr());
	}


	var rootExpr = function()
	{
		var expr = tokenizer.current(),
			type,
			meta = {};
		//type is not defined, but that's okay!
		
		if(expr.type == Token.WORD && tokenizer.isWhite(tokenizer.peekChars(1).charCodeAt(0)) && tokenizer.position() < tokenizer.source().length-1)
		{
			type = expr.value;
			tokenizer.next();
		}

		var token, channels = [];

		while(token = tokenizer.current())
		{
			switch(token.type)
			{

				//-metadata=test
				case Token.METADATA:
					meta[token.value] = metadataValue();
				break;

				case Token.BACKSLASH:
				case Token.WORD:
				case Token.STAR:
					channels = channels.concat(channelsExpr());
				break;
				case Token.OR:
					tokenizer.next();
				break;
				default:
					tokenizer.next();
				break;
			}
		}

		return { type: type, meta: meta, channels: channels };
	}

	var metadataValue = function()
	{
		if(tokenizer.currentChar() == '=')
		{
			tokenizer.next();
			var v = tokenizer.next().value;
			tokenizer.next();
			return v;
		}

		tokenizer.next();

		return 1;
	}

	var channelsExpr = function()
	{
		var channels = [],
			to;


		while(hasNext())
		{

			if(currentTypeIs(Token.LP))
			{
				tokenizer.next();
			}
            
            

			if(currentTypeIs(Token.WORD | Token.PARAM | Token.STAR | Token.BACKSLASH))
			{
				channels.push([channelPathsExpr()]);

				while(currentTypeIs(Token.OR))
				{
					tokenizer.next();
					channels[channels.length-1].push(channelPathsExpr());
				}
			}
			else
			{
				break;
			}


			if(currentTypeIs(Token.RP))
			{
				tokenizer.next();
			}

			if(currentTypeIs(Token.TO))
			{
				tokenizer.next();
			}
		}


		var _orChannels = splitChannelExpr(channels.concat(), []),
		channelsThru = [];

		for(var i = _orChannels.length; i--;)
		{
			var chain =  Structr.copy(_orChannels[i]),
			current = channel = chain[chain.length-1];
			
			for(var j = chain.length-1; j--;)
			{
				current = current.thru = chain[j];
			}


			channelsThru.push(channel);
		}

		return channelsThru;
	}

	var splitChannelExpr = function(orChannels, stack)
	{
		if(!orChannels.length) return [stack];

		var current = orChannels.shift();

		if(current.length == 1)
		{
			stack.push(current[0]);

			return splitChannelExpr(orChannels, stack);
		}
		else
		{
			var split = [];

			for(var i = current.length; i--;)
			{
				var stack2 = stack.concat();

				stack2.push(current[i]);

				split = split.concat(splitChannelExpr(orChannels.concat(), stack2));
			}

			return split;
		}

	}

	var channelPathsExpr = function(type)
	{
		var paths = [],
		token,
		isMiddleware = false,
		cont = true;

		while(cont && (token = tokenizer.current()))
		{

			switch(token.type)
			{
				case Token.WORD:
				case Token.PARAM:
				case Token.PATH:
					paths.push({ name: token.value, param: token.type == Token.PARAM });
				break;
				case Token.BACKSLASH:
				break;
				default:
					cont = false; 
				break;
			}

			if(cont) tokenizer.next();
		}

		if(currentTypeIs(Token.STAR))
		{
			isMiddleware = true;
			tokenizer.next();
		}


		return { paths: paths, isMiddleware: isMiddleware };
	}


	var currentToken = function(type, igError)
	{
		return checkToken(tokenizer.current(), type, igError);
	}
	
	var nextToken = function(type, igError, keepWhite)
	{
		return checkToken(tokenizer.next(keepWhite), type, igError);
	}

	var checkToken = function(token, type, igError)
	{	
		if(!token || !(type & token.type))
		{
			if(!igError) throw new Error('Unexpected token "'+(token || {}).value+'" at position '+tokenizer.position()+' in '+tokenizer.source());
			
			return null;
		}

		return token;
	}

	var currentTypeIs = function(type)
	{
		var current = tokenizer.current();

		return current && !!(type & current.type);
	}

	var hasNext = function()
	{
		return !!tokenizer.current();
	}
}

exports.parse = new ChannelParser().parse;


function toOldChannel(channel, thru) {
	
	var paths = [], isMiddleware = false;

	channel.paths.forEach(function(path) {

		if(!path.value.length) return;

		paths.push({ name: path.value, param: path.param });
	})

	if(paths.length && paths[paths.length - 1].name == '*') {
		paths.pop();
		isMiddleware = true;
	}

	var ret = {
		paths: paths, 
		isMiddleware: isMiddleware
	};

	if(thru) ret.thru = toOldChannel(thru.channel, thru.thru);
	return ret;

}

function parse2(str) {

	str = str.replace(/[\(\)]/g,'')

	var channels = [], type, meta;

	crema(str).forEach(function(route) {
		type = route.type;
		meta = route.tags;

		channels.push(toOldChannel(route.channel, route.thru));
	});

	for(var tag in meta) {
		if(meta[tag] == true) {
			meta[tag] = 1;
		}
	}


	return {
		type: type,
		meta: meta,
		channels: channels
	}
}


//console.log(JSON.stringify(exports.parse('pull init :type'), null, 2))
//console.log(JSON.stringify(parse2('pull init :type'), null, 2));






});

_sardines.register("/node_modules/beanpole/lib/core/concrete/utils.js", function(require, module, exports, __dirname, __filename) {
	
/**
 * replaces params of the given expression
 */


exports.replaceParams = function(expr, params)
{

	var path;

	for(var i = expr.channel.paths.length; i--;)
	{
		path = expr.channel.paths[i];

		if(path.param)
		{

			path.param = false;
			path.name = params[path.name];

			//no name? IT MUST EXIST. DELETE!
			if(!path.name) expr.channel.paths.splice(i, 1);
		}
	}

	return expr;
}


exports.channel = function(expr, index)
{
	return { type: expr.type, channel: expr.channels[index], meta: expr.meta || {} };
}


exports.pathToString = function(path, data)
{
	var paths = [];

	if(!data) data = {};

	for(var i = 0, n = path.length; i < n; i++)
	{
		var pt = path[i],
		part;
		
		if(pt.param && data[pt.name])
		{
			part = data[pt.name];
		}
		else
		{
			part = pt.param ? ':' + pt.name : pt.name;
		}

		paths.push(part);	
	}

	return paths.join('/');
}

//old
/*exports.channelToStr = function(channel, omit)
{
	var buffer = [];

	if(!omit) omit = [];

	if(expr.type && !omit.type) buffer.push(expr.type);

	if(!omit.meta)
	for(var key in channel.meta)
	{
		buffer.push('-'+key+'='+expr.meta[key]);
	}

	var current = expr.channel;

	var middleware = [];

	while(current)
	{
		var paths = [];

		for(var i = 0, n = current.paths.length; i < n; i++)
		{
			var path = current.paths[i];
			 
			paths.push((path.param ? ':' : '')+ path.name);
		}

		middleware.unshift(paths.join('/'));

		current = current.thru;
	}

	buffer.push(middleware.join(' -> '));

	return buffer.join(' ');
}*/

exports.passThrusToArray = function(channel)
{
	var cpt = channel.thru,
	thru = [];

	while(cpt)
	{
		thru.push(this._pathToString(cpt.paths));
		cpt = cpt.thru;
	}

	return thru;
}
});

_sardines.register("/node_modules/beanpole/lib/core/middleware/meta/rotate.js", function(require, module, exports, __dirname, __filename) {
	


exports.rotator = function(target, meta)
{

	if(!target) target = {};

	target.meta = [meta];
	target.allowMultiple = true;

	target.getRoute = function(ops)
	{
		var route = ops.route,
			listeners = ops.listeners;
            

		//if rotate is specified, then we need to rotate it (round-robin). There's a catch though...
		//because the above *might* have filtered down to metadata values, we need to only rotate what's left, AND
		//the rotate index must be stuck with the routes rotate metadata.
		//Also, if the router can have multiple, then we cannot do round-robin. FUcKs ShiT Up.
		if(!ops.router._allowMultiple && route && route.meta && route.meta[meta] != undefined && listeners.length)
		{                                                         
			route.meta[meta] = (++route.meta[meta]) % listeners.length;

			//only ONE listener now..
			ops.listeners = [listeners[route.meta[meta]]];
		}
        
	}


	target.setRoute = function(ops)
	{
		
	}
}

exports.rotator(exports, 'rotate');

});

_sardines.register("/node_modules/beanpole/lib/core/middleware/meta/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr');

module.exports = function()
{
	var mw = new exports.Middleware();

	mw.init = function()
	{
		//needs to be useable online = manual
		mw.add(require('./rotate'));
	}

	return mw;
}

exports.Middleware = Structr({

	/**
	 */

	'__construct': function()
	{

		//middleware specific to metadata
		this._toMetadata = {};

		//middleware which handles everything
		this._universal = {};
	},

	/**
	 */

	'add': function(module)
	{
		var self = this;

		if(module.all)
		{
			module.all.forEach(function(type)
			{	
				if(!self._universal[type]) self._universal[type] = [];

				self._universal[type].push(module);
			});
		}

		module.meta.forEach(function(name)
		{
			self._toMetadata[name] = module;	
		});
	},

	/**
	 */

	'getRoute': function(ops)
	{
		//parse metadata TO, and FROM
		var mw = this._getMW(ops.route ? ops.route.meta : {}, 'getRoute').concat(this._getMW(ops.expr.meta));
		
		return this._eachMW(ops, mw, function(cur, ops)
		{
			return cur.getRoute(ops);
		});
	},

	/**
	 */

	'setRoute': function(ops)
	{
		var mw = this._getMW(ops.meta, 'setRoute');

		return this._eachMW(ops, mw, function(cur, ops)
		{
			return cur.setRoute(ops);
		});
	},

	/**
	 */

	'allowMultiple': function(expr)
	{	
		var mw = this._getMW(expr.meta);

		for(var i = mw.length; i--;)
		{	
			if(mw[i].allowMultiple) return true;
		}


		return false;
	},

	/**
	 */

	'_getMW': function(meta, uni)
	{
		var mw = (this._universal[uni] || []).concat();

		for(var name in meta)
		{
			if(meta[name] == undefined) continue;

			var handler = this._toMetadata[name];

			if(handler && mw.indexOf(handler) == -1) mw.push(handler);
		}

		return mw;
	},

	/**
	 */

	'_eachMW': function(ops, mw, each)
	{
		var cops = ops,
		newOps;


		for(var i = mw.length; i--;)
		{
			if(newOps = each(mw[i], cops))
			{
				cops = newOps;
			}
		}

		return cops;
	}

});



});

_sardines.register("/node_modules/beanpole/lib/core/concrete/request.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
Parser = require('./parser'),
utils = require('./utils');


var Request = Structr({
	
	/**
	 */

	'__construct': function(listener, batch)
	{
		//data necessary for the request
		this.data     = batch.data;

		//inner data which is invisible to the request, but contains data which needs to get passed along
		this.inner = batch.inner;

		//the end callback
		this.callback = batch.callback;

		this._used = {};
		this._queue = []; 
		
		//yes, and I know what you're thinking: why the hell are you copying data?
		//Well, we work backwards, and we don't know if parameters might override data passed to the current URI - we need to be prepared for that. SO
		//as we're working our way back up, data will be set, and the original data will be mapped the way it should be for the given URI
		this._add(listener, Structr.copy(this.data, true), batch.paths);

		
		if(batch._next)
		{
			this.add(batch._next);
		}

		this.last = this._queue[0].target;
	},

	/**
	 */

	'init': function()
	{
		return this;
	},

	/**
	 */

	'hasNext': function()
	{
		return !!this._queue.length;
	},

	/**
	 */

	'next': function()
	{
		if(this._queue.length)
		{
			var thru = this._queue.pop(),
			target = thru.target;

			this.current = target;

			if(target.paths)
			{
				var route = this.origin.getRoute({ channel: target });

				this._addListeners(route.listeners, route.data, target.paths);
				return this.next();
			}


			//heavier...
			/*var route = this.expandRoute(this._queue.length-1);

			if(!route) return this.next();

			target = route.target,
			thru = route.thru;
			this._queue.pop();*/


			this.current = target;


			if(target.isMiddleware && this._used[target.id]) return this.next();

			//keep tabs of what's used so there's no overlap. this will happen when we get back to the router
			//for middleware specified in path -> to -> route
			this._used[target.id] = thru;
			
			this._prepare(target, thru.data, thru.hasParams, thru.paths);
			

			return true;
		}

		return false;
	},

	/**
	 * expands all the routes (middleware even). See leche for example
	 */
	
	/*'expandThru': function()
	{

		var i = 0;

		while(i < this._queue.length)
		{
			if(this.expandRoute(i))
			{
				i++;
			}
			else
			{
				i = 0;
			}
		}

	},*/

	/**
	 */

	/*'expandRoute': function(index)
	{
		var thru = this._queue[index],
		target = thru.target;

		if(target.paths)
		{
			this._queue.splice(index, 1);
			var route = this.origin.getRoute({ channel: target }), n = this._queue.length;


			this._addListeners(route.listeners, route.data, target.paths);
			
			return false;
		}

		return { target: target, thru: thru };
	},*/

	/**
	 */

	'forward': function(channel, callback)
	{
		return this.origin.dispatch(Parser.parse(channel), this.data, { inner: this.inner, req: this.req }, callback);	
	},

	/**
	 */

	'thru': function(channel, ops)
	{
		var self = this;

		if(ops) Structr.copy(ops, this, true);


		this._queue.push({ target: Parser.parse('-stream ' + channel).channels[0] });

		this.next();

		/*this.origin.dispatch(Parser.parse('-stream' + channel), this.data, Structr.copy({  inner: this.inner, req: this.req, _next: callback }, ops, true), function(request)
		{
			request.pipe(self);	
		})*/	
	},

	/**
	 */
	
	'_addListeners': function(listeners, data, paths)
	{
		if(listeners instanceof Array)
		{
			for(var i = listeners.length; i--;)
			{
				this._add(listeners[i], data, paths);
			}
			return;
		}
	},

	/**
	 * adds middleware to the END of the call stack
	 */
	
	'add': function(callback)
	{
		this._queue.unshift(this._func(callback));
	},

	/**
	 * adds  middleware to the beginning of the call stack
	 */
	
	'unshift': function(callback)
	{
		this._queue.push(this._func(callback));
	},

	/**
	 */

	'_func': function(callback)
	{
		return { target: { callback: callback, meta: { } }, data: {} };
	},

	/**
	 */

	'_add': function(route, data, paths)
	{
		var current = route, _queue = this._queue,
		hasParams = false;

		if(!data) data = {};

		while(current)
		{
			for(var i = paths.length; i--;)
			{
				var opath = paths[i],
				cpath = route.path[i],
				param,
				value;


				if(cpath.param && !opath.param)
				{
					param = cpath.name;
					value = opath.name;
				}
				else
				if(cpath.param && opath.param)
				{
					param = cpath.name;
					value = this.data[opath.name];
				}
				else
				{
					continue;
				}

				hasParams = true;


				this.data[param] = data[param] = value;


				// if(!this.data[param]) this.data[param] = value;
			}

			//make sure not to use the same route twice. this will happen especially with middleware specified as /middleware/*
			_queue.push({ target: current, data: data, hasParams: hasParams, paths: paths });

			current = current.thru;
		}
	},

	/*'getData': function(paths, copyTo) {
		
		if(!copyTo) copyTo = }
		
		for(var i = paths.length; i--;)
		{
			var opath = paths[i],
			cpath = route.path[i],
			param,
			value;


			if(cpath.param && !opath.param)
			{
				param = cpath.name;
				value = opath.name;
			}
			else
			if(cpath.param && opath.param)
			{
				param = cpath.name;
				value = copyTo[opath.name];
			}
			else
			{
				continue;
			}

			hasParams = true;


			copyTo[param] = data[param] = value;


			// if(!this.data[param]) this.data[param] = value;
		}	
	},*/


	/**
	 */

	'_prepare': function(target, data, hasParams, paths)
	{
		//call once, then dispose
		if(target.meta && target.meta.one)
		{
			target.dispose();
		}

		if(hasParams)
		{
			Structr.copy(data, this.data,true);
		}


		if(target.path) this.currentChannel = utils.pathToString(target.path, this.data);

		this._callback(target, data);
	},

	/**
	 */

	'channelPath': function(index)
	{
		return utils.pathToString(this._queue[index].target.path || [], this.data);
	},

	/**
	 */

	'_callback': function(target, data)
	{
		return target.callback.call(this, this);
	}
});

module.exports = Request;
});

_sardines.register("/node_modules/sk/core/sk.js", function(require, module, exports, __dirname, __filename) {
	
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

_sardines.register("/node_modules/sk/core/struct.js", function(require, module, exports, __dirname, __filename) {
	require('./sk');
module.exports = require('structr');
});

_sardines.register("/node_modules/sk/core/garbage.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/beanpole/lib/core/concrete/collection.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
Parser = require('./parser'),
utils = require('./utils'),
Request = require('./request'),
Janitor = require('sk/core/garbage').Janitor;





/**
 * collection for routes
 */

/**
 * IMPORTANT notes regarding this class
 * 1. you can have multiple explicit middleware (/path/*)
*/
 

var Collection = Structr({
	
	/**
	 * Constructor. What else do you think it is?
	 */

	'__construct': function(ops)
	{

		//the options for the router
		this._ops = ops || {};

		//these are the channels parsed into a traversable route
		this._routes = this._newRoute();

		//these get executed whenever there's a new "on"
		this._middleware = this._newRoute();

		//the current route index. increments on every route!
		this._routeIndex = 0;
	},

	/**
	 */

	'has': function(expr)
	{
		var routes = this.routes(expr);

		for(var i = routes.length; i--;)
		{
			if(routes[i].target) return true;
		}

		return false;
	},

	/**
	 */
	
	'route': function(channel)
	{
		return this._route(channel.paths);
	},

	/**
	 */

	'middleware': function(channel) 
	{
		return this._route(channel.paths, this._middleware);
	},

	/**
	 */

	'routes': function(expr)
	{
		var channels = expr.channels,
		routes = [];

		for(var i = channels.length; i--;)
		{
			routes.push(this.route(channels[i]));
		}

		return routes;
	},

	/**
	 * listens to the given expression for any chandage
	 */

	'add': function(expr, callback)
	{
		var janitor = new Janitor();

		for(var i = expr.channels.length; i--;)
		{
			janitor.addDisposable(this._add(expr.channels[i], expr.meta, callback));
		}



		return janitor;
	},

	/**
	 */

	'_add': function(channel, meta, callback)
	{
		var paths = channel.paths,
		isMiddleware = channel.isMiddleware || meta.before,
		middleware = channel.thru,

		//middleware isn't used explicitly. Rather, it's *injected* into the routes which ARE used. Remember that.
		//explicit middleware looks like some/path/*
		currentRoute = this._start(paths, isMiddleware ? this._middleware : this._routes, true);

		//some explicit middleware might already be defined, so we need to get the *one* to pass through. 
		var before = this._before(paths, currentRoute);


		if(middleware) this._endMiddleware(middleware).thru = before;


		//the final callback for the route
		var listener = {
			callback: callback,

			//metadata for the expression
			meta: meta || {},

			//keeps tabs for later use (in request)
			id: 'r'+(this._routeIndex++),

			//this is a queue where the first item is executed first, then on until we reach the last item
			thru: middleware || before,

			isMiddleware: isMiddleware,

			path: paths,

			dispose: function()
			{
				var i = currentRoute.listeners.indexOf(listener);
				if(i > -1) currentRoute.listeners.splice(i, 1);
			}
		};

		currentRoute.meta = Structr.copy(meta, currentRoute.meta);

		//at this point we can inject the listener into the current route IF it's middleware.
		if(isMiddleware) this._injectMiddleware(listener, paths);


		//now that we're in the clear, need to add the listener!
		if(!currentRoute.listeners) currentRoute.listeners = [];


		//now to add it. Please take remember, for MOST CASES, "_listeners" will only have one, especially for http / requests
		currentRoute.listeners.push(listener);



		//the return statement allows for the item to be disposed of
		return listener;
	},

	/**
	 */
	
	'_endMiddleware': function(target)
	{
		var current = target || {};

		while(current.thru)
		{
			current = current.thru;
		}

		return current;
	},

	/**
	 * injects explicit middleware (/path/*) in all the routes which go through its path
	 */

	'_injectMiddleware': function(listener, paths)
	{
		//level is only important for 
		listener.level = paths.length;

		//need to go through *all* routes ~ even middleware, because middleware also have 
		//routes to pass through ~ Inception.
		var afterListeners = this._after(paths, this._routes).concat(this._after(paths, this._middleware));

		//go through ALL items to put before this route, but make sure the item we're replacing isn't higher
		//in the middleware chain, because higher methods will already *have* reference to this pass-thru
		for(var i = afterListeners.length; i--;)
		{
			var currentListener = afterListeners[i];

			var currentMiddleware = currentListener.thru,
			previousMiddleware = currentListener;

			while(currentMiddleware)
			{
				if(currentMiddleware.level != undefined)
				{
					if(currentMiddleware.level < listener.level)
					{
						previousMiddleware.thru = listener;
					}
					break;
				}

				previousMiddleware = currentMiddleware;
				currentMiddleware = currentMiddleware.thru;
			}
			
			if(!currentMiddleware) previousMiddleware.thru = listener;
		}
	},

	/**
	 * reveals routes which must come *before* a middleware
	 * after beats circular references
	 * TODO: following code is __ugly as fuck__.
	 */

	'_before': function(paths, after)
	{
		var current = this._middleware,
		listeners = [];

		for(var i = 0, n = paths.length; i < n; i++)
		{

			//this makes sure we don't get to the end for pass thrus
			if(current.listeners) listeners = current.listeners;

            
			 var path = paths[i],

			 newCurrent = path.param ? current._route._param : current._route[path.name];
                                                  
			 
			 if(current == after || !newCurrent) break;

			 current = newCurrent;
		}


		 // if(current != after)
		 //this is a check against pass thrus to beat circular references. It *also* allows this: hello/* -> hello
		if(current != after && current.listeners) listeners = current.listeners;

		return listeners[0];
	},

	/**
	 * reveals everyhing that comes *after* a route (for pass-thru's)
	 */

	'_after': function(paths, routes)
	{
		return this._flatten(this._start(paths, routes));
	},

	/**
	 * returns the starting point of a route
	 */

	'_route': function(paths, routes, create, retControl)
	{
        var control = (routes || this._routes),
		current = control._route;

		for(var i = 0, n = paths.length; i < n; i++)
		{
			var path = paths[i],
			name = path.param ? '_param' : path.name;

			if(!current[name] && create)
			{
				current[name] = this._newRoute(i);
			}

			if(current[name])
			{
				current = current[name];
			}
			else
			{
				current = current._param;
			}


			if(!current) return {};
            
            control = current;
			current = current._route;
		}

		return control;
	},


	/**
	 */

	'_start': function(paths, routes)
	{
		return this._route(paths, routes, true);
	},

	/**
	 */

	'_newRoute': function(level)
	{
		return { _route: { }, _level: level || 0 };
	},

	/**
	 * flattens all routes into a single array
	 */

	'_flatten': function(route)
	{
		var listeners = route.listeners ? route.listeners.concat() : [];

		
		for(var path in route._route)
		{
			listeners = listeners.concat(this._flatten(route[path] || {}));
		}

		return listeners;
	}
});


module.exports = Collection;
});

_sardines.register("/node_modules/beanpole/lib/core/concrete/router.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
Parser = require('./parser'),
utils = require('./utils'),
middleware = require('../middleware/meta'),
Request = require('./request'),
Collection = require('./collection');



/**
 * Glorious. 
 */

var Router = Structr({
	
	/**
	 * Constructor. What else do you think it is?
	 */

	'__construct': function(ops)
	{
		if(!ops) ops = {};

		this.RequestClass = ops.RequestClass || Request;
		this._collection = new Collection(ops);
		this._allowMultiple = !!ops.multi;

	},

	/**
	 * listens to the given expression for any change
	 */

	'on': function(expr, ops, callback)
	{
		if(!callback)
		{
			callback = ops;
			ops = null;
		}

		for(var i = expr.channels.length; i--;)
		{
			var single = utils.channel(expr, i),
			existingRoute = this.getRoute(single);

			if(existingRoute.listeners.length && !this._allowMultiple  && !this._middleware().allowMultiple(single)  && !expr.meta.before && !expr.meta.after)
			{         
				var epath = existingRoute.listeners[0].path;
				                                             
				//use-case: server crashes, and reboots. Needs to override current registered path (which is trash)
				if(existingRoute.listeners[0].meta.overridable)
				{
					existingRoute.listeners[0].dispose();
				}
				else        
				         
				//if both are params, then there's a collission.
				if(single.channel.paths[single.channel.paths.length-1].param == epath[epath.length-1].param)
				{                                            
					throw new Error('Path "'+utils.pathToString(single.channel.paths)+'" already exists');
				}
			};

			this._middleware().setRoute(channel);
		}

		
		return this._collection.add(expr, callback);
	},

	/**
	 */

	'_middleware': function()
	{
		return this.controller.metaMiddleware;
	},

	/**
	 */

	'hasRoute': function(channel, data)
	{
		return !!this.getRoute(channel, data).listeners.length;
	},

	/**
	 */

	'hasRoutes': function(expr, data)
	{
		for(var i = expr.channels.length; i--;)
		{
			if(this.hasRoute(utils.channel(expr, i), data)) return true;
		}

		return false;
	},

	/**
	 */

	'getRoute': function(single, data, middleware)
	{
		var route = this._collection.route(single.channel);

		var r = this._middleware().getRoute({
			expr: single,
			router: this,
			route: route,
			data: data,
			listeners: this._filterRoute(single, route)
		});

		if(middleware && !r.listeners.length) 
		{
			r.listeners = this._filterRoute(single, this._collection.middleware(single.channel));
		}
        
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//this chunk is experimental. Moreso to test its usefulness over anything. The initial
		//thought is enable the ability for routes with *different* metadata to share the same channel. This is great
		//If say, you have web-workers which use the same channels, but different cluster IDs, so a master server knows 
		//what data to send to what web-worker. This COULD be specified in the URI structure, but that feels a bit messy. We'll see if this works first. It's nice and clean. 
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if(!this._middleware().allowMultiple(route) && !this._allowMultiple && r.listeners.length)
        {
            r.listeners = [r.listeners[0]];
        }
        
        return r;
	},

	/**
	 */

	'dispatch': function(expr, data, ops, callback)
	{	
		//only one for now. may change later on.
		for(var i = expr.channels.length; i--;)
		{
			if(this._dispatch(utils.channel(expr, i), data, ops, callback)) return true;		
		}

		return false;
	},

	/**
	 */

	'_dispatch': function(expr, data, ops, callback)
	{
		if(data instanceof Function)
		{
			callback = data;
			data     = undefined;
			ops      = undefined;
		}

		if(ops instanceof Function)
		{
			callback = ops;
			ops     = undefined;
		}

		if(!ops) ops = {};
		if(!data) data = {};

		channel = utils.pathToString(expr.channel.paths);

		var inf = this.getRoute(expr, data, true);        

		//warnings are good incase this shouldn't happen
		if(!inf.listeners.length)
		{	
			if(!ops.ignoreWarning && !expr.meta.passive)
			{
				console.warn('The %s route "%s" does not exist', expr.type, channel);
			}
			
			//some callbacks are passive, meaning the dispatched request is *optional* ~ like a plugin
			if(expr.meta.passive && callback)
			{
				callback(null, 'Route Exists');
			}
			return false;
		}	


		var newOps = {

			//router is set to controller because router() is used in loader. keeps things consistent, and using "this.controller.pull" is vague 
			router: this.controller,

			//where the route lives
			origin: this,

			//data attached, duh. 
			data: inf.data,

			//inner data
			inner: ops.inner || {},

			channel: channel,

			paths: inf.expr.channel.paths,

			//the metadata attached to the expression. Tells all about how it should be handled
			meta: expr.meta,

			//where is the dispatch coming from? Useful for hooks
			from: ops.from || this.controller,

			//the listeners to dispatch
			listeners: inf.listeners,

			//the final callback after everything's done ;)
			callback: callback
		};

		Structr.copy(newOps, ops, true);

		this._callListeners(ops);

		return true;
	},

	/**
	 */

	'_callListeners': function(newOps)
	{
		for(var i = newOps.listeners.length; i--;)
		{
			Structr.copy(newOps, new this.RequestClass(newOps.listeners[i], newOps), true).init().next();
		}
	},

	/**
	 * filters routes based on metadata
	 */

	'_filterRoute': function(expr, route)
	{
		if(!route) return [ ];

		var listeners = (route.listeners || []).concat();
        

		//Useful if there are groups of listeners with the same channel, but should not communicate
		//with each other. E.g: two apps with slaves, sending queues to thyme. Thyme would need to know exactly where the slaves are
		for(var name in expr.meta)
		{
			//the value of the metadata to search
			var value = expr.meta[name];
			
			//make sure that it's not *just* defined. This is important
			//for metadata such as streams
			if(value === 1) continue;
			
			//loop through the listeners and start filtering
			for(var i = listeners.length; i--;)
			{
				var listener = listeners[i];
                
				if(listener.meta.unfilterable) break;
 
				var metaV = listener.meta[name];
				
				//if value == 1, then the tag just needs to exist
				if(metaV != value && metaV != '*')
				{
					listeners.splice(i, 1);
				}
			}
		}

		

		return listeners;
	}
});



module.exports = Router;
});

_sardines.register("/node_modules/sk/core/events.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('./struct');

exports.EventEmitter = {
	'__construct': function ()
	{                      
		this._listeners = {};
	},
	'addListener': function (type, callback)
	{             
		(this._listeners[type] || (this._listeners[type] = [])).push(callback);       
		var self = this;
		
		return {
			dispose: function ()
			{                                
				self.removeListener(type, callback);
			}
		}
	},
	'hasEventListener': function(type, callback)
	{
		return !!this._listeners[type];
	},
	'getNumListeners': function(type, callback)
	{
		return this.getEventListeners(type).length;
	},
	'removeListener': function (type, callback)
	{
		var lists = this._listeners[type],i,
		   self = this;
		if(!lists) return;  
		if((i = lists.indexOf(callback)) > -1)
		{
			lists.splice(i,1);
			
			if(!lists.length)
			{
				delete self._listeners[type];
			}
		}
	},
	'getEventListeners': function(type)
	{
		return this._listeners[type] || [];
	},
	'removeListeners': function (type)
	{
		delete this._listeners[type];
	},
	'removeAllListeners': function()
	{
		this._listeners = {};
	},
	'dispose': function ()
	{
		this._listeners = { };
	},
	'emit': function ()
	{                 
		var args = [],
			type = arguments[0],
			lists;
			
		for(var i = 1, n = arguments.length; i < n; i++)
		{
			args[i-1] = arguments[i];
		}       
		
		
		if(lists = this._listeners[type])  
		for(var i = lists.length; i--;)
		{                       
			lists[i].apply(this, args);
		}     
	}
}

exports.EventEmitter = Structr(exports.EventEmitter);
});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/pushPull/stream.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
EventEmitter = require('sk/core/events').EventEmitter;

/**
 the bridge between the listener, and responder. Yeah, Yeah. the listener
94 */

var proto = {

	/**
	 */

	'_init': function(ttl)
	{
		this._em = new EventEmitter();	

		this.response = {};

		if(ttl)
		{
			this.cache(ttl);
		}
	},

	/**
	 */

	'cache': function(ttl)
	{
		if(this._caching) return;
		this._caching = true;


		//store the buffer incase data comes a little quicker than we can handle it.
		var buffer = this._buffer = [], self = this;

		this.on({
			write: function(chunk)
			{
				buffer.push(chunk)
			}
		});
	},

	/**
	 */

	'on': function(listeners)
	{
		for(var type in listeners)
		{
			this._em.addListener(type, listeners[type]);
		}
	},


	/**
	 */

	'second on': function(type, callback)
	{
		this._em.addListener(type, callback);
	},

	/**
	 */

	'respond': function(data)
	{
		this.responded = true;

		Structr.copy(data, this.response, true);

		return this;
	},

	/**
	 */

	'error': function(data)
	{
		if(!data) return this._error;
		this._error = data;
		this._em.emit('error', data);
		return this;
	},

	/**
	 */
	
	'_sendResponse': function()
	{
		if(!this._sentResponse)
		{
			this._sentResponse = true;

			//WHOOAAHH, what are you doing!? Okay, I know it looks stupid, it is. BUT, consider this scenario:
			//via HTTP, the session object is *saved* to the database once toJSON is called, which is ONLY called when *this* happens.  We do not want
			//the session to save before we're done writing to it, or handling it. 
			this.response = JSON.parse(JSON.stringify(this.response));

			this._em.emit('response', this.response);

			return true;
		}

		return false;
	},

	/**
	 */

	'redirect': function(route)
	{
		this.respond({ redirect: route });
		this.end();
	},

	/**
	 */


	'write': function(data)
	{
		this._sendResponse();

		this._em.emit('write', data);
		
		return this;
	},

	/**
	 */

	'end': function(data)
	{
		//SUPER NOTE: end can be called *once*. After that, all the listeners are disposed of
		if(data) this.write(data);
		
		this._sendResponse();

		this.finished = true;

		this._em.emit('end', data);

		//remove the event listeners to avoid mem leaks
		this._em.dispose();

		return this;
	},

	/**
	 */

	'pipe': function(stream)
	{

		//IF there is a buffer, that means it came faster than we can handle it. This sort of thing
		//occurrs when there are pass-thru routes which hold up the final callback. e.g: authenticating a user against
		//a database
		// if(stream.response) stream.response = this.response;

		if(stream.respond && this.responded) stream.respond(this.response);

		if(this._buffer && this._buffer.length)
		{
			for(var i = 0, n = this._buffer.length; i < n; i++)
			{
				stream.write(this._buffer[i]);
			}	
		}

		//already finished? return
		if(this.finished)
		{
			return stream.end();
		}

		//looks like the bridge is still handling data, so listen for the rest
		this.on({
			write: function(data)
			{
				if(stream.write) stream.write(data);
			},
			end: function()
			{
				if(stream.end) stream.end();
			},
			error: function(e)
			{
				if(stream.error) stream.error(e);
			},
			response: function(data)
			{
				if(stream.respond) stream.respond(data);
			}
		});
	}
};

var Stream = Structr(Structr.copy(proto, {
		
	/**
	 * @param the current request
	 * @param ttl time to keep cached version in memory before dumping it
	 */

	'__construct': function(ttl)
	{
		this._init(ttl);
	}

}));

Stream.proto = proto;


module.exports = Stream;
});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/pushPull/push/router.js", function(require, module, exports, __dirname, __filename) {
	var Router   = require('../../../../concrete/router'),
Stream = require('../stream'),
utils = require('../../../../concrete/utils'),
Structr = require('structr');


var PushRouter = Router.extend({
	
	/**
	 */

	'override on': function(expr, ops, callback)
	{
		if(!callback)
		{
			callback = ops;
			ops = {};
		}

		var ret = this._super(expr, ops, callback);


		if(expr.meta.pull)
		{
			this.controller.pull(expr, Structr.copy(ops.data), { ignoreWarning: true }, callback);
		}
		
		return ret;
	},

	/**
	 */

	'override _callListeners': function(ops)
	{

		//the stream for pushing content. must be cached incase there's latency.
		var stream = new Stream(true),

		//no callback? then data's just being pushed, which is okay
		callback = ops.callback || function(stream)
		{
			return ops.data;
		}

		//of there's a callback, it can return a value which is pushed to the stream
		var ret = callback(stream);

		//IF there's a value, then we're done
		if(ret != undefined)
		{
			stream.end(ret);
		}

		//make the stream visible to all listeners
		ops.stream = stream;

		//SHIBLAM. call the listeners ;)
		this._super.apply(this, arguments);
	}
});

module.exports = PushRouter;

});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/pushPull/request.js", function(require, module, exports, __dirname, __filename) {
	var Request = require('../../../concrete/request'),
Stream = require('./stream'),
Structr = require('structr');

/**
 */

var PushPullRequest = Request.extend(Structr.copy(Stream.proto, {

	/**
	 */

	'init': function()
	{
		this._init();

		return this;
	},

	/**
	 */

	'_listen': function(listener, meta)
	{
		//because the framework needs to be easy to use, streams are turned off by default. This
		//would be a huge pain in the pass if every time they're required, but they're SUPER important
		//if we're trying to stream a large amount of data. What about HTTP? So if it's false, we need to 
		//add a stream handler.
		if(!meta.stream)
		{
			//the buffer for the streams
			var buffer = [], self = this;

			function end(err)
			{
				if(err) return;
				
				//again, it would be a pain in the ass if everytimg we have to do: var value = response[0]. So
				//a "batch" must be specified if we're expecting an array, because 99% of the time for in-app route handling, 
				//only ONE value will be returned. 
				if(meta.batch)
				{
					listener.call(self, buffer, err, self);
				}
				else
				{
					if(!buffer.length)
					{
						listener();
					}
					else
					//so again, by default callback the listener as many times as there are batch values
					for(var i = 0, n = buffer.length; i < n; i++)
					{
						listener.call(self, buffer[i], err, self);
					}
				}
			}

			this.pipe({


				//on write, throw the data into the buffer
				write: function(data)
				{
					buffer.push(data);
				},

				error: end,

				//on end, callback the listener
				end: end
			});
		}

		//is the listener expecting a stream? Okay, then pass on the writer to the listener. Only use this for files, http requests, and the
		//likes plz, omg you're code would look like shit otherwise >.>
		else
		{
			//more flavor picking. Use this, or the passed obj
			listener.call(this, this);
		}
	}
}));



module.exports = PushPullRequest;

});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/pushPull/push/request.js", function(require, module, exports, __dirname, __filename) {
	var Stream  = require('../stream'),
	PushPullRequest = require('../request');


var PushRequest = PushPullRequest.extend({

	/**
	 */

	'override init': function()
	{
		this._super();

		this.cache();
		this.stream.pipe(this);


		return this;
	},

	/**
	 */

	'override _callback': function(route, data)
	{
		this._listen(route.callback, route.meta || {});
	}
});

module.exports = PushRequest;

});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/pushPull/push/index.js", function(require, module, exports, __dirname, __filename) {
	var Router = require('./router'),
PushRequest = require('./request');

exports.types = ['push'];

exports.test = function(expr)
{
	return expr.type == 'push' ? 'push' : null;
}

exports.newRouter = function()
{
	return new Router({ multi: true, RequestClass: PushRequest });
}
});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/pushPull/pull/request.js", function(require, module, exports, __dirname, __filename) {
	var Request = require('../request'),
	Structr = require('structr');


var PullRequest = Request.extend({
	
	/**
	 */

	'override init': function()
	{
		this._super();

		this._listen(this.callback, this.meta);

		return this;
	},

	/**
	 */

	'override _callback': function()
	{
		var ret = this._super.apply(this, arguments);

		if(ret != undefined)
		{
			if(ret == true)
			{                                 
			}

			if(ret.send)
			{
				ret.send(this);
			}
			else
			{
				this.end(ret);
			}
		}
	}
});


module.exports = PullRequest;

});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/pushPull/pull/index.js", function(require, module, exports, __dirname, __filename) {
	var Router = require('../../../../concrete/router'),
Request = require('./request');

exports.types = ['pull','pullMulti'];

exports.test = function(expr)
{
	if(expr.type == 'pullMulti') return 'pullMulti';
	return expr.type == 'pull' ? (expr.meta && expr.meta.multi ? 'pullMulti' : 'pull') : null;
}

exports.newRouter = function(type)
{
	var ops = { RequestClass: Request };

	if(type == 'pullMulti') ops.multi = true;

	return new Router(ops);
}
});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/default/index.js", function(require, module, exports, __dirname, __filename) {
	var Router = require('../../../concrete/router');

exports.types = ['dispatch'];

exports.test = function(expr)
{
	return !expr.type || expr.type == 'dispatch' ? 'dispatch' : null;
}

exports.newRouter = function()
{
	return new Router({multi:true});
}
});

_sardines.register("/node_modules/beanpole/lib/core/middleware/route/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr');


module.exports = function(controller)
{
	var mw = new exports.Middleware(controller);

	mw.init = function()
	{
		//needs to be useable online = manual
		mw.add(require('./pushPull/push'));
		mw.add(require('./pushPull/pull'));
		mw.add(require('./default'));
	}

	return mw;
}

exports.Middleware = Structr({

	/**
	 */

	'__construct': function(controller)
	{
		this._middleware = [];

		this._controller = controller;

		//instantiated routers
		this._routers = {};

		//types of routers
		this.types = [];
	},

	/**
	 */

	'add': function(module)
	{
		this._middleware.push(module);

		this.types = module.types.concat(this.types);

		for(var i = module.types.length; i--;)
		{
			this._controller._createTypeMethod(module.types[i]);
		}
	},

	/**
	 */

	'router': function(expr)
	{
		for(var i = this._middleware.length; i--;)
		{
			//get the factory name. some middleware may return different routers depending on the expression metadata, such as pull -multi
			var mw = this._middleware[i], name = mw.test(expr);

			if(name) return this._router(mw, name);
		}

		return null;
	},

	/**
	 */

	'_router': function(tester, name)
	{
		return this._routers[ name ] || this._newRouter(tester, name);
	},

	/**
	 */

	'_newRouter': function(tester, name)
	{
		var router = tester.newRouter(name);

		router.type = name;
		router.controller = this._controller;

		this._routers[ name ] = router;

		return router;
	}
});


});

_sardines.register("/node_modules/beanpole/lib/core/controller.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
routeMiddleware = require('./middleware/route'),
metaMiddleware = require('./middleware/meta'),
Parser = require('./concrete/parser'),
Janitor = require('sk/core/garbage').Janitor,
utils = require('./concrete/utils');

var AbstractController = Structr({
	
	/**
	 */


	'__construct': function(target)
	{
		this.metaMiddleware = metaMiddleware(this);
		this.routeMiddleware = routeMiddleware(this);

		this.metaMiddleware.init();
		this.routeMiddleware.init();

		this._channels = {};
	},

	/**
	 */

	'has': function(type, ops)
	{
		var expr = this._parse(type, ops);
		return this._router(expr).hasRoutes(expr);
	},

	/**
	 */

	'getRoute': function(type, ops)
	{
		var expr = this._parse(type, ops);
		return this._router(expr).getRoute(utils.channel(expr, 0));
	},

	/**
	 */

	'on': function(target)
	{
		var ja = new Janitor();

		for(var type in target)
		{
			ja.addDisposable(this.on(type, {}, target[type]));
		}

		return ja;
	},

	/**
	 */

	'second on': function(type, callback)
	{
		return this.on(type, {}, callback);
	},

	/**
	 */

	'third on': function(type, ops, callback)
	{
		var expr = this._parse(type, ops),
		router = this.routeMiddleware.router(expr);

		for(var i = expr.channels.length; i--;)
		{
			var pathStr = utils.pathToString(expr.channels[i].paths);

			if(!this._channels[pathStr])
			{
				this.addChannel(pathStr, Structr.copy(utils.channel(expr, i)));
			}
		}
		
		return router.on(expr, ops, callback);
	},

	/**
	 */

	'channels': function()
	{
		return this._channels;
	},

	/**
	 */

	'addChannel': function(path, singleChannel)
	{
		for(var prop in singleChannel.meta)
		{
			singleChannel.meta[prop] = '*';
		}

		this._channels[path] = singleChannel;
	},

	/**
	 * flavor picker for operations. In the string, or in the ops ;)
	 */

	'_parse': function(type, ops)
	{
		var expr = typeof type != 'object' ? Parser.parse(type) : Structr.copy(type);
		
		if(ops)
		{
			if(ops.meta) Structr.copy(ops.meta, expr.meta);
			if(ops.type) expr.type = ops.type;
		}


		return expr;
	},

	/**
	 */

	'_router': function(expr)
	{
		return this.routeMiddleware.router(expr);
	},

	/**
	 */

	'_createTypeMethod': function(method)
	{
		var self = this;

		var func = this[ method ] = function(channel, data, ops, callback)
		{
			if(!ops) ops = {};
			ops.type = method;

			var expr = this._parse(channel, ops);

			return self._router(expr).dispatch(expr, data, ops, callback);
		}


		var router = self._router( { type: method });


		Structr.copy(router, func, true);

	}
});


var ConcreteController = AbstractController.extend({
	
	/**
	 */

	'override __construct': function()
	{
		this._super();

		var self = this;
		
		//make channels data-bindable
		this.on({
			
			/**
			 */

			'pull channels': function()
			{
				return self.channels();
			}
		});
	},

	/**
	 */

	'override addChannel': function(path, singleChannel)
	{
		this._super(path, singleChannel);

		//keep the same format as the channels so the end-point is handled exactly the same
		var toPush = {};

		toPush[path] = singleChannel;

		this.push('channels', toPush, { ignoreWarning: true });
	}
})

module.exports = ConcreteController;
});

_sardines.register("/node_modules/beanpole/lib/core/loader.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
Controller  = require('./controller');

try
{
	require.paths.unshift(__dirname + '/beans');
}catch(e)
{
	//break the web.
}

var Loader = Controller.extend({
	
	/**
	 */


	'override __construct': function()
	{
		this._super();
		
		this._params = {};
	},

	/**
	 */

	'params': function(params)
	{
		if(typeof params == 'string') return this._params[params];
		
		Structr.copy(params || {}, this._params);	
		return this;
	},

	/**
	 */

	'require': function()
	{
		for(var i = arguments.length; i--;)
        {
            this._require(arguments[i]);
        }
        
        return this;
	},
    
    /**
     */
     
    '_require': function(source)
    {
        if(source instanceof Array)
		{
			for(var i = source.length; i--;)
			{
				this._require(source[i]);
			}
		}
		else
		if(typeof src == 'object' && typeof src.bean == 'function')
		{
			source.plugin(this._controller, source.params || this._params[ source.name ] || {});
		}
		else
		{
			return false;
		}
        
        return true;
    }
	
});

module.exports = Loader;

});

_sardines.register("/node_modules/beanpole/lib/core/index.js", function(require, module, exports, __dirname, __filename) {
	var Loader = require('./loader');


//or a new, sandboxed router
exports.router = function()
{
	return new Loader();
}

//singleton to boot
exports.router().copyTo(module.exports, true);

});

_sardines.register("/node_modules/punycode", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/querystring", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/url", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/leche/lib/web/beans/history.core/index.js", function(require, module, exports, __dirname, __filename) {
	require('./history');

var utils = require('./utils'),
beanpole = require('beanpole/lib/core'),
beanpoleUtils = require('beanpole/lib/core/concrete/utils'),
Structr = require('structr'),
Url = require('url');

exports.plugin = function(router)
{
	var httpRouter = beanpole.router(),
	currentChannel,
	pushedReady = false;

	function routeMeta(channel)
	{
		var route = getRoute(channel);
		
		return route.listeners.length ? route.listeners[0].meta : {};
	}

	function getRoute(channel)
	{
		return router.getRoute(channel, { type: 'pull'});
	}

	function getRouteStr(channel)
	{
		return beanpoleUtils.pathToString(getRoute(channel).expr.channel.paths);
	}


	var prevChannel


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

		router.pull(parts.pathname, Structr.copy(parts.query, data, true), { meta: { stream: 1 }, headers: { subdomain: subdomain  } }, function(request)
		{
			request.pipe({
				respond: function(res)
				{
					if(res.redirect)
					{
						router.push('redirect', res.redirect);
					}
				},
				end: function(){}
			})
		})
	}


	window.onpopstate = function(e)
	{

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
			newChannel = getRouteStr(uri);

			data = Structr.copy(urlParts.query, data, true);


			var meta = routeMeta(uri);     
			                                                     


			if(meta['public'] || meta['http'])
			{	
				if(newChannel == currentChannel) return;
				                                
                                                      
				console.log('redirect::' + channel);
				            

				window.history.pushState({ data: data, channel: channel } , null, ('/'+channel).replace(/\/+/g,'/'));     
				
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

		'push -one -public /:app/ready': function()
		{    
			console.log('app ready');

			var meta = routeMeta(window.location.pathname);


			setTimeout(function()
			{      
				//console.log(!meta['static'] && window.location.pathname != '/')                                 
				if(!meta['static'] /*&& window.location.pathname != '/'*/) router.push('redirect', window.location.pathname + window.location.search);

				router.push('history/ready');                            
			}, 1);
		}
	})
}
});

_sardines.register("/node_modules/leche/lib/web/beans/element.core/index.js", function(require, module, exports, __dirname, __filename) {
	

exports.plugin = function(router)
{
	
	
	router.on({
		
		/**
		 * combs an element for anything that needs to be replaced by javascript ~ static page into single page app
		 */

		'push comb/element': function(data)
		{
			var element = data.element;

			if(element == window.document) element = element.body;


			//all the anchor tags need to be listened to, so we can intercept 
			$(element).find('a').each(function(index, anchor)
			{

				//external? don't replace.
				if(anchor.href.indexOf(window.location.host) == -1) return;

				var href = anchor.href;
				// anchor.href = '#';

				//need to remove the host info if it exists
				href = href.indexOf('://') > -1 ? href.split('/').slice(3).join('/') : href;

				$(anchor).bind('click', function(event)
				{
					//if a keyboard modifier is selected, such as cmd for new tab, then ignore
					if(event.altKey || event.shiftKey || event.metaKey || event.ctrlKey || !router.has(href, { type: 'pull'})) return;

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

		'push -public history/ready': function()
		{                
			router.push('comb/element', window.document);
		}
	})
}
});

_sardines.register("/node_modules/leche/lib/web/beans/alert.core/message/codebase/message.js", function(require, module, exports, __dirname, __filename) {
	if(!window.dhtmlx)
	window.dhtmlx = {};

(function(){
	var _dhx_msg_cfg = null;
	function callback(config, result){
			var usercall = config.callback;
			modality(false);
			config.box.parentNode.removeChild(config.box);
			_dhx_msg_cfg = box = config.box = null;
			if (usercall)
				usercall(result);
	}
	function modal_key(e){
		if (_dhx_msg_cfg){
			var code = e.which||event.keyCode;
			if (dhtmlx.message.keyboard){
				if (code == 13 || code == 32)
					callback(_dhx_msg_cfg, true);
				if (code == 27)
					callback(_dhx_msg_cfg, false);
			}
			if (e.preventDefault)
				e.preventDefault();
			return !(e.cancelBubble = true);
		}
	};
	if (document.attachEvent)
		document.attachEvent("onkeydown", modal_key);
	else
		document.addEventListener("keydown", modal_key, false);
		
	function modality(mode){
		if(!modality.cover){
			modality.cover = document.createElement("DIV");
			modality.cover.className = "dhx_modal_cover";
			document.body.appendChild(modality.cover);
		}
		var height =  document.body.scrollHeight;
		modality.cover.style.display = mode?"inline-block":"none";
	}

	function button(text, callback){
		return "<div class='dhtmlx_popup_button' "+(callback?"result='true' ":"")+"><div>"+text+"</div></div>";
	}

	function info(text){
		if (!t.area){
			t.area = document.createElement("DIV");
			t.area.className = "dhtmlx_message_area";
			t.area.style[t.position]="5px";
			document.body.appendChild(t.area);
		}

		t.hide(text.id);
		var message = document.createElement("DIV");
		message.innerHTML = "<div>"+text.text+"</div>";
		message.className = "dhtmlx-info dhtmlx-" + text.type;
		message.onclick = function(){
			t.hide(text.id);
			text = null;
		};

		if (t.position == "bottom" && t.area.firstChild)
			t.area.insertBefore(message,t.area.firstChild);
		else
			t.area.appendChild(message);
		
		if (text.expire > 0)
			t.timers[text.id]=window.setTimeout(function(){
				t.hide(text.id);
			}, text.expire);

		t.pull[text.id] = message;
		message = null;

		return text.id;
	}

	function _createBox(config, ok, cancel){
		var box = document.createElement("DIV");
		box.className = " dhtmlx_modal_box dhtmlx-"+config.type;
			
		var inner = '';
		if (config.title)
			inner+='<div class="dhtmlx_popup_title">'+config.title+'</div>';
		inner+='<div class="dhtmlx_popup_text"><span>'+config.text+'</span></div><div  class="dhtmlx_popup_controls">';
		if (ok)
			inner += button(config.ok || "OK", true);
		if (cancel)
			inner += button(config.cancel || "Cancel", false);
		inner += '</div>';
		box.innerHTML = inner;



		box.onclick = function(e){
			e = e ||event;
			var source = e.target || e.srcElement;
			if (!source.className) source = source.parentNode;
			if (source.className == "dhtmlx_popup_button")
				callback(config, source.getAttribute("result") == "true");
		};
		config.box = box;
		_dhx_msg_cfg = config;

		modality(true,box);
		document.body.appendChild(box);
		var x = Math.abs(Math.floor(((window.innerWidth||document.documentElement.offsetWidth) - box.offsetWidth)/2));
		var y = Math.abs(Math.floor(((window.innerHeight||document.documentElement.offsetHeight) - box.offsetHeight)/2));
		box.style.top = y+'px';
		box.style.left = x+'px';
		box.focus();
	}

	function _popupButtonClick(config, param){
		return function(){
			t.hide(config.id);
			if(typeof config.callback == "function")
				config.callback(param);
		};
	}
	function alertPopup(config){
		var box = _createBox(config, true, false);
	}
	function confirmPopup(config){
		var box = _createBox(config, true, true);
	}
	function box_params(text, type, callback){
		if (typeof text != "object"){
			if (typeof type == "function"){
				callback = type;
				type = "";
			}
			text = {text:text, type:type, callback:callback };
		}
		return text;
	}
	function params(text, type, expire, id){
		if (typeof text != "object")
			text = {text:text, type:type, expire:expire, id:id};
		text.id = text.id||t.uid();
		text.expire = text.expire||t.expire;
		return text;
	}
	dhtmlx.alert = function(){
		text = box_params.apply(this, arguments);
		text.type = text.type || "confirm";

		alertPopup(text);
	};
	dhtmlx.confirm = function(){
		text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		confirmPopup(text);
	};
	var t = dhtmlx.message = function(text, type, expire, id){
		text = params.apply(this, arguments);
		text.type = text.type||"info";

		var subtype = text.type.split("-")[0];
		switch (subtype){
			case "alert":
				return alertPopup(text);
			break;
			case "confirm":
				return confirmPopup(text);
			break;
			default:
				return info(text);
			break;
		}
	};

	t.seed = (new Date()).valueOf();
	t.uid = function(){return t.seed++;};
	t.expire = 4000;
	t.keyboard = true;
	t.position = "top";
	t.pull = {};
	t.timers = {};

	t.hideAll = function(){
		for (var key in t.pull)
			t.hide(key);
	};
	t.hide = function(id){
		var obj = t.pull[id];
		if (obj && obj.parentNode){
			window.setTimeout(function(){
				obj.parentNode.removeChild(obj);
				obj = null;
			},2000);
			obj.className+=" hidden";
			
			if(t.timers[id])
				window.clearTimeout(t.timers[id]);
			delete t.pull[id];
		}
	};
})();
});

_sardines.register("/node_modules/leche/lib/web/beans/alert.core/index.js", function(require, module, exports, __dirname, __filename) {
	
require('./message/codebase/message.js');

exports.plugin = function(router)
{

	router.on({
		
		/**
		 */

		'push -public alert/:type OR alert': function(messages)
		{
            if(!(messages instanceof Array)) messages = [messages];
            

            for(var i = messages.length; i--;)
            {
            	var msg = messages[i].message || messages[i];

            	if(!msg) continue;

            	dhtmlx.message({
            		text: msg,
            		// expires: 100,
            		type: 'notification-' + (this.data.type || 'notice')
            	});
            }
		} 
	});
}
});

_sardines.register("/node_modules/leche.spice.io/web/beans/connect.core/index.js", function(require, module, exports, __dirname, __filename) {
	
exports.openWindow = function(url, title, width, height)
{
	window.open(url, title,"width="+width+",height="+height+",left="+(screen.width/2-width/2)+",top="+(screen.height/2-height/2));
}


exports.plugin = function(router)
{

	var profile, host, defaultRedirect;
	
	router.on({
		
		/**
		 */

		'pull models -> (connect/:service or connect/:in/:service)': function(request)
		{
			var serviceName = request.data.service,
			redirect = request.data.redirect || defaultRedirect || window.location.pathname;

			var connectUrl = 'http://' + host + '/connect/'+ serviceName + '?r=' + Math.random() + '&redirect='+ escape('http://'+window.location.host +'/connected/'+Math.random());

			//link up the accounts IF logged in
			if(profile)
			{
				connectUrl += '&accessToken=' + profile.doc.accessToken;
			}
			
            if(request.data['in'])
            {

            	//redirects after connected
                if(redirect) router.push('store', { channel: 'connect/redirect', data: redirect });

                window.location = connectUrl;
            }
            else
            {
                //open the connection window
                exports.openWindow(connectUrl, 'Connect', 800, 600);
            }
            
			var self = this;

			//setup the callback 
			window.authorizedConnect = function(prof)
			{
				window.authorizedConnect = undefined;

				router.push('rawProfile', { profile: prof, redirect: redirect });
			}
		},

		/**
		 */
		
		'push connect/redirect': function(value)
		{
			defaultRedirect = value;
		},

		/**
		 */

 		'push rawProfile': function(data)
 		{
			profile = new router.models.Profile(data.profile);
				
			router.push('store', { channel: 'store/profile', data: profile });

			router.push('redirect', data.redirect || defaultRedirect);
 		},


		/**
		 */

		'push profile': function(prof)
		{
			profile = prof.doc ? prof : null;                 

			if(prof.doc) router.push('set/id', profile.doc.key);
		},

		/**
		 */

		'push host': function(newHost)
		{
			host = newHost;
		}
	});
}
});

_sardines.register("/node_modules/malt/lib/core/models/index.js", function(require, module, exports, __dirname, __filename) {
	
});

_sardines.register("/node_modules/malt/lib/core/schema/index.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt/lib/core/modifiers/modifiers.js", function(require, module, exports, __dirname, __filename) {
	
});

_sardines.register("/node_modules/malt/lib/core/modifiers/setting.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt/lib/core/modifiers/type.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt/lib/core/modifiers/index.js", function(require, module, exports, __dirname, __filename) {
	module.exports = require('./modifiers');

require('./setting');
require('./type');
});

_sardines.register("/node_modules/malt/lib/core/bindable/index.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt/lib/core/models/abstract.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt/lib/core/models/remote.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
AbstractModel = require('./abstract');


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
                                                                

		if(this._loading) return;
		this._loading = true;

		var self = this;
		
		var callSuccess = this._load(method, data, function(response)
		{
			self.loaded = true;

			self._onResponse(response);


			if(self.router && self.pushError)
			{
				if(response.errors)
				{
					self.router.push('alert/error', response.errors);
				}

				if(response.warnings)
				{
					self.router.push('alert/warning', response.warnings);
				} 
			}                     
			
			if(callback) callback(response.errors, response.result);

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
		
		console.log('Malt pull method=%s channel=%s', method, this._channel());             		                                      
            
		return this.router.pull(this._channel(), data, { meta: { method: method }}, onResponse || function(){});
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

_sardines.register("/node_modules/malt/lib/core/models/collection.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/events", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/underscore", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/underscore/underscore.js")
});

_sardines.register("/node_modules/underscore/underscore.js", function(require, module, exports, __dirname, __filename) {
	//     Underscore.js 1.2.2
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
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
  _.VERSION = '1.2.2';

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
    var initial = memo !== void 0;
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
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
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
    iterator = iterator || _.identity;
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

  // Take the difference between one array and another.
  // Only the elements present in just the first array will remain.
  _.difference = function(array, other) {
    return _.filter(array, function(value){ return !_.include(other, value); });
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
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
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
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
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
    if (_.isFunction(a.isEqual)) return a.isEqual(b);
    if (_.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return String(a) == String(b);
      case '[object Number]':
        a = +a;
        b = +b;
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != a ? b != b : (a == 0 ? 1 / a == 1 / b : a == b);
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
      if ("constructor" in a != "constructor" in b || a.constructor != b.constructor) return false;
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
  if (toString.call(arguments) == '[object Arguments]') {
    _.isArguments = function(obj) {
      return toString.call(obj) == '[object Arguments]';
    };
  } else {
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
    return data ? func(data, _) : function(data) { return func(data, _) };
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

_sardines.register("/node_modules/outcome", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/outcome.js/lib/index.js")
});

_sardines.register("/node_modules/outcome.js/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var EventEmitter = require('events').EventEmitter,

//used for dispatching unhandledError messages
globalEmitter = new EventEmitter(),

_ = require('underscore');


var Chain = function(listeners, parent) {

	if(!listeners) listeners = { };

	var doneListeners = [],
	self = function() {

		var args = Array.apply(null, arguments), orgArgs = arguments;

		if(listeners.handle) {
			
			listeners.handle.apply(listeners, args);
		} else {
			//error should always be first args
			err = args.shift();


			//if there is an error, and a result is *not* present, then continue
			if(err && !args[0]) {

				listeners.error(err);

			} else {
				
				listeners.success.apply(null, args);
			}
		}		

		doneListeners.forEach(function(fn) {
			fn.apply(null, orgArgs);
		});
		
	};

	self.listeners = listeners;

	self.done = function(fn) {

		doneListeners.push(fn);
		return self;

	}
		
	self.copy =  function(childListeners) {

		return Chain(_.extend({}, listeners,  childListeners || {}), self);

	}

	self.handle = function(fn) {

		listeners.handle = 	fn;
		return self;
		
	}


	self.success = function(fn) {
			
		listeners.success = fn || function(){};

		return self;
	}

	self.error = function(fn) {

		listeners.error = fn || function(err) {

			//no error callback? check of unhandled error is present, or throw
			if(!globalEmitter.emit('unhandledError', err)) throw err;

		}
			
		return self;
	};

	self.error(listeners.error);

	return self;
}


module.exports = function(listeners) {
	return Chain(listeners);
}


//ability to listen for unhandledError
module.exports.on = function() {

	globalEmitter.on.apply(globalEmitter, arguments);

}

module.exports.chain = Chain;

var chain = Chain();

Object.keys(chain).forEach(function(prop) {
	
	module.exports[prop] = function() {
		
		var child = Chain();

		return child[prop].apply(child, arguments);
	}
})





});

_sardines.register("/node_modules/vine", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/vine/index.js")
});

_sardines.register("/node_modules/vine/index.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt/lib/core/models/concrete.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt/lib/core/models/item.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/malt", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/malt/lib/index.js")
});

_sardines.register("/node_modules/malt/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var models = require('./core/models'),
Schema = require('./core/schema'),
modifiers = require('./core/modifiers');

models.Item = require('./core/models/item');
models.Collection = require('./core/models/collection');
models.Model = require('./core/models/concrete').Model;

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


	appModels[name] = appModels[AppModel.prototype.name] /*= appModels[Model.prototype.channel]*/ = AppModel;
}



/**
 * initializes the models on the given router. Must already be connected
 */

exports.init = function(router)
{
	var hostModels = {};

	for(var name in models)
	{
		var Model = models[name];

		if(!Model.extend) continue;

		exports._initModel(Model, name, hostModels , router);
	}


	return router.models = hostModels;
}


/**
 * connects malt to a server
 */   

exports.plugin = function(router, params)
{                               
	exports.init(router);          
}

/*exports.connect = function(host, appName, onConnect)
{                              
                                

	if(onConnect) router.on('push -one -public '+appName+'/ready', function()
	{
		onConnect(router);
	})

	router.push('init');

	return router;
}*/


});

_sardines.register("/node_modules/leche.spice.io/shared/beans/spice.io.core/models.js", function(require, module, exports, __dirname, __filename) {
	var malt = require('malt'),
models = malt.models;


models.StreamItem = models.Item.extend({
				
    /**
     */

    //'channel': '/articles',

    /**
     */


    'override __construct': function(ops)
    {
        this._super(ops);
    },


    /**
     */

    'images': function()
    {
        if(this.__images) return this.__images;

        var images = this._filterMeta('image');

        if(images.length)
        {
            // var im =  images[0].regular;
            this.doc.coverImage = images[0].link;
			
            //this.doc.coverImageHeight = Math.floor(im.height * ( 250 / im.width)); 
        }

        return images;
    },

    /**
     */

    'urls': function()
    {
        return this._filterMeta('url');
    },

    /**
     */

    'videos': function()
    {
        return this._filterMeta('video');
    },

    /**
     */

    'show': function()
    {
        console.log("SHOW!");
    },

    /**
     */

    '_filterMeta': function(type)
    {
        if(this['__' + type]) return this['__' + type];

        var filtered = [],
		media = this.doc.media || this.doc.metadata;
		

        if(media)
        for(var i = media.length; i--;)
        {
            var md = media[i];

            if(md.type == type) filtered.unshift(md);
        }

        return this['__' + type] = filtered;
    }
});


/*models.SavedItem = models.StreamItem.extend({
   
    
    'channel': '/saved'
     
});*/



models.Stream = models.Collection.extend({
    
    /**
     */

    'models': {
        'article': 'StreamItem',
        'video': 'StreamItem',	
        'post': 'StreamItem'
    },
                   
    /**
     */

    'override __construct': function(uri)
    {
        this._super({});

        this.channel = uri;
    }
});       
       

models.Recipient = models.Item.extend({
	
});       

models.GroupSchedule = models.Item.extend({
   
   /**
    */

   'override __construct': function(group)
   {
        this._super();
       this._group = group;
       this.channel = '/groups/'+ group.get('_id') + '/subscribers/info';
   },

   /**
    */

   'getCronTime': function(callback)
   {
       var self = this;

       this.load(function() 
       {
        callback(false, self.doc.cron);
       });
   },

   /**
    */

   '_channel': function()
   {
       return this.channel;
   }
    
     
});


models.Group = models.Item.extend({
             
    /**
     */
	
	'channel': '/groups',
 			
	/**
     */

    /*'override __construct': function(subject)
    {
		var tos = typeof subject;
		
        this._super(tos == 'object' ? subject : { });

        this.channel = (tos == 'string' ? tos : '/my' ) + '/groups';
    },*/

    /**
     */

    'children': function()
    {
        return this.collection('groups', this.__construct);
    },

    /**
     */

    'feeds': function()
    {
        return this.collection('feeds', this.model('Feed'));
    },   

	/**
	 */
	
	'subscribers': function()
	{
		return this.collection('subscribers', this.model('Recipient'));
	},

    /**
     */

    'loader': function()
    {
        return this._loader || (this._loader = this.newModel('Stream', '/new/' + this.get('_id')));	
    },   

	/**
	 */
	
	'saved': function()
	{     
		//return this.collection('articles', this.model('Stream'));
		return this._loader || (this._loader = this.newModel('Stream', '/groups/' + this.get('_id') + '/articles'));
	},

    /**
     */

    'edit': function()
    {
        this.router.push('redirect', 'my/scenes/' + this.get('_id') + '/edit');
    },

    /**
     */

    'show': function()
    {
        this.router.push('redirect', 'scenes/' + this.get('publicName'));
    },

    /**
     */

    'schedule': function()
    {
        return this._schedule || (this._schedule = this.newModel('GroupSchedule', this));
    }
});


models.Feed = models.Item.extend({


    'explicit value': {
        get: function()
        {
            return this.doc.data ? this.doc.data.q || this.doc.data.url : null;
        },
        set: function(v)
        {
            if(!this.doc.data) return;

            if(this.doc.data.q) this.doc.data.q = v;
            if(this.doc.data.url) this.doc.data.url = v;
        }
    }
    
});

exports.init = function()
{
    models.Profile = models.Profile.extend({

        /**
         */

        'scenes': function()
        {

            // return new this.models.Collection({ channel: this._channel() + '/' + collectionName, Model: Model, parent: this }))
            return this.collection('/my/groups', this.model('Group'), { type: 'scene' });
        }
    });
}
});

_sardines.register("/node_modules/leche.spice.io/shared/beans/spice.io.core/index.js", function(require, module, exports, __dirname, __filename) {
	var models = require('./models');

exports.plugin = function(router)
{
    router.on({

    	/**
    	 */

        'push init': function()
        {
            models.init();
        },                

        /**
         */

        'pull group/:publicNameOrId': function(request)
        {
        	router.models.Group.findOne({ _id: request.data.publicNameOrId }, function(item)
			{
				request.group = item;

				request.next();
			});
        }

    });
}
});

_sardines.register("/node_modules/fig/lib/core/views/index.js", function(require, module, exports, __dirname, __filename) {
	
});

_sardines.register("/node_modules/fig/lib/core/instructor/index.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/fig/lib/core/viewRenderer.js", function(require, module, exports, __dirname, __filename) {
	exports.display = function(view) {
	
}

exports.combElement = function(view) {
	
}
});

_sardines.register("/node_modules/fig/lib/core/views/abstract.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
ConcreteModel = require('malt/lib/core/models/concrete').Model,
Instructor = require('../instructor'),
viewRenderer = require('../viewRenderer');



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

		Structr.copy(ops, this.ops, true);
		
		this.body = ops.body;
		if(ops.el) this.el = ops.el; 
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

	'abstract ready': function() { },

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

	'send': function(request)
	{
		this._router = request.router;

		request.respond({ mime: 'text/html' });

		//should probably be a static method :/
		if(!request.router.pull('-stream render/view', this, function(writer)
		{
			writer.pipe(request);
		}))
		{
			request.end('render/view does not exist');
		}


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
		//console.log('unbind %s', this.selector);
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


		//set the global router 
		child._router = this._router;

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

_sardines.register("/node_modules/fig/lib/core/views/concrete.js", function(require, module, exports, __dirname, __filename) {
	var View = require('./abstract');

module.exports = View.extend({


	/**
	 * need to override listen so we also comb through the element for any anchor links, and stuff
	 * that needs to be replaces to make the app for of an SPA
	 */

	'override listen': function()
	{
		this._super();
		
		//come through the element
		if(this._router) this._router.push('comb/element', { element: this.el });
	}
})
});

_sardines.register("/node_modules/fig/lib/core/views/model.js", function(require, module, exports, __dirname, __filename) {
	var View = require('./concrete'),
views = require('./index');


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
		return new views[this.view]({ data: item });
	}

});
});

_sardines.register("/node_modules/fig/lib/core/template/parser.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/fig/lib/core/views/template.js", function(require, module, exports, __dirname, __filename) {
	var model = require('./model'),
View = require('./concrete'),
Parser = require('../template/parser');

var TemplateViewPartial = {
	
	/**
	 */

	'override setup': function(ops)
	{
		this._super(ops);

		this.tpl = this.ops.tpl || this.tpl;

		return this;
	},


	/**
	 * the data to use to fill in the template
	 */

	'templateData': function()
	{
		return { };
	},

	/**
	 * render the template
	 */


	'override render': function()
	{

		var self = this, _super = this._super;


		if(!this.templateSource) return;

		var scriptsRegexp = /<script.*?>[\w\W]*?<\/script>/g;

		var scripts = this.templateSource.match(scriptsRegexp) || [],
		placeHolder = '||||script||||';
		
		
		//we need to TEMPORARILY block out templates so they don't get parsed on load
		Parser.parse(this.templateType, this.templateSource.replace(scriptsRegexp, placeHolder), this.templateData(), function(content)
		{
			if(!content) content = self.templateSource;

			while(scripts.length)
			{
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

	'override instructions': function()
	{
		return ['_loadTemplate'].concat(this._super());
	},

	/**
	 * loads in a template, this should happen *once*
	 */

	'_loadTemplate': function(next)
	{

		if(!this._router || !this.tpl || this.loadedTemplate) 
		{
			console.warn('Cannot load template');
			return next();
		}

		this.loadedTemplate = true;

		var self = this;

		function onTemplate(source, type)
		{
			self.templateSource = source;
			self.templateType = type;
			next();
		}

		if(this.tpl.substr(0,1) == '#')
		{
			var el = this.document.getElementById(this.tpl.substr(1));

			//text/x-tmpl-
			if(el)
			{
				onTemplate(el.innerText || el.text || el.textContent, el.getAttribute('type').substr(12));
			}
			else
			{
				console.warn('Template %s does not exist', this.tpl);
			}
		}
		else
		{

			this._router.pull('template', { name: this.tpl }, { meta: { cache: 1 }}, function(content)
			{
				onTemplate(content, self.tpl.split('.').pop());
			});	
		}
	}
}


var ModelTemplatePartial = {
	

	/**
	 */

	'templateData': function()
	{
		return this.data ? this.data().doc : {};
	}
};

exports.Template = View.extend(TemplateViewPartial);
exports.ItemTemplate = model.Item.extend(TemplateViewPartial, ModelTemplatePartial);
exports.CollectionTemplate = model.Collection.extend(TemplateViewPartial, ModelTemplatePartial);

console.log(new exports.ItemTemplate().instructions())
});

_sardines.register("/node_modules/fig/lib/core/template/adapters/mustache/mustache.js", function(require, module, exports, __dirname, __filename) {
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

_sardines.register("/node_modules/fig/lib/core/template/adapters/mustache/index.js", function(require, module, exports, __dirname, __filename) {
	var Mustache = require('./mustache');


exports.parse = function(template, data, callback)
{
	callback(Mustache.to_html(template, data));
}

});

_sardines.register("/node_modules/fig", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/fig/lib/index.js")
});

_sardines.register("/node_modules/fig/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
views = require('./core/views'),
model = require('./core/views/model'),
template = require('./core/views/template'),
concrete = require('./core/views/concrete'),
Parser = require('./core/template/parser'),
MustacheParser = require('./core/template/adapters/mustache');

Parser.add('mu', MustacheParser);
 
 
views.View = concrete;
views.Item = model.Item;
views.Collection = model.Collection;
views.ItemTemplate = template.ItemTemplate;
views.CollectionTemplate = template.CollectionTemplate;
views.Template = template.Template;

exports.views = views;






});

_sardines.register("/node_modules/leche.spice.io/shared/beans/connect.core/index.js", function(require, module, exports, __dirname, __filename) {
	var models = require('malt').models,
fig = require('fig'),
views = fig.views;

var ConnectedView = views.Template;

models.Account = models.Item.extend({

	/**
	 */

	'channel': '/accounts'
});

models.Profile = models.Item.extend({

	/**
	 */

	'channel': '/profile',

	/**
	 */

	'accounts': function()
	{
		return this.collection('/accounts', this.model('Account') );
	},

	/**
	 */

	'generateToken': function(scope, callback)
	{
		this.router.pull('/profile/authorize/' + (scope instanceof Array ? scope.join(',') : scope ), function(response) 
		{
			callback(false, response.result.accessToken);
		});
	},
	
	/**
	 */
	
	'validate': function(callback)
	{
		this.load(callback);
	}
});



exports.plugin = function(router)
{

	var profile;
	
	router.on({
		
		/**
		 */


		'pull session -> validate/login': function(request)
		{
			function fail()
			{
				request.respond({ redirect: '/login' }).end();
			}

			//no profile? executing SSJS (FIXME: holy shit this shouldn't be here. Confusing.)
			if(!profile)
			{
				if(!request.session) return fail();

				var prof = new router.models.Profile({ accessToken: request.session.data.accessToken });

				//load the profile to validate the user's logged in
				prof.load(function()
				{
					//no profile id? user's not logged in, so redirect to the login page.
					if(!prof.doc._id) return fail();

					request.profile = prof;

					//otherwise, continue!
					request.next();
				})
				return;
			}	

			request.profile = profile;

			//no problemo? continue.
			request.next();
		},

		/**
		 */

		'pull -http -mixed session -> home -> connected/:serviceName': function(request)
		{ 
			if(request.req)
			{	
				if(request.session) request.session.data.accessToken = request.data.accessToken;
			}
			else
			{
				router.push('rawProfile', { profile: request.data });


				if(window.opener)
				{

					window.opener.authorizedConnect(request.data);
					window.close();
				}
			}

			return request.view;
		},
        
        
		/**
		 */

		'pull -public -mixed session -> home -> disconnect': function(request)
		{
            if(request.req)
			{	
				delete request.session.data.accessToken;
            }
            else
            {
                var loggedOutProfile = profile;
                profile = null;
                router.push('store', { channel: 'store/profile', data: null });
            }

			
            if(!request.next()) return request.view;
		},


		/**
		 */

		'push -pull store/profile': function(prof)
		{
			profile = prof.doc ? prof : null;
			
			//data that's added on every request
			router.push('hooks/sticky/data', { accessToken: profile ? profile.get('accessToken') : null });
		}
	})
}
});

_sardines.register("/node_modules/leche.core/shared/beans/views.core/viewChain.js", function(require, module, exports, __dirname, __filename) {
	/*
  
psuedocode          


var chain = new ViewChain();                   

chain.next(target, 'home');      

if(!target.view)
{
	target.addView(new View(), 'accounts');
}                                          

chain.next(target, 'accounts');             

if(!target.view)
{
	target.addView(new View(), 'accounts');
}                         

chain.next(target,'info');                             

target.addView(new View())  

                    
target.root.addView(new View());

*/

       

              
var Structr = require('structr');

                 
var ViewChain = module.exports = Structr({    
	
	/**
	 */
	
	'__construct': function(parent, root, name)
	{
		this._parent = parent;          
		this._root = root || this;   
		this.name = name;
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
	
	
	'next': function(request, name)
	{   
		//already view chained? subify.
		if(!this.__nextViewChain || this.__nextViewChain.name != name)
		{                                                   
			// if(this._nextChain) this._nextChain.clearView();    
			// var nextViewChain = this._nextChain = new ViewChain(this, this._root, name);
			this._nextViewChain(this, this._root, name).clearView().apply(request);   
		}    
		
		return this.__nextViewChain;
	},   
	
	/**
	 */
	
	'apply': function(request)
	{
		var self = this;     
		                       
		//sets a view and adds a view to the current view
		request.addView = function(view)
		{                                
			view.name = self.name;
			self.view = view;            
			              
			//parent exists? add the child.
			if(self._parent && self._parent.view) self._parent.view.addChild(view, self.name);
			
			return self;
		}                     
		       
		if(!request.viewChained)
		{                         
			this.applyRoot(request);
		}
	},
	    
	    
	/**
	 */
	
	'clearView': function()
	{
		if(!this.view) return this;              
		this.view.remove();          
		this.view = null;         
		return this;
	},
	      
	
	/**
	 */
	
	'applyRoot': function(request)
	{                           
		var self = this;
		
		request.viewChained = true;     
		
		request.display = function(callback)
		{                               
			if(callback) self._root.view.subscribeOnce('complete', callback);
			         
			self._root.view.send(request);
		}
		
		request.addRootView = function(view)
		{             
			view.name = self.name;
			self.view = view;
			
			self._root.view.addChild(view, self.name);
			
			return self;
		}
	},
	
	/**
	 */
	
	'_nextViewChain': function(name)
	{             
		var chain = this.__nextViewChain || (this.__nextViewChain = new ViewChain(this, this._root, name));  
		chain.name = name;
		return chain;
	}
});
 


});

_sardines.register("/node_modules/leche.core/shared/beans/views.core/index.js", function(require, module, exports, __dirname, __filename) {
	var ViewChain = require('./viewChain');
  
/** 
 * caches the views for front-end applications
 */


exports.plugin = function(router)
{
	
	
    var rootView,
    rootViewPath,  
    rootViewChain,
	rootViewClass,
	serverSide = typeof window == "undefined";

	function getRootViewChain(view) 
	{
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
		
		'push init': function()
		{
			router.on('push -pull root/view', function(viewClass)
			{
				rootViewClass = viewClass;
				rootViewChain = getRootViewChain();
			});	
		},
    
        
		
		/**
		 */
		
        'pull view': function(request)
        {
			var crootViewChain = rootViewChain;
			
			
			if(request.data.root)
			{
				crootViewChain = getRootViewChain(request.data.root);
			}
			else
			{
				if(!rootViewChain) rootViewChain = getRootViewChain();
				
				crootViewChain = rootViewChain;
			}

            
            //get the path name of the view we're about to hit e.g: view -> dashboard
            var viewPath = request.channelPath(request._queue.length - 1);
                             
			
			//if we're running server-side, it's a new view chain each time. However, client-side - we cache. And for every
			//middleware item we pass through, we make sure that we're not replacing views which are already present. Much Faster.
            chain = request.viewChain = (request.viewChain || (serverSide ? getRootViewChain() : crootViewChain)).next(request, viewPath);
                                                                               
			//view exists? This could be something like the home page. Skip it.
			if(chain.view)
			{                             
            	console.log(viewPath + ' is already visible, skipping next.');	
                                 
				//skip the next path
				request._queue.pop();         
			} 
            
            request.next();
        }
    });
}
});

_sardines.register("/node_modules/leche.core/shared/beans/malt.core/index.js", function(require, module, exports, __dirname, __filename) {
	var malt = require('malt');


exports.plugin = function(router)
{
	router.on({
		
		/**
		 */

		'push -public init': function()
		{
			setTimeout(function()
			{
				router.push('models', malt.init(router));
			},1)
		}, 

		/**
		 */

		'pull models': function(request)
		{
			request.models = router.models;

			if(!request.next()) return router.models;
		}
	});
}
});

_sardines.register("/node_modules/client/public-src/web/beans/virt.core/views.js", function(require, module, exports, __dirname, __filename) {
	var fig = require('fig'),
malt = require('malt'),
views = fig.views,
models = malt.models;
                                         

/**
 * the home page
 */

views.VirtView = views.Template.extend({
	

	/**
	 */

	'tpl': '/views/desktop.mu',

	/**
	 */


	'el': '#page-view',


	/**
	 */

	'override __construct': function()
	{
		this._super.apply(this, arguments);

		this.addChild(new views.BrowserSwitcherView( { browser: this.ops.browser }));
	}


});  


views.DesktopView = views.View.extend({
	



	/**
	 */

	'el': '#desktop',



	/**
	 */

	 'render': function() {

	 	swfobject.embedSWF("/player/DesktopPlayer.swf", 
		"desktop", 
		/*"100%", 
		"100%", */
		"1024",
		"768",
		"9.0.0",
		"/player/expressInstall.swf",
		{ server: this.ops.server, debug: true },
		{ allowscriptaccess: 'always', menu: false });

	 },

	 /**
	  */

	 'override listen': function() {
	 	this._super();

		$('#desktop-holder').mousedown(function(e) {
			$(window).trigger('desktopDown', [{ button: e.button }]);

			if(e.button == 2) e.preventDefault()
		});

		$('#desktop-holder').mouseup(function(e) {
			$(window).trigger('desktopUp', [{ button: e.button }]);
		})
	 }
});


views.BrowserSwitcherView = views.View.extend({
	
	/**
	 */

	'el': '#desktop-selector',


	'render': function() {

		this.$("option[value=" + this.ops.browser +"]").attr("selected","selected") ;

		var self = this;

		$(this.el).change(function(ev) {
			self._router.push('remote/test/url', { browser: ev.target.value.toString() });
		});
	}
});

views.QualityView = views.Template.extend({
	
	/**
	 */

	'tpl': '/views/settings.mu',

	'el': '#page-view',


	/**
	 */

	'bindings': {
		'submit #qualityForm': 'submit'
	},

	'override render': function() {

		this._super();

		var fields = {
			captureTimeout: 10,
			bitRate: 64, //!
			frameRate: 24, //!
			gopSize: 12, //!
			qmin: 1, //!
			qmax: 11, //!
			bit_rate_tolerance: -1, //!
			qcompress: -1.0,
			qblur: -1.0,
			max_qdiff: -1,
			max_b_frames: -1,
			b_quant_factor: -1.0,
			luma_elim_threshold: -1,
			chroma_elim_threshold: -1,
			b_quant_offset: -1.0,
			rc_qsquish: -1.0,
			rc_eq: -1,
			rc_max_rate: -1,
			rc_min_rate: -1,
			rc_buffer_aggressivitiy: -1.0,
			i_quant_factor: -1.0,
			i_quant_offset: -1.0,
			rc_initial_cplx: -1.0,
			lumi_masking: -1.0,
			temporal_cplx_masking: -1.0,
			spatial_cplx_masking: -1.0,
			p_masking: -1.0,
			dark_masking: -1.0,
			dsp_mask: -1,
			bits_per_coded_sample: -1,
			prediction_method: -1,
			me_cmp: -1, //!
			me_sub_cmp: -1, //!
			dia_size: -1,
			last_predictor_count: -1,
			pre_me: -1,
			me_pre_cmp: -1, //!
			pre_dia_size: -1,
			me_subpel_quality: -1,
			dtg_active_format: -1,
			me_range: -1,
			intra_quant_bias: -1,
			global_quality: -1,
			coder_type: -1,
			mb_decision: -1,
			lmin: -1,
			lmax: -1,
			scenechange_threshold: -1,
			noise_reduction: -1,
			inter_threshold: -1,
			quantizer_noise_shaping: -1,
			me_threshold: -1,
			mb_threshold: -1,
			intra_dc_precision: -1,
			nsse_weight: -1,
			profile: -1,
			level: -1,
			mb_lmin: -1,
			mb_lmax: -1,
			me_penalty_compensation: -1,
			bidir_refine: -1,
			brd_scale: -1,
			crf: -1.0,
			cqp: -1.0,
			keyint_min: -1,
			refs: -1,
			chromaoffset: -1,
			bframebias: -1,
			trellis: -1, 
			complexityblur: -1.0,
			deblockalpha: -1,
			deblockbeta: -1,
			partitions: -1,
			directpred: -1,
			scenechange_factor: -1,
			b_sensitivity: -1,
			compression_level: -1, //!
			use_lpc: -1,
			lpc_coeff_precision: -1,
			min_prediction_order: -1,
			max_prediction_order: -1,
			prediction_order_method: -1,
			aq_mode: -1.0, //!
			psyd_rd: -1.0, //!
			psy_trellis: -1.0, //!


		}



		for(var type in fields) {
			$('#qualityForm').append(type +': <input name="'+type+'" value="'+(store.get(type) || fields[type])+'"> <br />');
		}

		$('#qualityForm').append('<input  type="submit" id="submit-form" value="submit"> <br />');

		var router = this._router;

		
	},

	/**
	 */

	 'submit': function(e) {
		e.preventDefault();

	    var $inputs = $('#qualityForm :input');

	    var values = {};
	    $inputs.each(function() {
	        values[this.name] = Number($(this).val()) || -1;
	        store.set(this.name, values[this.name]);
	    });

	    this._router.push('change/ctx', values);
	 }
});




module.exports = views;
});

_sardines.register("/node_modules/client/public-src/web/beans/virt.core/mouse.js", function(require, module, exports, __dirname, __filename) {
	var remote;


exports.init = function(rm) {
	remote = rm;
}
var mouseCoords = {
	x: 0,
	y: 0
}

var mouseEvents = {
	MOUSEEVENTF_ABSOLUTE: 0x8000,
	MOUSEEVENTF_LEFTDOWN: 0x0002,
	MOUSEEVENTF_LEFTUP: 0x0004,
	MOUSEEVENTF_MIDDLEDOWN: 0x0020,
	MOUSEEVENTF_MIDDLEUP: 0x0040,
	MOUSEEVENTF_MOVE: 0x0001,
	MOUSEEVENTF_RIGHTDOWN: 0x0008,
	MOUSEEVENTF_RIGHTUP: 0x0010,
	MOUSEEVENTF_WHEEL: 0x0800,
	MOUSEEVENTF_XDOWN: 0x0080,
	MOUSEEVENTF_XUP: 0x100
};


function mouseEvent(code, data) {

	if(!remote) return;
	remote.bridge.mouseEvent({ code: code, x: mouseCoords.x, y: mouseCoords.y, data: data });
}

		

var onMouseMove = _.throttle(function(e) {
	mouseCoords.x = e.x || e.pageX;
	mouseCoords.y = e.y || e.pageY;

	mouseEvent(mouseEvents.MOUSEEVENTF_ABSOLUTE);
}, 10);


var onMouseDown = function(e, bt)
{
	
	mouseEvent(bt.button == 0 ? mouseEvents.MOUSEEVENTF_LEFTDOWN : mouseEvents.MOUSEEVENTF_RIGHTDOWN);
}

var onMouseUp = function(e, bt)
{	
	mouseEvent(bt.button == 0 ? mouseEvents.MOUSEEVENTF_LEFTUP : mouseEvents.MOUSEEVENTF_RIGHTUP);
};

var onDoubleClick = function(e)
{
	//this should NOT be here.
	onClick(e);
	onClick(e);
}

var onClick = function(e)
{
	onMouseDown(e);
	onMouseUp(e);
}

var onScroll = _.throttle(function(e)
{
	mouseEvent(mouseEvents.MOUSEEVENTF_WHEEL, e.delta);
}, 50);


_.extend(window.desktopEvents, {
	mouseWheel: onScroll,
	mouseMove: onMouseMove,
	doubleClick: onDoubleClick
});


$(window).bind('desktopDown', onMouseDown);
$(window).bind('desktopUp', onMouseUp);

});

_sardines.register("/node_modules/client/public-src/web/beans/virt.core/keyboard.js", function(require, module, exports, __dirname, __filename) {
	var remote;
var vk = {
	VK_NUMLOCK: 0x67,
	VK_NUMPAD8: 0x68,
	VK_TAB: 0x09,
	VK_RETURN: 0x0D,
	VK_LEFT: 0x025,
	VK_UP: 0x26,
	VK_RIGHT: 0x27,
	VK_ALT: 0x80,
	VK_DOWN: 0x28,
	VK_LSHIFT: 0xA0,
	VK_RSHIFT: 0xA1,
	VK_CONTROL: 0x11,
	VK_SHIFT: 0x10,
	VK_BACK: 0x08,
	VK_ESCAPE: 0x1B
};
var keyboardEvents = {
	KEYEVENTF_EXTENDEDKEY: 0x0001,
	KEYEVENTF_KEYUP: 0x0002
};


exports.init = function(rm) {
	remote = rm;
}


function keyboardEvent(key, modifiers, dwFlags) {
	if(!remote) return;

	remote.bridge.keyboardEvent({ key: key, modifiers: modifiers || 0, dwFlags: dwFlags || 0 });
}

function modifierEvent(key) {
	keyboardEvent(key, 0, keyboardEvents.KEYEVENTF_EXTENDEDKEY | keyboardEvents.KEYEVENTF_KEYUP);
}


var onKey = function(e, dw)
{
	keyboardEvent(e.keyCode, 0, dw);
}

var modifiersDown = { altKey: false, shiftKey: false, ctrlKey: false };
var modifiers = { altKey: 0, shiftKey: 16, ctrlKey: 17 };

var onModifiers = function(e, dwFlags)
{

	for(var key in modifiersDown) {


		if(modifiersDown[key] != e[key]) {
			modifiersDown[key] = e[key];
			onKey({ keyCode: modifiers[key] }, e[key] ? 0 : keyboardEvents.KEYEVENTF_KEYUP);
		}
	}
}

var onKeyDown = function(e)
{ 
	console.log(e);
	//onModifiers(e);
	onKey(e, 0);
}

var onKeyUp = function(e)
{
	// onKey(e, 0);
	//onModifiers(e);
	onKey(e, keyboardEvents.KEYEVENTF_KEYUP);
}


_.extend(window.desktopEvents, {
	keyDown: onKeyDown,
	keyUp: onKeyUp
});


});

_sardines.register("/node_modules/client/public-src/web/beans/virt.core/desktop.js", function(require, module, exports, __dirname, __filename) {
	var remote;

exports.init = function(rm) {
	remote = rm;
	onResize();
}


var onResize = _.debounce(function() {
	if(!remote) return;
	remote.bridge.resize($(window).width(), $(window).height());
}, 500);

$(window).resize(onResize);
});

_sardines.register("/node_modules/client/public-src/web/beans/virt.core/index.js", function(require, module, exports, __dirname, __filename) {
	window.desktopEvents = {};

var views = require('./views'),
mouse = require('./mouse'),
keyboard = require('./keyboard'),
desktop = require('./desktop');

exports.plugin = function(router) {

	window.controlEvents = {};

	var remote, currentLoc = {};

	router.on({


		/**
		 */

		'push init': function() {
			
			DNode.connect(function(remote) {
    			remote.authorize(null, null, function(mtds) {
					router.push('remote/methods', mtds);
				});
			});

			console.log(DNode.connect.toString())

		},

		/**
		 */

		'pull -public -mixed view -> quality': function(request) {
		
			request.addView(new views.QualityView());
			request.display();
		},


		/**
		 */

		'pull -public -mixed view -> /test': function(request) {
			var browser = request.data.browser,
			url = request.data.url;

			var server = 'rtmp://50.19.224.69:1935/live';
			//server = 'rtmp://localhost:1935/live';

			var virtView = new views.VirtView({ el: '#page-view', browser: browser });
			virtView.addChild(new views.DesktopView({ server: server,  })); 

			request.addView(virtView);

			request.display();

			request.next();

			router.push('remote/test/url', { browser: browser, url: url || 'http://google.com' });

		},

		/**
		 */

		'push change/ctx': function(ctx) {
			remote.bridge.updateCtx(ctx);	
		},

		/**
		 */

		'push remote/test/url': function(ops) {

			if(!ops.url) ops.url = currentLoc.url;

			router.push('redirect', '/test/?browser='+ops.browser+'&url=' + currentLoc.url);

			currentLoc = ops;

		 	if(!remote || !ops.browser) return;

		 	console.log("open app");
		 	console.log(ops);

		 	remote.bridge.openApp({
		 		name: ops.browser,
		 		args: ops.url
		 	});
		},


		/**
		 */

		'push remote/methods': function(rm) {
			mouse.init(rm);
			keyboard.init(rm);
			desktop.init(rm);

			remote = rm;

			if(currentLoc.browser) router.push('remote/test/url', currentLoc);
		}

	});
 
}
});

_sardines.register("/node_modules/client/public-src/web/beans/auth.core/index.js", function(require, module, exports, __dirname, __filename) {
	exports.plugin = function(router) {
	
	router.on({
		
		'pull -mixed /login': function() {
			//todo
		},

		/**
		 */

		'pull -mixed /signup': function() {
			//todo
		},

		/**
		 */

		'pull -mixed /share': function() {
			//todo
		}
	});

}
});

_sardines.register("/node_modules/client/public-src/web/beans/app.core/views.js", function(require, module, exports, __dirname, __filename) {
	var fig = require('fig'),
malt = require('malt'),
views = fig.views,
models = malt.models;
                                         

/**
 * the home page
 */

views.IndexView = views.Template.extend({
	   
	tpl: '/index.html'
});     


module.exports = views;
});

_sardines.register("/node_modules/client/public-src/web/beans/app.core/index.js", function(require, module, exports, __dirname, __filename) {
	var views = require('./views');

exports.plugin = function(router) {

	router.on({

		'pull -public view -> (home OR /)': function() {
			
		},
		
		'pull root/view': function() {
			return views.IndexView;
		}
	})
	
	head.ready(function() {
		router.push('init');
		router.push('xbrowsertesting/ready');
	});
}
});

_sardines.register("/Users/craig/Dropbox/Developer/Public/leche/lib/web.js", function(require, module, exports, __dirname, __filename) {
	
});

_sardines.register("/node_modules/daisy/lib/beans/hooks.core/utils.js", function(require, module, exports, __dirname, __filename) {
	exports.publicChannels = function(channels)
{
	var pub = [];
	
	
	for(var name in channels)
	{
		var channel = channels[name];
		
		if(!channel.meta['public'] || channel.meta['hooked']) continue;
		
		pub.push(name)
	}
	
	return pub;
}
});

_sardines.register("/node_modules/cashew/lib/binary/parser.js", function(require, module, exports, __dirname, __filename) {
	

/**
 * Binary Parser.
 * Jonas Raoni Soares Silva
 * http://jsfromhell.com/classes/binary-parser [v1.0]
 */

var chr = String.fromCharCode;

var maxBits = [];
for (var i = 0; i < 64; i++) {
  maxBits[i] = Math.pow(2, i);
}

function BinaryParser (bigEndian, allowExceptions) {
  this.bigEndian = bigEndian;
  this.allowExceptions = allowExceptions;
};

BinaryParser.warn = function warn (msg) {
  if (this.allowExceptions) {
    throw new Error(msg);
  }

  return 1;
};

BinaryParser.decodeFloat = function decodeFloat (data, precisionBits, exponentBits) {
  var b = new this.Buffer(this.bigEndian, data);

  b.checkBuffer(precisionBits + exponentBits + 1);

  var bias = maxBits[exponentBits - 1] - 1
    , signal = b.readBits(precisionBits + exponentBits, 1)
    , exponent = b.readBits(precisionBits, exponentBits)
    , significand = 0
    , divisor = 2
    , curByte = b.buffer.length + (-precisionBits >> 3) - 1;

  do {
    for (var byteValue = b.buffer[ ++curByte ], startBit = precisionBits % 8 || 8, mask = 1 << startBit; mask >>= 1; ( byteValue & mask ) && ( significand += 1 / divisor ), divisor *= 2 );
  } while (precisionBits -= startBit);

  return exponent == ( bias << 1 ) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity : ( 1 + signal * -2 ) * ( exponent || significand ? !exponent ? Math.pow( 2, -bias + 1 ) * significand : Math.pow( 2, exponent - bias ) * ( 1 + significand ) : 0 );
};

BinaryParser.decodeInt = function decodeInt (data, bits, signed, forceBigEndian) {
  var b = new this.Buffer(this.bigEndian || forceBigEndian, data)
      , x = b.readBits(0, bits)
      , max = maxBits[bits]; //max = Math.pow( 2, bits );
  
  return signed && x >= max / 2
      ? x - max
      : x;
};

BinaryParser.encodeFloat = function encodeFloat (data, precisionBits, exponentBits) {
  var bias = maxBits[exponentBits - 1] - 1
    , minExp = -bias + 1
    , maxExp = bias
    , minUnnormExp = minExp - precisionBits
    , n = parseFloat(data)
    , status = isNaN(n) || n == -Infinity || n == +Infinity ? n : 0
    , exp = 0
    , len = 2 * bias + 1 + precisionBits + 3
    , bin = new Array(len)
    , signal = (n = status !== 0 ? 0 : n) < 0
    , intPart = Math.floor(n = Math.abs(n))
    , floatPart = n - intPart
    , lastBit
    , rounded
    , result
    , i
    , j;

  for (i = len; i; bin[--i] = 0);

  for (i = bias + 2; intPart && i; bin[--i] = intPart % 2, intPart = Math.floor(intPart / 2));

  for (i = bias + 1; floatPart > 0 && i; (bin[++i] = ((floatPart *= 2) >= 1) - 0 ) && --floatPart);

  for (i = -1; ++i < len && !bin[i];);

  if (bin[(lastBit = precisionBits - 1 + (i = (exp = bias + 1 - i) >= minExp && exp <= maxExp ? i + 1 : bias + 1 - (exp = minExp - 1))) + 1]) {
    if (!(rounded = bin[lastBit])) {
      for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]);
    }

    for (j = lastBit + 1; rounded && --j >= 0; (bin[j] = !bin[j] - 0) && (rounded = 0));
  }

  for (i = i - 2 < 0 ? -1 : i - 3; ++i < len && !bin[i];);

  if ((exp = bias + 1 - i) >= minExp && exp <= maxExp) {
    ++i;
  } else if (exp < minExp) {
    exp != bias + 1 - len && exp < minUnnormExp && this.warn("encodeFloat::float underflow");
    i = bias + 1 - (exp = minExp - 1);
  }

  if (intPart || status !== 0) {
    this.warn(intPart ? "encodeFloat::float overflow" : "encodeFloat::" + status);
    exp = maxExp + 1;
    i = bias + 2;

    if (status == -Infinity) {
      signal = 1;
    } else if (isNaN(status)) {
      bin[i] = 1;
    }
  }

  for (n = Math.abs(exp + bias), j = exponentBits + 1, result = ""; --j; result = (n % 2) + result, n = n >>= 1);

  for (n = 0, j = 0, i = (result = (signal ? "1" : "0") + result + bin.slice(i, i + precisionBits).join("")).length, r = []; i; j = (j + 1) % 8) {
    n += (1 << j) * result.charAt(--i);
    if (j == 7) {
      r[r.length] = String.fromCharCode(n);
      n = 0;
    }
  }

  r[r.length] = n
    ? String.fromCharCode(n)
    : "";

  return (this.bigEndian ? r.reverse() : r).join("");
};

BinaryParser.encodeInt = function encodeInt (data, bits, signed, forceBigEndian) {
  var max = maxBits[bits];

  if (data >= max || data < -(max / 2)) {
    this.warn("encodeInt::overflow");
    data = 0;
  }

  if (data < 0) {
    data += max;
  }

  for (var r = []; data; r[r.length] = String.fromCharCode(data % 256), data = Math.floor(data / 256));

  for (bits = -(-bits >> 3) - r.length; bits--; r[r.length] = "\0");

  return ((this.bigEndian || forceBigEndian) ? r.reverse() : r).join("");
};

BinaryParser.toSmall    = function( data ){ return this.decodeInt( data,  8, true  ); };
BinaryParser.fromSmall  = function( data ){ return this.encodeInt( data,  8, true  ); };
BinaryParser.toByte     = function( data ){ return this.decodeInt( data,  8, false ); };
BinaryParser.fromByte   = function( data ){ return this.encodeInt( data,  8, false ); };
BinaryParser.toShort    = function( data ){ return this.decodeInt( data, 16, true  ); };
BinaryParser.fromShort  = function( data ){ return this.encodeInt( data, 16, true  ); };
BinaryParser.toWord     = function( data ){ return this.decodeInt( data, 16, false ); };
BinaryParser.fromWord   = function( data ){ return this.encodeInt( data, 16, false ); };
BinaryParser.toInt      = function( data ){ return this.decodeInt( data, 32, true  ); };
BinaryParser.fromInt    = function( data ){ return this.encodeInt( data, 32, true  ); };
BinaryParser.toLong     = function( data ){ return this.decodeInt( data, 64, true  ); };
BinaryParser.fromLong   = function( data ){ return this.encodeInt( data, 64, true  ); };
BinaryParser.toDWord    = function( data ){ return this.decodeInt( data, 32, false ); };
BinaryParser.fromDWord  = function( data ){ return this.encodeInt( data, 32, false ); };
BinaryParser.toQWord    = function( data ){ return this.decodeInt( data, 64, true ); };
BinaryParser.fromQWord  = function( data ){ return this.encodeInt( data, 64, true ); };
BinaryParser.toFloat    = function( data ){ return this.decodeFloat( data, 23, 8   ); };
BinaryParser.fromFloat  = function( data ){ return this.encodeFloat( data, 23, 8   ); };
BinaryParser.toDouble   = function( data ){ return this.decodeFloat( data, 52, 11  ); };
BinaryParser.fromDouble = function( data ){ return this.encodeFloat( data, 52, 11  ); };

// Factor out the encode so it can be shared by add_header and push_int32
BinaryParser.encode_int32 = function encode_int32 (number) {
  var a, b, c, d, unsigned;
  unsigned = (number < 0) ? (number + 0x100000000) : number;
  a = Math.floor(unsigned / 0xffffff);
  unsigned &= 0xffffff;
  b = Math.floor(unsigned / 0xffff);
  unsigned &= 0xffff;
  c = Math.floor(unsigned / 0xff);
  unsigned &= 0xff;
  d = Math.floor(unsigned);
  return chr(a) + chr(b) + chr(c) + chr(d);
};

BinaryParser.encode_int64 = function encode_int64 (number) {
  var a, b, c, d, e, f, g, h, unsigned;
  unsigned = (number < 0) ? (number + 0x10000000000000000) : number;
  a = Math.floor(unsigned / 0xffffffffffffff);
  unsigned &= 0xffffffffffffff;
  b = Math.floor(unsigned / 0xffffffffffff);
  unsigned &= 0xffffffffffff;
  c = Math.floor(unsigned / 0xffffffffff);
  unsigned &= 0xffffffffff;
  d = Math.floor(unsigned / 0xffffffff);
  unsigned &= 0xffffffff;
  e = Math.floor(unsigned / 0xffffff);
  unsigned &= 0xffffff;
  f = Math.floor(unsigned / 0xffff);
  unsigned &= 0xffff;
  g = Math.floor(unsigned / 0xff);
  unsigned &= 0xff;
  h = Math.floor(unsigned);
  return chr(a) + chr(b) + chr(c) + chr(d) + chr(e) + chr(f) + chr(g) + chr(h);
};

/**
 * UTF8 methods
 */

// Take a raw binary string and return a utf8 string
BinaryParser.decode_utf8 = function decode_utf8 (binaryStr) {
  var len = binaryStr.length
    , decoded = ''
    , i = 0
    , c = 0
    , c1 = 0
    , c2 = 0
    , c3;

  while (i < len) {
    c = binaryStr.charCodeAt(i);
    if (c < 128) {
      decoded += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c2 = binaryStr.charCodeAt(i+1);
      decoded += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = binaryStr.charCodeAt(i+1);
      c3 = binaryStr.charCodeAt(i+2);
      decoded += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }

  return decoded;
};

// Encode a cstring
BinaryParser.encode_cstring = function encode_cstring (s) {
  return unescape(encodeURIComponent(s)) + BinaryParser.fromByte(0);
};

// Take a utf8 string and return a binary string
BinaryParser.encode_utf8 = function encode_utf8 (s) {
  var a = ""
    , c;

  for (var n = 0, len = s.length; n < len; n++) {
    c = s.charCodeAt(n);

    if (c < 128) {
      a += String.fromCharCode(c);
    } else if ((c > 127) && (c < 2048)) {
      a += String.fromCharCode((c>>6) | 192) ;
      a += String.fromCharCode((c&63) | 128);
    } else {
      a += String.fromCharCode((c>>12) | 224);
      a += String.fromCharCode(((c>>6) & 63) | 128);
      a += String.fromCharCode((c&63) | 128);
    }
  }

  return a;
};

BinaryParser.hprint = function hprint (s) {
  var number;

  for (var i = 0, len = s.length; i < len; i++) {
    if (s.charCodeAt(i) < 32) {
      number = s.charCodeAt(i) <= 15
        ? "0" + s.charCodeAt(i).toString(16)
        : s.charCodeAt(i).toString(16);        
      process.stdout.write(number + " ")
    } else {
      number = s.charCodeAt(i) <= 15
        ? "0" + s.charCodeAt(i).toString(16)
        : s.charCodeAt(i).toString(16);
        process.stdout.write(number + " ")
    }
  }
  
  process.stdout.write("\n\n");
};

BinaryParser.ilprint = function hprint (s) {
  var number;

  for (var i = 0, len = s.length; i < len; i++) {
    if (s.charCodeAt(i) < 32) {
      number = s.charCodeAt(i) <= 15
        ? "0" + s.charCodeAt(i).toString(10)
        : s.charCodeAt(i).toString(10);

    } else {
      number = s.charCodeAt(i) <= 15
        ? "0" + s.charCodeAt(i).toString(10)
        : s.charCodeAt(i).toString(10);
        
    }
  }
};

BinaryParser.hlprint = function hprint (s) {
  var number;

  for (var i = 0, len = s.length; i < len; i++) {
    if (s.charCodeAt(i) < 32) {
      number = s.charCodeAt(i) <= 15
        ? "0" + s.charCodeAt(i).toString(16)
        : s.charCodeAt(i).toString(16);

    } else {
      number = s.charCodeAt(i) <= 15
        ? "0" + s.charCodeAt(i).toString(16)
        : s.charCodeAt(i).toString(16);

    }
  }
};

/**
 * BinaryParser buffer constructor.
 */

function BinaryParserBuffer (bigEndian, buffer) {
  this.bigEndian = bigEndian || 0;
  this.buffer = [];
  this.setBuffer(buffer);
};

BinaryParserBuffer.prototype.setBuffer = function setBuffer (data) {
  var l, i, b;

  if (data) {
    i = l = data.length;
    b = this.buffer = new Array(l);
    for (; i; b[l - i] = data.charCodeAt(--i));
    this.bigEndian && b.reverse();
  }
};

BinaryParserBuffer.prototype.hasNeededBits = function hasNeededBits (neededBits) {
  return this.buffer.length >= -(-neededBits >> 3);
};

BinaryParserBuffer.prototype.checkBuffer = function checkBuffer (neededBits) {
  if (!this.hasNeededBits(neededBits)) {
    throw new Error("checkBuffer::missing bytes");
  }
};

BinaryParserBuffer.prototype.readBits = function readBits (start, length) {
  //shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)

  function shl (a, b) {
    for (; b--; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
    return a;
  }

  if (start < 0 || length <= 0) {
    return 0;
  }

  this.checkBuffer(start + length);

  var offsetLeft
    , offsetRight = start % 8
    , curByte = this.buffer.length - ( start >> 3 ) - 1
    , lastByte = this.buffer.length + ( -( start + length ) >> 3 )
    , diff = curByte - lastByte
    , sum = ((this.buffer[ curByte ] >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1)) + (diff && (offsetLeft = (start + length) % 8) ? (this.buffer[lastByte++] & ((1 << offsetLeft) - 1)) << (diff-- << 3) - offsetRight : 0);

  for(; diff; sum += shl(this.buffer[lastByte++], (diff-- << 3) - offsetRight));

  return sum;
};

/**
 * Expose.
 */

module.exports = BinaryParser;
BinaryParser.Buffer = BinaryParserBuffer;
});

_sardines.register("/node_modules/cashew/lib/hash/index.js", function(require, module, exports, __dirname, __filename) {
	
exports.md5 = function (string) {

   function RotateLeft(lValue, iShiftBits) {
           return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
   }

   function AddUnsigned(lX,lY) {
           var lX4,lY4,lX8,lY8,lResult;
           lX8 = (lX & 0x80000000);
           lY8 = (lY & 0x80000000);
           lX4 = (lX & 0x40000000);
           lY4 = (lY & 0x40000000);
           lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
           if (lX4 & lY4) {
                   return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
           }
           if (lX4 | lY4) {
                   if (lResult & 0x40000000) {
                           return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                   } else {
                           return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                   }
           } else {
                   return (lResult ^ lX8 ^ lY8);
           }
   }

   function F(x,y,z) { return (x & y) | ((~x) & z); }
   function G(x,y,z) { return (x & z) | (y & (~z)); }
   function H(x,y,z) { return (x ^ y ^ z); }
   function I(x,y,z) { return (y ^ (x | (~z))); }

   function FF(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function GG(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function HH(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function II(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function ConvertToWordArray(string) {
           var lWordCount;
           var lMessageLength = string.length;
           var lNumberOfWords_temp1=lMessageLength + 8;
           var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
           var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
           var lWordArray=Array(lNumberOfWords-1);
           var lBytePosition = 0;
           var lByteCount = 0;
           while ( lByteCount < lMessageLength ) {
                   lWordCount = (lByteCount-(lByteCount % 4))/4;
                   lBytePosition = (lByteCount % 4)*8;
                   lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                   lByteCount++;
           }
           lWordCount = (lByteCount-(lByteCount % 4))/4;
           lBytePosition = (lByteCount % 4)*8;
           lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
           lWordArray[lNumberOfWords-2] = lMessageLength<<3;
           lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
           return lWordArray;
   };

   function WordToHex(lValue) {
           var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
           for (lCount = 0;lCount<=3;lCount++) {
                   lByte = (lValue>>>(lCount*8)) & 255;
                   WordToHexValue_temp = "0" + lByte.toString(16);
                   WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
           }
           return WordToHexValue;
   };

   function Utf8Encode(string) {
           string = string.replace(/\r\n/g,"\n");
           var utftext = "";

           for (var n = 0; n < string.length; n++) {

                   var c = string.charCodeAt(n);

                   if (c < 128) {
                           utftext += String.fromCharCode(c);
                   }
                   else if((c > 127) && (c < 2048)) {
                           utftext += String.fromCharCode((c >> 6) | 192);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }
                   else {
                           utftext += String.fromCharCode((c >> 12) | 224);
                           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }

           }

           return utftext;
   };

   var x=Array();
   var k,AA,BB,CC,DD,a,b,c,d;
   var S11=7, S12=12, S13=17, S14=22;
   var S21=5, S22=9 , S23=14, S24=20;
   var S31=4, S32=11, S33=16, S34=23;
   var S41=6, S42=10, S43=15, S44=21;

   string = Utf8Encode(string);

   x = ConvertToWordArray(string);

   a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

   for (k=0;k<x.length;k+=16) {
           AA=a; BB=b; CC=c; DD=d;
           a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
           d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
           c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
           b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
           a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
           d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
           c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
           b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
           a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
           d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
           c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
           b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
           a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
           d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
           c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
           b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
           a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
           d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
           c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
           b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
           a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
           d=GG(d,a,b,c,x[k+10],S22,0x2441453);
           c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
           b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
           a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
           d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
           c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
           b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
           a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
           d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
           c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
           b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
           a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
           d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
           c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
           b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
           a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
           d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
           c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
           b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
           a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
           d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
           c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
           b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
           a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
           d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
           c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
           b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
           a=II(a,b,c,d,x[k+0], S41,0xF4292244);
           d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
           c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
           b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
           a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
           d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
           c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
           b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
           a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
           d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
           c=II(c,d,a,b,x[k+6], S43,0xA3014314);
           b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
           a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
           d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
           c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
           b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
           a=AddUnsigned(a,AA);
           b=AddUnsigned(b,BB);
           c=AddUnsigned(c,CC);
           d=AddUnsigned(d,DD);
                }

        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

        return temp.toLowerCase();
}

 exports.crc32 = function (str) {    
    var crc = ~0, i;
    for (i = 0, l = str.length; i < l; i++) {
        crc = (crc >>> 8) ^ crc32tab[(crc ^ str.charCodeAt(i)) & 0xff];
    }
    crc = Math.abs(crc ^ -1);
    return crc.toString(16);//hex ? crc.toString(16) : crc;
};



var crc32tab = [
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba,
    0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3,
    0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988,
    0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
    0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de,
    0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
    0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec,
    0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
    0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
    0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
    0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940,
    0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
    0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116,
    0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f,
    0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
    0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
    0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a,
    0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
    0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818,
    0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
    0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e,
    0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457,
    0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c,
    0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
    0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2,
    0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb,
    0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0,
    0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
    0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086,
    0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
    0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4,
    0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
    0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a,
    0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683,
    0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8,
    0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
    0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe,
    0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7,
    0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
    0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
    0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252,
    0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
    0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60,
    0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
    0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
    0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f,
    0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04,
    0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
    0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a,
    0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
    0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38,
    0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
    0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e,
    0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
    0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c,
    0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
    0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2,
    0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db,
    0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0,
    0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6,
    0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf,
    0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94,
    0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
];
});

_sardines.register("/node_modules/cashew", function(require, module, exports, __dirname, __filename) {
	module.exports = require("/node_modules/cashew/lib/index.js")
});

_sardines.register("/node_modules/cashew/lib/index.js", function(require, module, exports, __dirname, __filename) {
	var BinaryParser = require('./binary/parser'),
hash = require('./hash'),
Structr = require('structr');


var MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10),
PID = typeof process != 'undefined' ? process.pid : parseInt(Math.random() * 0xFFFFFF, 8);

var numIDsGenerated = 0;

var Generator = Structr({

	/**
	 */

	'__construct': function(key)
	{

		//the key for the generator
		this.key = key;


		//the hash value of the KEY to prepend to the ID / generated hash
		this.keyHash = hash.crc32(key);

	},

	/**
	 */

	'inc': function()
	{
		return numIDsGenerated++;
	},


	/**
	 * a unique identifier, taken from mongodb's spec
	 */

	'uid': function()
	{
		var unixTime  = parseInt(Date.now()/1000, 10),
		time4Bytes    = BinaryParser.encodeInt(unixTime, 32, true, true),
		machine3Bytes = BinaryParser.encodeInt(MACHINE_ID, 24, false),
		pid2Bytes     = BinaryParser.fromShort(PID),
		index3Bytes   = BinaryParser.encodeInt(this.inc(), 24, false, true);

		return this.keyHash + this._toHexString(time4Bytes + machine3Bytes + pid2Bytes + index3Bytes);	
	},

	/**
	 * hashed 
	 */

	'hash': function(value, algorithm)
	{
		//crc32 or md5 for now...
		return this.keyHash + hash[algorithm || 'md5'](value);
	},


	/**
	 */

	'random': function()
	{
		var buffer = '', n = 32; //size of md5 hash
		for(var i = n; i--;) buffer += this._rc();

		return this.hash(buffer);
	},

	/**
	 */

	'_rc': function(id)
	{
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	},

	/**
	 */
	 
	'_toHexString': function(id)
	{
		var hexString = '', number, value;

		for (var index = 0, len = id.length; index < len; index++) 
		{
			value = BinaryParser.toByte(id.substr(index, 1));

			number = value <= 15 ? '0' + value.toString(16) : value.toString(16);

		    hexString = hexString + number;
		}

		return hexString;
	}
});

var Manager = Structr({
    
    /**
     */
     
    '__construct': function()
    {
    	this._generatorsByKey = {};

    	//crc32 hash for the key
    	this._generatorsByHash = {};

    	//the number of IDS generated
    	this.idsGenerated = 0;
    },
    
    /**
     */
     
    'register': function(key, clazz)
    {
    	if(this._generatorsByKey[key]) return this._generatorsByKey[key];

    	if(!clazz) clazz = Generator;

    	var gen = new clazz(key);

    	return this._generatorsByHash[gen.keyHash] = this._generatorsByKey[key] = gen;
    },

    /**
     */

    'generator': function(keyOrId, create)
    {
    	return this._generatorsByKey[keyOrId] || this._generatorsByHash[keyOrId.substr(0, 8)] || (create ? new Generator(keyOrId) : null);
    },

    /**
     */

    'key': function(keyOrId)
    {
    	var gen = this.generator(keyOrId);

    	return gen ? gen.key : null; 
    }
     
});

var glob = typeof window != 'undefined' ? window : global;


//forces NPM to return the global verson
var man = glob.cashew ? glob.cashew : new Manager();
man.Generator = Generator;

module.exports = glob.cashew = man;




});

_sardines.register("/node_modules/daisy/lib/beans/hooks.core/transactions.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
EventEmitter = require('events').EventEmitter,
cashew = require('cashew');

var Transaction = Structr({
	
	/**
	 */

	'__construct': function(name, id, collection)
	{
		this._name = name;
		this._id = id;
		this._collection = collection;
		
		this._em = new EventEmitter();
	},
	
	/**
	 */
	
	'emit': function(type, data)
	{
		this._em.emit(type, data);
	},
	
	
	/**
	 */

	'prepare': function(type, ops)
	{
		var self = this;
		
		if(ops.hasNext && ops.hasNext())
		{
			this.register();
			
			this._em.on('next', ops.next);
		}
		
		var meta = ops.meta || {};
		
		//undefined breaks amqp
		for(var key in meta) if(!meta[key]) meta[key] = 1;
		                
		this._headers = { type: type, 
			hasNext: ops.hasNext ? ops.hasNext() : false, 
			transactionId: this._id,     
			channel: this._name,
			meta: meta }; 
			                                       
		this._queue = ops.queue || meta.queue;    
		this._data = ops.data;    
		                           
		
		return this;
	},  
	
	/**
	 */
	
	'send': function()
	{
		if(this._queue)
		{                            
			this._collection._transport.direct(this._queue, this._data, this._headers);
		}              
		else
		{                            
			this._collection._transport.broadcast(this._name, this._data, this._headers);
		}
		
		return this;                                                                           
	},
	          
	/**
	 */

	'on': function(listen)
	{
		for(var type in listen)
		{
			this.on(type, listen[type])
		}

		return this;
	},


	/**
	 */

	'second on': function(type, listener)
	{
		this._em.addListener(type, listener);
		return this;
	},


	/**
	 * the end callback
	 */

	'onEnd': function(type, listener)
	{
		var self = this;
		this.on(type, listener);
		this.on(type, function()
		{
			self.dispose();
		});
	},

	/**
	 */

	'register': function(ops)
	{
		if(this._collection._addTransaction(this))
		{
			//timeout for N seconds before killing
			if(ops && ops.timeout) this._killTimeout = setTimeout(this.getMethod('kill'));
		}

		return this;
	},

	/**
	 */

	'onError': function(e)
	{
		this._em.emit('error', e);
	},

	/**
	 */

	'dispose': function()
	{
		clearTimeout(this._killTimeout);
		this._em.removeAllListeners();
		this._collection._remove(this);
	},

	/**
	 */

	'kill': function()
	{
		console.error('Transaction %s has been killed', this._headers._name);
		this.dispose();
	}
});         

var Collection = Structr({
	
	/**
	 */
	
	'__construct': function()
	{
	   this._col = {}; 
	},
	
	/**
	 */
	
	'add': function(key, value)
	{                     
		if(!key) return;                   
		
		if(!this._col[key]) this._col[key] = [];  
		                                      
		
		this._col[key].push(value);
	},
	
	/**
	 */
	
	'remove': function(key, value)
	{
		if(!key || !this._col[key]) return;
		
		var i = this._col[key].indexOf(value);
		
		if(i > -1) this._col[key].splice(i, 1);      
		
		if(!this._col[key].length) delete this._col[key];
	},
	
	/**
	 */
	
	'stack': function(key)
	{
		return this._col[key];
	}
})



module.exports = Structr({

	/**
	 */

	'__construct': function(transport)
	{
		this._live 			= {};
		this._transport 	= transport;
		this._liveByQueue   = new Collection();       
		this._liveByChannel = new Collection();   
        this._idGen 		= cashew.register('hook.core');
	},
	
	/**
	 */
	
	'create': function(name)
	{
		return new Transaction(name, this._idGen.uid(), this);
	},

	
	/**
	 */
	
	'live': function(uidOrChannelOrQueue)
	{                                            
		return this._live[ uidOrChannelOrQueue ] || this._liveByChannel.stack(uidOrChannelOrQueue) || this._liveByQueue.stack(uidOrChannelOrQueue);
	},

	/**
	 */

	'_addTransaction': function(trans)
	{
		if(this._live[ trans._id ]) return false;		                 
	            
		this._live[ trans._id ] = trans;                                    
		this._liveByChannel.add(trans._name, trans);
		this._liveByQueue.add(trans._queue, trans);

		return true;
	},


	/**
	 */
	
	'_remove': function(trans)
	{                         
		if(this._live[trans._id])
		{
			delete this._live[trans._id];   
			
			this._liveByChannel.remove(trans._name, trans); 
			this._liveByQueue.remove(trans._queue, trans);                                          
		}
		
		return trans;
	}
	
});
});

_sardines.register("/node_modules/daisy/lib/beans/hooks.core/transports.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
utils = require('./utils'),
Transactions = require('./transactions'),
vine = require('vine'),
_ = require('underscore');

 
var TransportWrapper = Structr({
	
	/**
	 */
	
	'__construct': function(collection, transport)
	{
		//the collection that holds all the transports
		this._collection = collection;

		//the scope of queues to bind to
		this.scope = collection.scope || [];

		
		//the router that handles all the channel requests
		this._router = collection._router;
		
		//the transport which broadcasts routes over the network
		this._transport = transport;
		
		//channels we've already hooked into
		this._hooked = {};
		
		//any channels which should be ignored. This is a dirty method of making sure requests
		//don't get re-broadcasted out to the same transport
		this._ignore = {};
		
		//controls transactions between two servers
		this._transactions = new Transactions(transport);

		//kill transactions after N seconds
		this._killTimeout = 20000;
		
		//called back when the app first starts up, and when new apps are introduced
		transport.onHandshake = this.getMethod('onHandshake');
		
		//called when an app on the network is sending a request that *this* app can handle
		transport.onMessage = this.getMethod('onMessage');
		
		//what happens when a call is made to a channel that doens't exist
		transport.onNoRoute = this.getMethod('onNoRoute');
	},
	
	/**
	 * publishes *public* hooks to the network. Any app can call these.
	 */
	
	'publishHooks': function(hooks)
	{
		var self = this;
		
		hooks.forEach(function(hook)
		{
			self._hooked[hook.replace(/\:\w+/g,':param')]  = 1;
		});
		
		this._transport.publishHooks(hooks);
	},
	
	/**
	 * When new apps come in, register their hooks
	 */
	
	'onHandshake': function(handshake)
	{                           
		var self = this;


		if(handshake.hooks instanceof Array) {
			handshake.hooks.forEach(this.getMethod('_hook'));
		} else {
			for(var route in handshake.hooks) {
				self._hook(route, handshake.hooks[route]);		
			}
		}
		
		
		//notify the rest of the app that the given apps are ready
		handshake.apps.forEach(function(app)
		{                                     
			self._router.push(app + '/ready', {}, { from: self._from(app) });
		});
		
	},
	
	/**
	 * handle any message from a server
	 */
	
	'onMessage': function(data, headers, from)
	{
		
		//request coming from a server
		if(headers.type == 'push' || headers.type == 'pull')
		{
			this._ignore[headers.channel] = 1;
			this._onRequest(data, headers, from);
			delete this._ignore[headers.channel];
		}
		
		//OR a response from a server ~ response, or next
		else
		{
			this._onResponse(data, headers, from);
		}
	},
	
	/**
	 */
	
	'onNoRoute': function(channel)
	{                                      
		(this._transactions.live(channel) || []).forEach(function(transaction)
		{
			transaction.emit('response', vine.error('Route does not exist').result({ connection: false }).end());
		});
	},
	
	/**
	 */
	
	'_onRequest': function(data, headers, from)
	{                  
		var ops = {
			from: this._from(from.name)
		},
		self = this,
		respond = function(response, type)
		{
			self._transport.direct(from.name, response, { transactionId: headers.transactionId, type: type } );
			
			// queue.shift();
		};
		
		//this happens when passing through a route like: 'pull some/remote/route -> some/local/route'
		if(headers.hasNext)
		{
			ops._next = function()
			{
				respond(null, 'next');
			}
		}
		
		if(headers.type == 'push')
		{
			this._router.push(headers.channel, data, ops);
		}
		else
		if(headers.type == 'pull')
		{                                 
			self._router.pull(headers.channel, data, ops, function(response)
			{
				respond(response, 'response');
			});
		}
		
	},        
	
	
	/**
	 */
	
	'_from': function(queue)
	{                                 
		var transactions = this._transactions, self = this;
		                    
		return {
			name: queue,
			pull: function(channel, data, ops, callback)
			{        
				if(typeof data == 'function')
				{
					callback = data;
					data = null;
					ops = null;
				}            
				
				if(typeof ops == 'function')
				{
					callback = ops;
					ops = null;
				}              
				
				if(!ops) ops = {};
				if(!data) data = {};           
				                                              
				transactions.create(channel).prepare('pull', {
					meta: ops.meta || {},
					data: data,
					queue: queue
				}).register({ timeout: self._killTimeout }).send().onEnd('response', callback);
			},
			push: function(channel, data, ops)
			{   
				if(!data) data = {};
				if(!ops) ops = {};                   
				
				transactions.create(channel).prepare('push', {
					meta: ops.meta || { },
					data: data,
					queue: queue
				}).send();
			}
		}
	},
	
	/**
	 */
	
	'_onResponse': function(data, headers, from)
	{
		var trans = this._transactions.live(headers.transactionId);
		
		if(!trans) return console.error('Transaction %s does not exist', headers.transactionId);
		
		trans.emit(headers.type, data);      
	},

	/**
	 */

	'_getQueue': function(channel) {

		if(!this.scope.length) return null;

		var queues = this._hooked[channel] || [];

		return _.intersection(queues, this.scope).pop();
	},
	
	/**
	 * hooks a *remote* route to the app
	 */
	
	'_hook': function(channel, queues)
	{

		//no "ready" hooks. This is FUGLY. 
		if(channel.match(/^[^\/]+\/ready$/) || this._hooked[channel]) {
			this._hooked[channel] = _.uniq(this._hooked[channel], queues);
			return;
		} 
		
		this._hooked[channel] = queues || [];
		
		//router
		var r        = this._router,

		//routes to ignore - incomming remote calls are ignored
		ignore       = this._ignore,

		//transport to use - JSONP? AMQP?
		transport    = this._transport,

		//transactions ~ push/pull 
		transactions = this._transactions,

		//data that should be sent back and forth whenever there's a request
		stickyData   = this._collection._stickyData,

		self = this,

		scope = this._getQueue(channel);


		
		try
		{

			//this is a bug since hooked & unfilterable get filtered out
			if(r.has('pull ' + channel)) throw new Error('Hook exists');


			r.on('pull -hooked=true -unfilterable=true ' + channel, function(request)
			{                                        
				if(ignore[request.currentChannel]) return;
				
				Structr.copy(stickyData, request.data, true);      
				
				// console.log(channel);
				// console.log(self._hooked[channel]);
				// console.log(self.scope)

				request.queue = request.queue || self._getQueue(channel);

				// console.log(request.currentChannel);
				// console.log(request.queue);
				
				transactions.create(request.currentChannel).prepare('pull', request).register({ timeout: self._killTImeout }).send().onEnd('response', function(response)
				{
					request.end(response);
				});
			});
			
			r.on('push -hooked=true -unfilterable=true ' + channel, function(data)
			{                              
				if(ignore[this.currentChannel]) return;
				Structr.copy(stickyData, this.data, true);   
				                                     
				this.queue = this.queue || self._getQueue(channel);

				
				transactions.create(this.currentChannel).prepare('push', this).send();
			});
		}
		
		//probably already exists
		catch(e)
		{
			console.warn('Unable to hook %s', channel);
		}
	}
});


module.exports = Structr({
	
	/**
	 */
	
	'__construct': function(router, scope)
	{
		this._router = router;
		this._transports = [];
		this._stickyData = {}
		this.scope = scope;
	},
	
	/**
	 */
	
	'addStickyData': function(data)
	{
		Structr.copy(data || {}, this._stickyData, true);
	},
	
	/**
	 */
	
	'publishHooks': function(hooks)
	{
		this._transports.forEach(function(transport)
		{
			transport.publishHooks(hooks);
		});
	},
	
	/**
	 */
	
	'add': function(transport)
	{
		var wrapper = new TransportWrapper(this, transport);
		
		this._transports.push(wrapper);
		
		//TODO: public hooks should be dynamic
		wrapper.publishHooks(utils.publicChannels(this._router.channels()));
	}
});
});

_sardines.register("/node_modules/daisy/lib/beans/hooks.core/index.js", function(require, module, exports, __dirname, __filename) {
	var utils = require('./utils'),
Transports = require('./transports'),
vine = require('vine');

	
exports.plugin = function(router, params)
{
	if(!params.name) throw new Error('A name must be provided for your app');
	
	//target hooks
	var target = params.target || params.transport || {},
	transports = new Transports(router, params.scope),
	transportTypes = {};

	
	router.on({
		
		/**
		 */
		
		'pull -public hooks': function()
		{
			return vine.result(utils.publicChannels(router.channels())).end();
		},
		
		/**
		 * data that's passed to hooks on every request, such as access tokens
		 */
		
		'push hooks/sticky/data OR hooks/data': function(data)
		{
			transports.addStickyData(data);
		},
		
		/**
		 */
		
		'push channels': function(channels)
		{
			var pubChannels = utils.publicChannels(channels);
			
			if(!pubChannels.length) return;
			
			transports.publishHooks(pubChannels);
		},
		
		/**
		 */
		
		'push hooks/connect/:type': function(cfg)
		{
			cfg.name = params.name;
			
			transports.add(transportTypes[cfg.type].connect(cfg));
		},
		
		/**
		 */
		
		'push hooks/transport': function(transport)
		{
			transportTypes[transport.name] = transport;
			
			//a target hook? use it, or lose it.
			if(target[transport.name])
			{
				
				//can be multiple hooks to a particular transport.
				var transportConfigs = target[transport.name];
				
				if(!(transportConfigs instanceof Array)) transportConfigs = [transportConfigs];
				
				
				transportConfigs.forEach(function(cfg)
				{
					//set the queue name
					cfg.name = params.name;
					
					transports.add(transport.connect(cfg));
				})
			}
		}
	});
}
});

_sardines.register("/node_modules/sk/core/queue.js", function(require, module, exports, __dirname, __filename) {
	var sk = require('./events');

exports.Queue = {
	running:false,
	runNext:true,
	waiting:false,
	autoStart:false,
	'override __construct':function(autoStart)
	{
		this._super();
		this.autoStart = autoStart;
		this.stack = [];
	}
	,unshift:function(callback)
	{
		this.stack.unshift(callback);

		if(this.autoStart)
		this.start();
	},
	remove:function(callback)
	{
		var i = this.stack.indexOf(callback);
		if(i > -1)
		{
			this.stack.splice(i,1);
			return true;
		}
		return false;
	},
	add:function(callback)
	{
		this.stack.push(callback);

		if(!callback) throw new Error('callbacks cannot be undefined');

		if(this.autoStart)
		this.start();
	},
	start:function(force)
	{                         
		if((this.running || !this.runNext) && !force)
		return false;

		this.autoStart = true;

		if(!this.stack.length)
		{                           
			this.running = false;
			return this.emit('complete');
		}                         

		var callback = this.stack.shift();


		this.emit('cue',callback) 

		this.running = true;

		callback(this.getMethod('next'));
	},
	stop:function()
	{
		this.runNext = false;
	},
	next:function()
	{
		this.running = false;
		this.start();
	},
	clear:function()
	{
		this.stack = [];
	}             
} 

exports.Queue = sk.EventEmitter.extend(exports.Queue);


//executes items in batches
exports.BatchQueue = exports.Queue.extend({
	'override __construct': function (autoStart, max)
	{ 
		this.numRunning = 0;
		this._super(autoStart);
		this.max = max || 5;   
		var s = this;
 
		this.addListener('cue',function ()
		{                      
			s.numRunning++;
		})
	}
	,'override start':function ()
	{                     
		this._super(this.numRunning < this.max);
	},
	'override next': function ()
	{
		if(this.numRunning > 0)
			this.numRunning--;
		
		this._super();
	}
});


});

_sardines.register("/node_modules/fig/lib/web/index.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr');
// Queue = require('sk/core/queue').Queue;

Structr.copy(require('../index'), module.exports);


exports.plugin = function(router)
{
	// var q = new Queue();

	router.on('pull render/view', function(request)
	{
		var view = request.data;
		

		view.setup({ el: window.document, $: $ }).init({
			complete: function()
			{
				request.end();
			}
		});
	});
}
});

_sardines.register("/node_modules/daisy/lib/beans/hooks.jsonp/transport.js", function(require, module, exports, __dirname, __filename) {
	var Structr = require('structr'),
qs = require('querystring');

exports.name = 'jsonp';

var Transport = Structr({
	
	/**
	 */
	
	'__construct': function(params)
	{
		this.host = params.host;
		this.protocol = params.protocol || 'http:';
		
		this.connect();
	},
	
	/**
	 */
	
	'connect': function()
	{
		var self = this;
		
		$.ajax({
			url: this.protocol + '//' + this.host + '/hooks.json',
			dataType: 'jsonp',
			success: function(response)
			{
				self.onHandshake({
					apps: [self.host],
					hooks: response.result
				})
			}
		});
		
		
	},
	
	/**
	 */
	
	'broadcast': function(channel, message, headers) 
	{
		var self = this;
		
		//don't return basic auth
		message.basicAuth = false;
		
		//not everything supports DELETE UPDATE
		message.httpMethod = headers.meta.method || 'GET';
		
		$.ajax({
			url: this.protocol + '//' + this.host + '/' + channel + '.json?json=' + encodeURIComponent(JSON.stringify(message)),
			dataType: 'jsonp',
			success: function(response)
			{
				headers.type = !headers.hasNext || response.errors ? 'response' : 'next';
				
				self.onMessage(response, headers, self.host);
			}
		});
	},
	
	/**
	 * stuff we can't use for jsonp
	 */
	
	'publishHooks': function(hooks) { },
	'direct': function(queue, message, headers) { },
	
	/** 
	 * Returned hooks, and any siblings on the network
	 */

	'onHandshake': function(handshake) { },

	/**
	 * when a call is coming in
	 */

	'onMessage': function(message, headers, from) { }

});


exports.connect = function(params)
{
	return new Transport(params);
}
});

_sardines.register("/node_modules/daisy/lib/beans/hooks.jsonp/index.js", function(require, module, exports, __dirname, __filename) {
	
exports.plugin = function(router)
{
	router.on({
		/**
		 */

		'push init': function()
		{
			router.push('hooks/transport', require('./transport'));
		}
	})
}
});

_sardines.register("/leche.tmp.js", function(require, module, exports, __dirname, __filename) {
	var web = require("/Users/craig/Dropbox/Developer/Public/leche/lib/web.js");
var beanpole = require("beanpole/lib/core");
var router = beanpole.router(),
malt = require('malt');
var beans = ["/node_modules/client/public-src/web/beans/app.core/index.js","/node_modules/client/public-src/web/beans/auth.core/index.js","/node_modules/client/public-src/web/beans/virt.core/index.js","/node_modules/leche.core/shared/beans/malt.core/index.js","/node_modules/leche.core/shared/beans/views.core/index.js","/node_modules/leche.spice.io/shared/beans/connect.core/index.js","/node_modules/leche.spice.io/shared/beans/spice.io.core/index.js","/node_modules/leche.spice.io/web/beans/connect.core/index.js","/node_modules/leche/lib/web/beans/alert.core/index.js","/node_modules/leche/lib/web/beans/element.core/index.js","/node_modules/leche/lib/web/beans/history.core/index.js","/node_modules/leche/lib/web/beans/store.core/index.js","/node_modules/leche/lib/web/beans/template.core/index.js"];
for(var i = beans.length; i--;)
{
	require(beans[i]).plugin(router);
}
require('daisy/lib/beans/hooks.core').plugin(router, {
	name: "web-app"
});
malt.plugin(router);
require('fig/lib/web').plugin(router);
require('daisy/lib/beans/hooks.jsonp').plugin(router);
});

var entries = [_sardines.require("/leche.tmp.js")],
	module = {};

for(var i = entries.length; i--;)
{
	var entry = entries[i];
	
	for(var property in entry)
	{
		module[property] = entry[property];
	}
}

return module;


})();


if(typeof module != 'undefined') module.exports = sardines;