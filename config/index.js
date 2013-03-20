var _ = require("underscore"),
deepExtend = require("deep-extend"),
sift = require("sift");

module.exports = function(env) {

  var localhost = "192.168.0.102";
  
  var config = {
    default: {
      hosts: {
        rtmp: localhost,
        provision: localhost,
        provisionDnode: localhost
      },
      mongodb: "mongodb://127.0.0.1:27017/browsertap-dev",
      testingMode: /testing|development/.test(env),
      runEC2: /staging|production/.test(env),
      env: env,
      desktopPort: 8080,
      auth: {
        username: "btadmin",
        password: "btpass"
      },
      aws: {
        regions: ["us-west-1", "us-west-2", "us-east-1"]
        //regions: sift(/us-*/, ectwo.regions) // we only want us regions for now
      }
    },
    staging: {
      hosts: {
        // rtmp: "srtmp.browsertap.com",
        // provision: "sprovision.browsertap.com"
        rtmp: "54.225.198.26",
        provision: "crcn.fwd.wf"
      },
      mongodb: "mongodb://browsertaper:br0w53474p@linus.mongohq.com:10043/browsertap-staging",
      aws: {
        key: "AKIAILTE6WHXUCBDXQHA",
        secret: "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"
      }
    },
    production: {
      hosts: {
        rtmp: "rtmp.browsertap.com",
        provision: "provision.browsertap.com"
      },
      mongodb: "mongodb://maestro-root:m4estr0d32@alex.mongohq.com:10081/browsertap-production",
      aws: {
        "key": "AKIAJKBGOTIITATBXTIQ",
        "secret": "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"
      },
    }
  };


  var c = deepExtend(config.default, config[env] || {});
  return c
}