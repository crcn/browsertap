(function() {
  var EventEmitter, Launcher, child_process, exec, spawn,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventEmitter = require("events").EventEmitter;

  child_process = require("child_process");

  exec = child_process.exec;

  spawn = child_process.spawn;

  module.exports = Launcher = (function(_super) {

    __extends(Launcher, _super);

    /*
    */

    function Launcher(app) {
      this.app = app;
      Launcher.__super__.constructor.call(this);
    }

    /*
    */

    Launcher.prototype.load = function(path) {
      this.emit("loading");
      if (process.platform === "win32") return this._loadWin32(path);
    };

    /*
    */

    Launcher.prototype.kill = function() {};

    /*
    	 starts a windows process
    */

    Launcher.prototype._loadWin32 = function(toOpen) {
      var proc,
        _this = this;
      proc = spawn("start", ["/MAX", "/HIGH", this.app.path, toOpen]);
      proc.stdout.on("data", function(data) {
        return _this.emit("stdout", data);
      });
      return proc.stderr.on("data", function(data) {
        return _this.emit("stderr", data);
      });
    };

    /*
    */

    Launcher.prototype._loadUnix = function() {
      throw new Error("not supported yet");
    };

    return Launcher;

  })(EventEmitter);

}).call(this);
