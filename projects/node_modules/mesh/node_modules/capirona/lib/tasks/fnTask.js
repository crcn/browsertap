(function() {
  var BaseTask, LogTask, outcome, seq, tpl,
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

  module.exports = LogTask = (function(_super) {

    __extends(LogTask, _super);

    function LogTask() {
      LogTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    LogTask.prototype.load = function(fn) {
      this.fn = fn;
    };

    /*
    */

    LogTask.prototype._run = function(target, next) {
      return this.fn.call(this, target, next);
    };

    return LogTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return config instanceof Function;
  };

}).call(this);
