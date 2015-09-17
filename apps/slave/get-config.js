import deepExtend      from "deep-extend";
import os              from "os";
import getCommonConfig from "common/utils/get-config";
import path            from "path"

module.exports = function(env) {

  var configs = {
    defaults: {
      http: {
        port: 8090
      }
    }
  };

  return deepExtend({}, getCommonConfig(env), configs.defaults, configs[env.NODE_ENV] || {});
};
