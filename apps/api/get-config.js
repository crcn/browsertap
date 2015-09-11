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
      },
      stripe: {
        sk : process.env.STRIPE_SK,
        pk : process.env.STRIPE_PK
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
      emailer: {
        service: process.env.EMAILER || "mailgun",
        auth: {
          user: "postmaster@sandbox4ae439fbc90a424083d002263e5b9fd9.mailgun.org",
          pass: "29c5fc01d35b1d8605b6c3982bcb3091"
        }
      },
      stripe: {
        sk: "sk_test_rvnY0JY1f7qdoVcFJ03TdiL9",
        pk: "pk_test_kWLhP5fJcWHvPPaC054C38RE"
      }
    }
  };

  return deepExtend({}, getCommonConfig(env), configs.defaults, configs[env.NODE_ENV] || {});
};
