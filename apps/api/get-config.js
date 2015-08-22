var deepExtend      = require("deep-extend");
var os              = require("os");
var getCommonConfig = require("common/get-config");

module.exports = function(env) {

  var configs = {

    development : {
      numCores: 0,
    },

    production: {
      db: {
        host: "mongodb://localhost:27017/browsertap-production"
      }
    },

    staging: {
      db: {
        host: "mongodb://localhost:27017/browsertap-staging"
      }
    },

    defaults: {
      db: {
        type: process.env.DB || "mongo",
        host: "mongodb://127.0.0.1:27017/browsertap-development",
      },
      numCores: Number(process.env.NUM_CORES || os.cpus().length),
      http: {
        port: Number(env.PORT || 8080),
      },
      loggly: {
        tags: ["api"]
      }
    }
  };

  return deepExtend({}, getCommonConfig(env), configs.defaults, configs[env.NODE_ENV] || {});
};
