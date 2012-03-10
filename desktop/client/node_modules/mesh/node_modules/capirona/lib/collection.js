(function() {
  var TaskDirector, TaskMessenger, Tasks, beanpoll, dolce, outcome, path, structr, _,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  outcome = require("outcome");

  _ = require("underscore");

  beanpoll = require("beanpoll");

  structr = require("structr");

  dolce = require("dolce");

  path = require("path");

  /*
  */

  TaskMessenger = (function(_super) {

    __extends(TaskMessenger, _super);

    function TaskMessenger() {
      TaskMessenger.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    TaskMessenger.prototype._next = function(middleware) {
      var _this = this;
      structr.copy(this.flattenData(), this.request.query);
      return middleware.listener.call(this, this.request.query, this.response.success(function() {
        return _this.next();
      }));
    };

    return TaskMessenger;

  })(beanpoll.Messenger);

  /*
  */

  TaskDirector = (function(_super) {

    __extends(TaskDirector, _super);

    function TaskDirector() {
      TaskDirector.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    TaskDirector.prototype.passive = false;

    /*
    */

    TaskDirector.prototype._newMessenger = function(request, middleware) {
      return new TaskMessenger(request, middleware, this);
    };

    return TaskDirector;

  })(beanpoll.Director);

  /*
   collection of builders loaded from configurations
  */

  module.exports = Tasks = (function() {
    /*
    */
    function Tasks(factory, makeConfig) {
      var _this = this;
      this.factory = factory;
      this.makeConfig = makeConfig;
      this.factory.tasks = this;
      this._router = beanpoll.router();
      this._tasks;
      this._router.use(function() {
        return {
          name: 'task',
          director: new TaskDirector('task', _this._router)
        };
      });
    }

    /*
    */

    Tasks.prototype.load = function(rawTasks, inherit) {
      var route, routeStr, task, taskData, _i, _len, _ref;
      for (routeStr in rawTasks) {
        _ref = this._parseTaskName(routeStr, inherit);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          route = _ref[_i];
          taskData = rawTasks[routeStr];
          task = this.factory.newTask(route, taskData);
          if (task) {
            this.add(task);
          } else {
            this.load(taskData, route);
          }
        }
      }
      return this;
    };

    /*
    */

    Tasks.prototype._parseTaskName = function(routeStr, inherit) {
      var fixed, route, routes, _i, _len;
      fixed = routeStr;
      routes = this._router.parse(fixed);
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        route = this._extendRoute(route, inherit);
      }
      return routes;
    };

    /*
    */

    Tasks.prototype._extendRoute = function(target, parent) {
      var parentCopy, realPathStr, thru;
      if (!parent) return target;
      parentCopy = structr.copy(parent);
      realPathStr = this._router.parse.stringifySegments(parentCopy.path.segments.concat(target.path.segments));
      target.path = this._router.parse.parsePath(realPathStr);
      thru = target;
      while (thru.thru) {
        thru = this._fixThru(thru.thru, parent);
      }
      thru.thru = parentCopy.thru;
      return target;
    };

    /*
    */

    Tasks.prototype._fixThru = function(target, route) {
      var normalized, rpv, tpv;
      tpv = target.path.value;
      rpv = route.path.value;
      normalized = tpv;
      if (tpv.substr(0, 1) === '.') normalized = path.normalize(rpv + "/" + tpv);
      target.path = this._router.parse.parsePath(normalized);
      return target;
    };

    /*
    */

    Tasks.prototype._fixPath = function(path) {
      return path.replace(/:/g, '/').replace(/\{\{(\w+)\}\}/g, ':$1');
    };

    /*
    */

    Tasks.prototype.add = function(task) {
      var self;
      self = this;
      task.route.type = "task";
      return this._router.on(task.route, function(target, next) {
        target.currentPath = self._router.parse.stringifySegments(this.current.path.segments, target);
        return task.run(target, next);
      });
    };

    /*
    */

    Tasks.prototype.run = function(path, target, next) {
      return this._router.request(this._fixPath(path)).query(target).next(function(target, next) {
        return this.response.end();
      }).error(next).success(next).dispatch('task');
    };

    return Tasks;

  })();

}).call(this);
