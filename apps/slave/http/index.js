import http       from "http";
import mesh       from "mesh";
import koa        from "koa";
import bodyparser from "koa-bodyparser";
import cors       from "koa-cors"
import redisStore from "koa-redis";
import session    from "koa-generic-session";

/**
 */

module.exports = function(app) {
  var port = app.get("config.http.port");
  app.logger.info("http port: %d", port);

  var k = koa();

  k.keys = ['keys', 'keykeys'];

  k.use(cors());
  k.use(bodyparser());
  k.use(session({
    store: redisStore({
      host: void 0
    })
  }));

  var server = app.http = http.createServer(k.callback());
  app.http.listen(port);
};
