(function() {
  var structr;

  structr = require("structr");

  /*
   base builder interface
  */

  exports.Task = (function() {
    /*
    */
    function _Class(route, factory, parent) {
      this.route = route;
      this.factory = factory;
      this.parent = parent != null ? parent : null;
      this.init();
    }

    /*
    */

    _Class.prototype.init = function() {};

    /*
    	 load from raw config
    */

    _Class.prototype.load = function(ops) {};

    /*
    	 start the build phase
    */

    _Class.prototype.run = function(target, next) {
      var scopedData;
      this.validate(target);
      if (this.route) {
        target.namespace = this.route.path.value;
        target.currentTask = this.route.path.value.split('/').pop();
      }
      scopedData = this._copyCurrentScopedData(target);
      this._printMessage(scopedData);
      return this._run(scopedData, next);
    };

    /*
    	 creates a child task with this as the parent
    */

    _Class.prototype.childTask = function(route, ops) {
      return this.factory.newTask(route, ops, this);
    };

    /*
    	 validates to make sure this task as the right data
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
    	 returns a new validation tester
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
    	 returns a reference to an object for validation
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
    	 the required params for the task
    */

    _Class.prototype._params = function() {
      return this.params;
    };

    /*
    	 overridable method for running the task
    */

    _Class.prototype._run = function(target, next) {};

    /*
    	 prints the CLI task message
    */

    _Class.prototype._printMessage = function(target) {
      var message;
      message = this._taskMessage(target);
      if (message) return console.log("==> " + message);
    };

    /*
    	 the task message to show
    */

    _Class.prototype._taskMessage = function(target) {
      if (this.route) return "" + target.currentPath;
    };

    /*
    	 copies the LIVE parent data - this is similar to setting
    	 a variable scope
    */

    _Class.prototype._copyCurrentScopedData = function(target) {
      var cp, pc, pd;
      pd = structr.copy(this.currentData);
      cp = this;
      while (cp.parent) {
        pc = structr.copy(cp.parent.currentData);
        if (cp.parent.currentData) pd = structr.copy(pd, pc);
        cp = cp.parent;
      }
      target.cwd = pd.cwd || target.cwd;
      return structr.copy(target, pd);
    };

    /*
    */

    _Class.prototype._findInheritable = function() {
      var cr;
      cr = this;
      while (cr) {
        if (cr.route) break;
        cr = cr.parent;
      }
      return cr;
    };

    return _Class;

  })();

  /*
  */

  module.exports.test = function() {
    return false;
  };

}).call(this);
