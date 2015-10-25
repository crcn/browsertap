import createRouter from 'koa-router';

/**
 */

export default function(server, app) {

  var router = createRouter();

  router.all('/o', async function(next) {

    var session = this.session;

    try {
      this.body = (await app.bus.execute(Object.assign({}, this.request.body, { app: app, session: session, public: true })).read()).value;
    } catch (e) {
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
};
