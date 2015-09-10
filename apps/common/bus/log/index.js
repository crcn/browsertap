import mesh from "common/mesh";
import sift from "sift";

var busFactories = [
  require("./loggly"),
  require("./stdout")
];

import logOperations from "./operations";


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
