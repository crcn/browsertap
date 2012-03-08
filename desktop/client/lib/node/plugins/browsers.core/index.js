(function() {
  var fs, loadBrowsers, path, sprintf, step;

  fs = require("fs");

  step = require("stepc");

  path = require("path");

  sprintf = require("sprintf").sprintf;

  loadBrowsers = require("./loadBrowsers");

  exports.plugin = function(router) {
    var allBrowsers, browserDir, params;
    params = this.params();
    browserDir = params.browsers.directory.replace("~", process.env.HOME);
    allBrowsers = {};
    return router.on({
      /*
      */
      "pull load/+": function(req, res, mw) {
        return step.async(function() {
          console.log("loading browsers from directory: %s", browserDir);
          return loadBrowsers(browserDir, this);
        }, res.success(function(browsers) {
          allBrowsers = browsers;
          console.log("collecting browser info from plugins");
          return router.request("browser/info").response(res.success(function(info) {})).collect();
        }));
      }
    });
  };

}).call(this);
