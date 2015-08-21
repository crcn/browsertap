var http = require("http");

/**
 */

module.exports = function(app) {
  return {
    initialize: function(operation, next) {
      var port = app.get("config.http.port");
      app.logger.info("http port : %d", port);

      app.http = http.createServer();
      app.http.listen(port);

      next();
    }
  };
};
