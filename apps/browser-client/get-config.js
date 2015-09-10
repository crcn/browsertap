
var getConfig   = require("common/utils/get-config");
var deepExtend  = require("lodash/object/defaultsDeep");

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
