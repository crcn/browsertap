var io          = require("socket.io");
var socketioBus = require("common/bus/socketio");
var sift        = require("sift");
var mesh        = require("mesh");

/**
 */

module.exports = function(app) {

  var server;

  return {
    initialize: function(operation, next) {
      var channel = app.get("config.socket.channel");
      app.logger.info("socket.io channel : %s", channel);
      server = io(app.http);

      server.on("connection", function(client) {
        var bus = app.bus;

        app.logger.verbose("socket.io client connected");

        // TODO: don't do this here. { public: true } should be defined for route handlers.
        // OR pass in the PUBLIC BUS
        bus = mesh.accept(
          sift({
            name: {$in: ["hello"]}
          })
        , bus)

        // TODO - sandbox operations here
        bus = socketioBus(channel, client, bus);


        client.on("disconnect", function() {

          // TODO: dispose socketioBus here
          app.logger.verbose("socket.io disconect");
        });
      });

      next();
    },
    terminate: function(operation, next) {
      server.close();
      next();
    }
  };
};
