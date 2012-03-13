(function() {
  var BaseTask, IncludeTask, fs, path, structr,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  fs = require("fs");

  structr = require("structr");

  path = require("path");

  /*
   builds from a .js file
  */

  module.exports = IncludeTask = (function(_super) {

    __extends(IncludeTask, _super);

    function IncludeTask() {
      IncludeTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    IncludeTask.prototype.load = function(ops) {
      var cfg, dirpath, file, fullPath, include, regex, route, usable, _i, _j, _len, _len2, _ref, _results;
      regex = new RegExp(ops.include.replace('*', '.*?'));
      dirpath = path.dirname(ops.include);
      usable = [];
      _ref = fs.readdirSync(dirpath);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        fullPath = "" + dirpath + "/" + file;
        if (regex.test(fullPath)) usable.push(fullPath);
      }
      _results = [];
      for (_j = 0, _len2 = usable.length; _j < _len2; _j++) {
        include = usable[_j];
        route = structr.copy(this.route);
        cfg = JSON.parse(fs.readFileSync(include, "utf8"));
        _results.push(this.tasks.load(cfg, route));
      }
      return _results;
    };

    /*
    	 passes the build phase @
    */

    IncludeTask.prototype._run = function(target, next) {
      return next();
    };

    return IncludeTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.include;
  };

}).call(this);
