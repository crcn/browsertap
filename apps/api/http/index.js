import http from "http";
import socket from "./socket";
import mesh from "mesh";
import routes from "./routes";

/**
 */

module.exports = function(app) {
  var port = app.get("config.http.port");
  app.logger.info("http port : %d", port);

  var server = app.http = http.createServer();
  app.http.listen(port);

  app.bus({
    name: "intercept",
    max: 1,
    query: { name: "dispose" },
    bus: mesh.wrap(function(operation, next) {
      server.close();
      next();
    })
  });

  socket(app);
  routes(app.http, app);
};
