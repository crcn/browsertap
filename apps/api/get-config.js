var LogLevels       = require("common/logger/levels");
var deepExtend      = require("deep-extend");
var os              = require("os");
var getCommonConfig = require("common/get-config");

module.exports = function(env) {

  var configs = {

    development : {
      numCores: 0,
    },

    production  : {},

    staging     : {},

    defaults: {
      numCores: Number(process.env.NUM_CORES || os.cpus().length),
      http: {
        port: Number(env.PORT || 8080),
      },
      log : {
        level: LogLevels.fromString(env.LOG_LEVEL || env.NODE_ENV)
      },
      loggly: {
        tags: ["api"]
      }
    }
  };

  return deepExtend({}, getCommonConfig(env), configs.defaults, configs[env.NODE_ENV] || {});
};
