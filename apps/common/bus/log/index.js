var mesh = require("mesh");
var sift = require("sift");

var busFactories = [
  require("./loggly"),
  require("./stdout")
];

var logOperations = require("./operations");

module.exports = function(app, bus) {

  if (!bus) bus = mesh.noop;

  bus = mesh.accept(
    sift({ name: "log" }),
    mesh.parallel(busFactories.map(function(createBus) {
      return createBus(app, bus);
    })),
    logOperations(app, bus)
  );

  return bus;
};
