(function() {
  var EventEmitter, server,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  server = require("./proxy/server");

  EventEmitter = require("events").EventEmitter;

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    _Class.prototype.config = function(config) {
      this.directory = config.directory;
      return this;
    };

    /*
    */

    _Class.prototype.listen = function(port) {
      var em,
        _this = this;
      em = server.listen(port);
      em.on("browserProxy", function(proxy) {
        return _this.emit("browserProxy", proxy);
      });
      return this;
    };

    return _Class;

  })(EventEmitter);

}).call(this);
