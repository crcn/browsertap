(function() {
  var Factory, fs, outcome, path, step;

  fs = require("fs");

  path = require("path");

  step = require("stepc");

  outcome = require("outcome");

  /*
   creates new builders based on configs given
  */

  module.exports = Factory = (function() {
    /*
    */
    function Factory() {
      this._classes = [];
    }

    /*
    	 adds a builder class - must also be a tester
    */

    Factory.prototype.add = function(clazz) {
      return this._classes.push(clazz);
    };

    /*
    	 returns a new builder based on the options given. CWD is also
    	 important since SOME builders may load from disc
    */

    Factory.prototype.newTask = function(name, ops, parent) {
      var clazz, task, _i, _len, _ref;
      _ref = this._classes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clazz = _ref[_i];
        if (clazz.test(ops)) {
          task = new clazz(name, this.tasks, parent);
          task.load(ops);
          return task;
        }
      }
      return null;
    };

    return Factory;

  })();

}).call(this);
