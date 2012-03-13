(function() {
  var BaseTask, ShellTask, exec, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  tpl = require("../tpl");

  exec = require("child_process").exec;

  /*
   executes a shell script
  */

  module.exports = ShellTask = (function(_super) {

    __extends(ShellTask, _super);

    function ShellTask() {
      ShellTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    ShellTask.prototype.load = function(ops) {
      return this.exec = ops.exec;
    };

    /*
    	 passes the build phase
    */

    ShellTask.prototype._run = function(target, next) {
      var child, cmd;
      cmd = this._cmd(target);
      child = exec(cmd, {
        cwd: target.cwd,
        maxBuffer: 0
      }, next);
      child.stdout.removeAllListeners('data');
      child.stderr.removeAllListeners('data');
      child.stdout.on('data', function(data) {
        return process.stdout.write(data);
      });
      return child.stderr.on('data', function(data) {
        return process.stderr.write(data);
      });
    };

    /*
    */

    ShellTask.prototype._taskMessage = function(target) {
      return this._cmd(target);
    };

    /*
    */

    ShellTask.prototype._cmd = function(target) {
      return tpl.render(this.exec, target);
    };

    return ShellTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.exec;
  };

}).call(this);
