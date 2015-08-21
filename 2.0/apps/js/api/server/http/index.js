var http = require("http");

/**
 */

module.exports = function(app) {
  return {
    initialize: function(operation, next) {
      var port = Number(app.get("config.http.port"));
      app.logger.info("starting HTTP server on port %d", port);

      app.http = http.createServer();
      app.http.listen(port);

      next();
    }
  };
};
