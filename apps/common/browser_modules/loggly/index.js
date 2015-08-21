var Loggly = require("loggly-browserify");

exports.createClient = function(config) {
  var logger = new Loggly(config.token);
  return {
    log: function(data) {
      logger.push(data);
    }
  };
};
