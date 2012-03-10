
/*
 base builder interface
*/

(function() {

  exports.Task = (function() {
    /*
    */
    function _Class(route, tasks, parent) {
      this.route = route;
      this.tasks = tasks != null ? tasks : null;
      this.parent = parent != null ? parent : null;
    }

    /*
    	 load from raw config
    */

    _Class.prototype.load = function(ops) {};

    /*
    	 start the build phase
    */

    _Class.prototype.run = function(target, next) {
      this.validate(target);
      if (this.route) {
        target.namespace = this.route.path.value;
        target.currentTask = this.route.path.value.split('/').pop();
      }
      this._printMessage(target);
      return this._run(target, next);
    };

    /*
    */

    _Class.prototype.validate = function(target) {
      var name, params, tester, tv, value, _results;
      params = this._params();
      _results = [];
      for (name in params) {
        tester = this._tester(params[name]);
        tv = this._ref(target, name);
        if (typeof tv === 'undefined') {
          throw new Error("\"--" + name + "\" is missing");
        }
        try {
          value = tester.test(tv);
          if (value === false) throw new Error("is invalid");
          if (!(typeof value === 'boolean')) {
            _results.push(this._ref(target, name, value));
          } else {
            _results.push(void 0);
          }
        } catch (e) {
          throw new Error("\"--" + name + "\" " + e.message);
        }
      }
      return _results;
    };

    /*
    */

    _Class.prototype._tester = function(value) {
      if (value instanceof RegExp) return value;
      if (typeof value === 'function') {
        return {
          test: function(v) {
            return value(v);
          }
        };
      }
      return {
        test: function() {
          return true;
        }
      };
    };

    /*
    */

    _Class.prototype._ref = function(target, property, value) {
      var cur, parts, prev, prevPart;
      cur = target;
      prev = target;
      parts = property.split(".");
      prevPart = null;
      while (parts.length && cur) {
        prevPart = parts[0];
        prev = cur;
        cur = cur[parts.shift()];
      }
      if (arguments.length > 2) prev[prevPart] = value;
      return cur;
    };

    /*
    */

    _Class.prototype._params = function() {
      return this.params;
    };

    /*
    */

    _Class.prototype._run = function(target, next) {};

    /*
    */

    _Class.prototype._printMessage = function(target) {
      var message;
      message = this._taskMessage(target);
      if (message) return console.log("" + (this._pointer()) + message);
    };

    /*
    */

    _Class.prototype._taskMessage = function(target) {
      if (this.route) return "make " + target.currentPath;
    };

    /*
    */

    _Class.prototype._pointer = function() {
      return "---> ";
    };

    return _Class;

  })();

  module.exports.test = function() {
    return false;
  };

}).call(this);
