(function() {
  var fs, outcome, path, step, vm;

  fs = require('fs');

  vm = require("vm");

  path = require("path");

  step = require('stepc');

  outcome = require('outcome');

  exports.run = function(file, target, next) {
    var script;
    if (file.substr(0, 1) === ".") file = process.cwd() + "/" + file;
    script = require(file);
    if (script.load) {
      return script.load(target, next);
    } else {
      return next(null, script);
    }
  };

  exports.test = function(target) {
    return /.js$/.test(String(target));
  };

}).call(this);
