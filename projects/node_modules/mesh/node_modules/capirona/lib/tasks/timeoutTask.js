(function() {
  var BaseTask, TimeoutTask, outcome, seq, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  seq = require("seq");

  BaseTask = require("./base").Task;

  outcome = require("outcome");

  tpl = require("../tpl");

  /*
   a chain of builders
  
   Example:
  
   "firefox":["combine","compile-firefox"]
  */

  module.exports = TimeoutTask = (function(_super) {

    __extends(TimeoutTask, _super);

    function TimeoutTask() {
      TimeoutTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    TimeoutTask.prototype.load = function(ops) {
      return this.timeout = ops.sleep;
    };

    /*
    */

    TimeoutTask.prototype._run = function(target, next) {
      return setTimeout(next, this.timeout);
    };

    return TimeoutTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return config.sleep;
  };

}).call(this);
