import deepExtend      from "lodash/object/merge";
import os              from "os";
import getCommonConfig from "common/utils/get-config";
import path            from "path"

module.exports = function(env) {

  var binPath = {
    win32: path.join(__dirname, "..", "/desktop/build/app/gyp/Debug/app.exe"),
    darwin: path.join(__dirname, "..", "/desktop/build/app/out/Release/app")
  }[os.platform()];

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
        desktopController: binPath
      }
    }
  };

  return deepExtend({}, getCommonConfig(env), configs.defaults, configs[env.NODE_ENV] || {});
};
