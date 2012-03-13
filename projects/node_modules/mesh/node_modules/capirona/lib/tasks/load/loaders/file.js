(function() {
  var fs, outcome, path, step;

  fs = require('fs');

  step = require('stepc');

  path = require("path");

  outcome = require('outcome');

  exports.run = function(file, target, next) {
    var onResult;
    onResult = outcome.error(next);
    return step.async(function() {
      return fs.readFile(file, "utf8", this);
    }, onResult.success(function(content) {
      return this(null, JSON.parse(content));
    }), next);
  };

  exports.test = function(target) {
    return /.json$/.test(String(target));
  };

}).call(this);
