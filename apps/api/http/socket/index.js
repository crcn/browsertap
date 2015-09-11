import io from "socket.io";
import socketioBus from "common/bus/drivers/socketio";
import sift from "sift";
import mesh from "mesh";

/**
 */

module.exports = function(app, bus) {

  var server;

  var channel = app.get("config.socket.channel");
  app.logger.info("socket.io channel: %s", channel);
  server = io(app.http);

  server.on("connection", function(client) {
    var bus = app.publicCommands;

    app.logger.verbose("socket.io client connected");

    // TODO - sandbox operations here
    bus = socketioBus(channel, client, bus);

    client.on("disconnect", function() {

      // TODO: dispose socketioBus here
      app.logger.verbose("socket.io disconect");
    });
  });

  // app.bus({
  //   name: "intercept",
  //   max: 1,
  //   query: { name: "dispose" },
  //   bus: mesh.wrap(function(operation, next) {
  //     server.close();
  //     next();
  //   })
  // });

  return bus;
};
