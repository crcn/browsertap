
var getConfig   = require("common/get-config");
var deepExtend  = require("deep-extend");

module.exports = function(env) {

  var config = {
    defaults: {
      socket: {
        host: "http://0.0.0.0:8080"
      }
    }
  };

  return deepExtend({}, getConfig(env), config.defaults);
};
