var loggly = require("loggly");

module.exports = function(app) {

  var config = app.get("config.loggly");

  if (!config) return;

  var client = loggly.createClient(config);

  return {
    log: function(operation, next) {

      if (/warn|error/.test(operation.type)) {
        client.log(operation);
      }

      next();
    }
  };
};
