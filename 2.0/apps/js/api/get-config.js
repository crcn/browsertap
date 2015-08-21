var LogLevels  = require("common/logger/levels");
var deepExtend = require("deep-extend");

module.exports = function(env) {

  var configs = {

    development : {},

    production  : {},

    staging     : {},

    defaults: {
      http: {
        port: env.PORT || 8080,
      },
      log : {
        level: LogLevels.fromString(env.LOG_LEVEL || env.NODE_ENV)
      },
      socket: {
        channel: "operations"
      }
    }
  };

  return deepExtend({}, configs.defaults, configs[env.NODE_ENV] || {});
};
