var sardines = (function(){
	Array.prototype.forEach = function(callback) {
	for(var i = 0, n = this.length; i < n; i++) {
		callback(this[i], i);
	}
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
		var fullPath = req.resolve(path, cwd || '/');

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

	//turns user//local/../../bin/./path to bin/path
	function normalizePath(path)
	{
		var pathParts = path.split(/\/+/g);

		for(var i = 0, n = pathParts.length; i < n; i++)
		{
			var part = pathParts[i];

			if(part == '..')
			{
				pathParts.splice(i - 1, 2);
				i-=2;
			}
			else
			if(part == '.')
			{
				pathParts.splice(i, 1);
				i--;
			}
		}


		return pathParts.join('/')
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

_sardines.register("/keyboard.js", function(require, module, exports, __dirname, __filename) {
	
});

_sardines.register("/mouse.js", function(require, module, exports, __dirname, __filename) {
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

moudle.exports = function(remote) {
	

}


});

_sardines.register("/index.js", function(require, module, exports, __dirname, __filename) {
	var keyboard = require('./keyboard'),
mouse = require('./mouse');


var DesktopView = Backbone.View.extend({
	
	initialize: function() {

		$(this.el).html('<div id="swf-content"></div>');

		swfobject.embedSWF("./DesktopPlayer.swf", 
		"swf-content", 
		"100%", 
		"100%", 
		"9.0.0",
		"expressInstall.swf",
		{ server: this.server },
		{ allowscriptaccess: 'always', menu: false });
	}
});


var ControlView = Backbone.View.extend({
	
	initialize: function() {
		
	}
});



$(window).ready(function() {
	
	new DesktopView({ el: '#desktop', server: 'rtmp://localhost:1935/live' });
	new ControlView({ el: '#controls' });
})
});

var entries = [_sardines.require("/index.js")],
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