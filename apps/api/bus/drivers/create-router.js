import { NoopBus } from "mesh";

module.exports = function(routes, noop) {

  if (!noop) noop = new NoopBus();

  this.execute = function(operation) {

    for (var i = 0, n = routes.length; i < n; i += 2) {
      var test = routes[i];
      var bus  = routes[i + 1];
      if (test(operation)) return bus.execute(operation);
    }

    return noop.execute(operation);
  };

};
