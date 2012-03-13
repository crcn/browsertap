(function() {
  var BaseTask, ScreiptTask,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  /*
   builds from a .js file
  */

  module.exports = ScreiptTask = (function(_super) {

    __extends(ScreiptTask, _super);

    function ScreiptTask() {
      ScreiptTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    ScreiptTask.prototype.load = function(ops) {
      return this.task = require(ops.script);
    };

    /*
    	 passes the build phase
    */

    ScreiptTask.prototype._run = function(target, next) {
      return this.task.run.call(this, target, next);
    };

    /*
    */

    ScreiptTask.prototype._taskMessage = function(target) {
      if (this.task.taskMessage) {
        return this.task.taskMessage(target);
      } else {
        return ScreiptTask.__super__._taskMessage.call(this, target);
      }
    };

    /*
    */

    ScreiptTask.prototype._params = function() {
      return this.task.params;
    };

    return ScreiptTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.script;
  };

}).call(this);
