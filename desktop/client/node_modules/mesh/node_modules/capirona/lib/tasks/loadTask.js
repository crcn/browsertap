(function() {
  var BaseTask, LoadTask, fs, path, structr, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  fs = require("fs");

  structr = require("structr");

  path = require("path");

  tpl = require("../tpl");

  /*
   builds from a .js file
  */

  module.exports = LoadTask = (function(_super) {

    __extends(LoadTask, _super);

    function LoadTask() {
      LoadTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    LoadTask.prototype.load = function(ops) {
      this.cfg = ops.load;
      this.cwd = ops.cwd || path.dirname(ops.load);
      return this.cfgDir = this.tasks.makeConfig.pathDir;
    };

    /*
    	 passes the build phase @
    */

    LoadTask.prototype._run = function(target, next) {
      var cwd, makeConfig;
      makeConfig = this.tasks.makeConfig;
      cwd = tpl.render(this.cwd, target);
      return makeConfig.load(this._cfgPath(target), {
        cwd: cwd
      }, function(err, result) {
        if (err) return next(err);
        structr.copy(result.config, target);
        target.cwd = cwd;
        return next();
      });
    };

    /*
    */

    LoadTask.prototype._taskMessage = function(target) {
      return "loading ./" + (path.relative(this.cfgDir, this._cfgPath(target)));
    };

    /*
    */

    LoadTask.prototype._cfgPath = function(target) {
      return tpl.render(this.cfg, target);
    };

    return LoadTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.load;
  };

}).call(this);
