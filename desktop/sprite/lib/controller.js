(function() {
  var EventEmitter, loadDirectory, server, tq,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  server = require("./proxy/server");

  EventEmitter = require("events").EventEmitter;

  loadDirectory = require("./load/loadDirectory");

  tq = require("tq");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    /*
    */

    function _Class() {
      this._tq = tq.queue().start();
    }

    /*
    */

    _Class.prototype.config = function(config) {
      var self;
      self = this;
      this._tq.push(function() {
        var _this = this;
        return loadDirectory(config.directory, function(err, browsers) {
          console.log(browsers);
          return _this;
        });
      });
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

    /*
    */

    _Class.prototype.start = function(browser, url) {
      return this._tq.add(function() {});
    };

    return _Class;

  })(EventEmitter);

}).call(this);
