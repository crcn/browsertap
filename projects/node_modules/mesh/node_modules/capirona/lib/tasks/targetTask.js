(function() {
  var BaseTask, TargetTask, structr, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  structr = require("structr");

  tpl = require("../tpl");

  /*
   the ENTRY point into the build system
  */

  module.exports = TargetTask = (function(_super) {

    __extends(TargetTask, _super);

    function TargetTask() {
      TargetTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    TargetTask.prototype.load = function(target) {
      this.target = target;
      this.task = this.childTask(null, this.target.task || this.target.tasks || this.target.commands);
      delete this.target.tasks;
      return delete this.target.commands;
    };

    /*
    	 passes the build phase
    */

    TargetTask.prototype._run = function(target, next) {
      var newConfig, obj, oldConfig, renderedConfig;
      obj = {};
      oldConfig = structr.copy(target);
      newConfig = this.target;
      oldConfig = structr.copy(newConfig, oldConfig);
      renderedConfig = tpl.render(newConfig, oldConfig);
      target = structr.copy(renderedConfig, target);
      this.currentData = target;
      obj = target;
      return this.task.run(obj, next);
    };

    /*
    */

    TargetTask.prototype._printMessage = function() {};

    return TargetTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.task || !!config.tasks || !!config.commands;
  };

}).call(this);
