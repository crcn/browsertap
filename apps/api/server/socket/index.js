var io          = require("socket.io");
var socketioBus = require("common/bus/socketio");

/**
 */

module.exports = function(app) {

  var server;

  return {
    initialize: function(operation, next) {
      var channel = app.get("config.socket.channel");
      app.logger.info("init socket.io server on channel \"%s\"", channel);
      server = io(app.http);

      server.on("connection", function(client) {
        var bus = app.bus;

        // TODO - sandbox operations here
        bus = socketioBus(channel, client, bus);
      });

      next();
    },
    terminate: function(operation, next) {
      server.close();
      next();
    }
  };
};
