(function() {
  var async, fixPaths, fs, loadBrowser, outcome, path, step;

  outcome = require("outcome");

  step = require("stepc");

  fs = require("fs");

  path = require("path");

  async = require("async");

  module.exports = function(directory, callback) {
    var on_;
    on_ = outcome.error(callback);
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
    var browser, on_;
    on_ = outcome.error(callback);
    browser = {
      name: path.basename(directory),
      executables: []
    };
    return step.async(function() {
      return fs.readdir(directory, this);
    }, on_.success(function(executables) {
      browser.executables = fixPaths(directory, executables);
      return this(null, browser);
    }), callback);
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
