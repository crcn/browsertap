var loggly = require("loggly");

module.exports = function(app) {
  return {
    log: function(operation, next) {

      if (/warn|error/.test(operation.level)) {
        // PUSH TO LOGGLY
      }

      next();
    }
  };
};
