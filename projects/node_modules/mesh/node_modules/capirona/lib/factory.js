(function() {
  var Commands, Factory, fs, outcome, path, step;

  fs = require("fs");

  path = require("path");

  step = require("stepc");

  outcome = require("outcome");

  Commands = require("./commands");

  /*
   creates new builders based on configs given
  */

  module.exports = Factory = (function() {
    /*
    */
    function Factory() {
      this._classes = [];
      this.commands = new Commands(this);
    }

    /*
    	 adds a builder class - must also be a tester
    */

    Factory.prototype.add = function(clazz) {
      if (!clazz.priority) clazz.priority = 0;
      this._classes.push(clazz);
      return this._classes = this._classes.sort(function(a, b) {
        if (a.priority > b.priority) {
          return -1;
        } else {
          return 1;
        }
      });
    };

    /*
    	 returns a new builder based on the options given. CWD is also
    	 important since SOME builders may load from disc
    */

    Factory.prototype.newTask = function(route, ops, parent) {
      var clazz, task, _i, _len, _ref;
      _ref = this._classes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clazz = _ref[_i];
        if (clazz.test(ops)) {
          task = new clazz(route, this, parent);
          task.load(ops);
          return task;
        }
      }
      return null;
    };

    return Factory;

  })();

}).call(this);
