(function() {
  var async, fixPaths, fs, loadBrowser, mapBrowserVersions, outcome, path, step;

  outcome = require("outcome");

  step = require("stepc");

  fs = require("fs");

  path = require("path");

  async = require("async");

  module.exports = function(directory, callback) {
    var on_;
    on_ = outcome.error(callback);
    directory = directory.replace('~', process.env.home);
    return step.async(function() {
      return fs.readdir(directory, this);
    }, on_.success(function(dirs) {
      var browsers;
      browsers = {};
      return async.map(fixPaths(directory, dirs), loadBrowser, this);
    }), on_.success(function(browsers) {
      var toObj;
      toObj = {};
      browsers.forEach(function(browser) {
        return toObj[browser.name.toLowerCase()] = browser;
      });
      return callback(null, toObj);
    }));
  };

  /*
  */

  loadBrowser = function(directory, callback) {
    var browsers, on_;
    on_ = outcome.error(callback);
    browsers = {
      name: path.basename(directory),
      executables: []
    };
    return step.async(function() {
      return fs.readdir(directory, this);
    }, on_.success(function(executables) {
      return async.map(fixPaths(directory, executables), mapBrowserVersions, function() {
        return console.log("NEXT");
      });
    }), callback);
  };

  /*
  */

  mapBrowserVersions = function(executable, next) {
    return console.log(executable);
  };

  /*
  */

  fixPaths = function(parent, paths) {
    return paths.filter(function(dir) {
      return parent.substr(0, 1) !== ".";
    }).map(function(dir) {
      return path.normalize(parent + "/" + dir);
    });
  };

}).call(this);
