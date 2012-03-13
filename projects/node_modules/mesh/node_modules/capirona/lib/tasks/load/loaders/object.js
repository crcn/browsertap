(function() {
  var fs, outcome, step;

  fs = require('fs');

  step = require('stepc');

  outcome = require('outcome');

  exports.run = function(object, target, next) {
    return next(null, object);
  };

  exports.test = function(target) {
    return typeof target === 'object';
  };

}).call(this);
