var mesh = require("mesh");

module.exports = function(handlers, defaultBus) {
  var busses = {};
  if (!defaultBus) defaultBus = mesh.noop;

  function commands(operation) {
    var bus = busses[operation.name] || defaultBus;
    return bus(operation);
  }

  commands.addHandler = function(name, handler) {
    var bus;

    if (handler.length === 2) {
      bus = mesh.wrap(handler);
    } else {
      bus = handler;
    }

    var __handlers = [];

    if (!busses[name]) {
      busses[name] = mesh.parallel(__handlers);
      busses[name].__handlers = __handlers;
    }

    __handlers = busses[name].__handlers;
    __handlers.push(bus);

    return {
      dispose: function() {
        var i = __handlers.indexOf(bus);
        if (~i) __handlers.splice(i, 1);
      }
    };
  };

  for (var name in handlers) commands.addHandler(name, handlers[name]);

  return commands;
};
