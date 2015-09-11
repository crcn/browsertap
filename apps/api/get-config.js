import deepExtend from "deep-extend";
import os from "os";
import getCommonConfig from "common/utils/get-config";

module.exports = function(env) {

  var configs = {

    development : {
      numCores: 0
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
      },
      email: {
        type: "mailgun",
        key: "key-21e1112af96563149f95a2e6a93f0406",
        domain: "sandbox4ae439fbc90a424083d002263e5b9fd9.mailgun.org",
        from: {
          default: "postmaster@sandbox4ae439fbc90a424083d002263e5b9fd9.mailgun.org"
        }
      }
    }
  };

  return deepExtend({}, getCommonConfig(env), configs.defaults, configs[env.NODE_ENV] || {});
};
