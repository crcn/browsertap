var _ = require("underscore"),
deepExtend = require("deep-extend");

module.exports = function(env) {
  var config = {
    default: {
      hosts: {
        rtmp: "192.168.13.1",
        provision: "192.168.13.1",
        provisionDnode: "192.168.13.1"
      },
      mongodb: "mongodb://127.0.0.1:27017/browsertap-dev",
      testingMode: /testing|development/.test(env),
      runEC2: /staging|production/.test(env),
      env: env,
      desktopPort: 8080,
      auth: {
        username: "btadmin",
        password: "btpass"
      }
    },
    staging: {
      hosts: {
        rtmp: "srtmp.browsertap.com",
        provision: "sprovision.browsertap.com"
      },
      mongodb: "mongodb://maestro-root:m4estr0d32@alex.mongohq.com:10081/browsertap-staging",
    },
    production: {
      hosts: {
        rtmp: "rtmp.browsertap.com",
        provision: "provision.browsertap.com"
      },
      mongodb: "mongodb://maestro-root:m4estr0d32@alex.mongohq.com:10081/browsertap-production"
    }
  };


  var c = deepExtend(config.default, config[env] || {});
  return c
}