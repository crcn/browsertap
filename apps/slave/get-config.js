import deepExtend      from "lodash/object/merge";
import os              from "os";
import getCommonConfig from "common/utils/get-config";
import path            from "path"

module.exports = function(env) {

  var configs = {
    defaults: {
      http: {
        port: 8090
      },
      mdns: {
        advertise : "machine",
        port      : 9000
      },
      paths: {
        desktopController: path.join(__dirname, "..", "/desktop/build/app/out/Release/app")
      }
    }
  };

  return deepExtend({}, getCommonConfig(env), configs.defaults, configs[env.NODE_ENV] || {});
};
