(function() {
  var Application, EventEmitter,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventEmitter = require("events").EventEmitter;

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    /*
    	 @param name the name of the application ~ IE 6, IE 7, IE 8
    	 @processGroup the process group
    */

    function Application(name, processGroup) {
      this.name = name;
      this.processGroup = processGroup;
    }

    /*
    */

    return Application;

  })(EventEmitter);

}).call(this);
