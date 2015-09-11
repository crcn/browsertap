var createRouter = require("koa-router");
/**
 */

module.exports = function(server, app) {

  var router = createRouter();
 
  router.all("/o", function*(next) {
    try {
      this.body = yield app.bus(Object.assign({}, this.request.body, { public: true }));
    } catch(e) {
      var statusCode = e.statusCode || 500;
      this.status = statusCode;
      this.body = {
        error: {
          message: e.message,
          statusCode: statusCode
        }
      };
      return;
    }


  });

  server.use(router.routes()).use(router.allowedMethods());

}

