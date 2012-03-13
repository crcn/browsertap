(function() {
  var RootTask, TaskFactory, crc32, fileRegexp, fileRegexp2, path, plugin;

  TaskFactory = require("./factory");

  crc32 = require("crc32");

  plugin = require("plugin");

  require("colors");

  path = require("path");

  fileRegexp = /(\s+\/([^\/\s]+\/)+[^\/\s]+)/;

  fileRegexp2 = /(\s+\/([^\/\s]+\/)+[^\/\s]+)/g;

  require("colorcode").code(/\==> (\w+)/, "==>".cyan + " $1".magenta).code(/\==> load (.*)/, "==> ".cyan + "load".magenta.bold + " $1".bold).code(/( -> )/, "$1".yellow).code(/( \+ )/g, "$1".yellow).code(fileRegexp, function(value) {
    value.match(fileRegexp2).forEach(function(file) {
      return value = value.replace(file, " " + path.relative(process.cwd(), file.replace(/\s+/g, "")));
    });
    return value;
  }).error(function(msg) {
    return String(msg).stripColors.bold.red;
  }).info(function(msg) {
    return String(msg).stripColors.grey;
  })["export"](console);

  /* 
   the mesh config value object
  */

  RootTask = (function() {
    /*
    */
    function RootTask(rawTasks) {
      this.taskFactory = new TaskFactory(this);
      this._loadPlugins(this.taskFactory, __dirname + "/tasks");
      this.entryTask = this.taskFactory.newTask(null, rawTasks);
    }

    /*
    	 loads a config from disc - important because they MAY contain
    	 scripts - in which case we'll need the CWD
    */

    RootTask.prototype.run = function(target, complete) {
      if (typeof target === 'function') {
        complete = target;
        target = {};
      }
      target.buildId = crc32(String(Date.now()));
      return this.entryTask.run(target, complete);
    };

    /*
    	 loads plugins for task factory, or config loader
    */

    RootTask.prototype._loadPlugins = function(factory, directories) {
      return plugin.loader().factory(function(plugin) {
        return factory.add(plugin);
      }).require(directories).load();
    };

    return RootTask;

  })();

  exports.make = function() {
    return new RootTask(Array.apply([], arguments));
  };

}).call(this);
