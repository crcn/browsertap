var Logger = require("./logger");
var extend = require("xtend/mutable");

/**
 */

module.exports = function(app) {

  var config = extend({
    bus: function(operation) {
      return app.bus(operation);
    }
  }, app.get("config.log"));

  app.logger = new Logger(config);
};
