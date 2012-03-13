(function() {
  var BaseTask, SkipTask, outcome, seq, structr,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  seq = require("seq");

  BaseTask = require("./base").Task;

  outcome = require("outcome");

  structr = require("structr");

  /*
   a chain of builders
  
   Example:
  
   "firefox":["combine","compile-firefox"]
  */

  module.exports = SkipTask = (function(_super) {

    __extends(SkipTask, _super);

    function SkipTask() {
      SkipTask.__super__.constructor.apply(this, arguments);
    }

    SkipTask.prototype.load = function(config) {};

    SkipTask.prototype._run = function(ops, next) {
      return next();
    };

    SkipTask.prototype._printMessage = function() {};

    return SkipTask;

  })(BaseTask);

  module.exports.test = function() {
    return true;
  };

  module.exports.priority = -9999999;

}).call(this);
