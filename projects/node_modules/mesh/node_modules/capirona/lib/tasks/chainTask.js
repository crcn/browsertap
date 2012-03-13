(function() {
  var BaseTask, ChainedTask, outcome, seq, structr,
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

  module.exports = ChainedTask = (function(_super) {

    __extends(ChainedTask, _super);

    function ChainedTask() {
      ChainedTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    ChainedTask.prototype.load = function(config) {
      var cfg, rawTask, _i, _len, _ref, _results;
      cfg = {};
      if (config instanceof Array) {
        cfg.chain = config;
      } else {
        cfg = config;
      }
      this.parallel = !!cfg.parallel;
      this.chains = [];
      _ref = cfg.chain;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rawTask = _ref[_i];
        _results.push(this.chains.push(this.childTask(null, rawTask, this)));
      }
      return _results;
    };

    /*
    */

    ChainedTask.prototype._printMessage = function() {};

    /*
    */

    ChainedTask.prototype._run = function(target, next) {
      var fn, self;
      self = this;
      fn = this.parallel ? 'parEach' : 'seqEach';
      return seq(this.chains)[fn](function(chain) {
        var _this = this;
        return chain.run(target, outcome.error(next).success(function() {
          return _this();
        }));
      }).seq(function() {
        return next();
      });
    };

    return ChainedTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return (config instanceof Array) || (config.chain instanceof Array);
  };

}).call(this);
