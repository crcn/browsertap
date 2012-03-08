(function() {
  var Application, ApplicationManager, EventEmitter,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventEmitter = require("events").EventEmitter;

  Application = require("./Application");

  module.exports = ApplicationManager = (function(_super) {

    __extends(ApplicationManager, _super);

    /*
    */

    function ApplicationManager() {
      this._applications = {};
    }

    /*
    */

    ApplicationManager.prototype.addApplication = function(info) {
      if (!!this._applications[info.name]) {
        throw new Error("application " + info.name);
      }
      return this._applications[info.name] = new Application(info.name, info.processGroup);
    };

    /*
    */

    ApplicationManager.prototype.getApplication = function(name) {
      return this._applications[name];
    };

    return ApplicationManager;

  })(EventEmitter);

}).call(this);
