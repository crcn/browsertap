import http from "http";
import socket from "./socket";
import mesh from "mesh";
import routes from "./routes";
import koa from "koa"
import bodyparser from "koa-bodyparser";
import cors from "koa-cors"

/**
 */

module.exports = function(app) {
  var port = app.get("config.http.port");
  app.logger.info("http port: %d", port);

  var k = koa();

  k.use(cors());
  k.use(bodyparser());
  routes(k, app);

  var server = app.http = http.createServer(k.callback());
  app.http.listen(port);

  // app.bus({
  //   name: "intercept",
  //   max: 1,
  //   query: { name: "dispose" },
  //   bus: mesh.wrap(function(operation, next) {
  //     server.close();
  //     next();
  //   })
  // });

  socket(app);
};
