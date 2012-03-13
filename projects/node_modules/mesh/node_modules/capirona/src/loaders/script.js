(function() {
  var fs, outcome, path, step;

  fs = require('fs');

  step = require('stepc');

  outcome = require('outcome');

  path = require("path");

  exports.run = function(file, next, config) {
    config._cwd = path.dirname(file);
    return require(file).load(config, next);
  };

  exports.test = function(target) {
    return /.js$/.test(String(target));
  };

}).call(this);
