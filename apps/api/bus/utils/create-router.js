var mesh = require("mesh");

module.exports = function(routes, noop) {

  if (!noop) noop = mesh.noop;

  return function(operation) {

    for (var i = 0, n = routes.length; i < n; i += 2) {
      var test = routes[i];
      var bus  = routes[i + 1];
      if (test(operation)) return bus(operation);
    }

    return noop(operation);
  };
};
