var io          = require("socket.io");
var socketioBus = require("common/bus/socketio");

/**
 */

module.exports = function(app) {

  var server;

  return {
    initialize: function(operation, next) {
      app.logger.info("init socket.io server");
      server = io(app.http);

      server.on("connection", function(client) {
        var bus = app.bus;

        // TODO - sandbox operations here
        bus = socketioBus(app.get("config.socket.channel"), client, bus);
      });

      next();
    },
    terminate: function(operation, next) {
      server.close();
      next();
    }
  };
};