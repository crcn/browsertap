var mesh = require("mesh");
var sift = require("sift");

module.exports = function(handlers, defaultBus) {
  var busses = {};
  if (!defaultBus) defaultBus = mesh.noop;

  function commands(operation) {
    var bus = busses[operation.name] || defaultBus;
    return bus(operation);
  }

  commands.addHandler = function(name, condition, handler) {

    if (typeof name === "object") {
      var handlers = name;
      for (var n2 in handlers) {
        commands.addHandler(n2, condition, handlers[n2]);
      }
      return;
    }

    if (arguments.length === 2) {
      handler    = condition;
      condition  = void 0;
    }

    var bus;

    if (handler.length === 2) {
      bus = mesh.wrap(handler);
    } else {
      bus = handler;
    }

    if (condition) {
      bus = mesh.accept(sift(condition), bus);
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

  if (handlers) commands.addHandler(handlers);

  return commands;
};
