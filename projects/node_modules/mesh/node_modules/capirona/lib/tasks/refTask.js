(function() {
  var BaseTask, RefTask, path, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  tpl = require("../tpl");

  path = require("path");

  /*
   references another builder
  */

  module.exports = RefTask = (function(_super) {

    __extends(RefTask, _super);

    function RefTask() {
      RefTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    RefTask.prototype.load = function(taskName) {
      this.taskName = taskName;
    };

    /*
    	 passes the build phase
    */

    RefTask.prototype._run = function(target, next) {
      return this.factory.commands.run(this._find(target), target, next);
    };

    /*
    */

    RefTask.prototype._printMessage = function() {};

    /*
    */

    RefTask.prototype._find = function(target) {
      var relPath, tg;
      relPath = this.taskName.indexOf("<%") > -1 ? tpl.render(this.taskName, target) : this.taskName;
      tg = this.route ? this : this._findInheritable();
      if (tg && relPath.substr(0, 1) === '.') {
        relPath = path.normalize(tg.route.path.value + "/" + relPath);
      }
      return relPath;
    };

    return RefTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return typeof config === "string";
  };

}).call(this);
