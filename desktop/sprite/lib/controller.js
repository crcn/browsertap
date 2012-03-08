(function() {
  var server;

  server = require("./proxy/server");

  module.exports = (function() {

    function _Class() {}

    /*
    */

    _Class.prototype.config = function(config) {
      this.directory = config.directory;
      return this;
    };

    /*
    */

    _Class.prototype.listen = function(port) {
      server.listen(port);
      return this;
    };

    return _Class;

  })();

}).call(this);
