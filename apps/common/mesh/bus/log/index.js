import { AcceptBus, NoopBus, ParallelBus } from "mesh";
import sift from "sift";

var busFactories = [
  require("./loggly"),
  require("./stdout")
];

import LogOperationsBus from "./operations";


module.exports = function(app, bus) {

  if (!bus) bus = new NoopBus();

  bus = new AcceptBus(
    sift({ name: "log" }),
    new ParallelBus(busFactories.map(function(busClass) {
      return new busClass(app, bus);
    })),
    new LogOperationsBus(app, bus)
  )

  this.execute = bus.execute.bind(bus);
};
