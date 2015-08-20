var mesh = require("mesh");

module.exports = function(handlers, defaultBus) {
  var busses = {};
  if (!defaultBus) defaultBus = mesh.noop;

  for (var name in handlers) {
    var handler = handlers[name];
    if (handler.length === 2) {
      busses[name] = mesh.wrap(handler);
    } else {
      busses[name] = handler;
    }
  }

  return function(operation) {
    var bus = busses[operation.name] || defaultBus;
    return bus(operation);
  };
};
