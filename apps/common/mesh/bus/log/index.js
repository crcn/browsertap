import { AcceptBus, NoopBus, ParallelBus } from "mesh";
import sift from "sift";
import LogOperationsBus from "./operations";

var busFactories = [
  require("./loggly"),
  require("./stdout")
];

export default {
  create: function(app, bus) {

    if (!bus) bus = NoopBus.create();

    bus = AcceptBus.create(
      sift({ name: "log" }),
      ParallelBus.create(busFactories.map(function(busClass) {
        return busClass.create(app, bus);
      })),
      LogOperationsBus.create(app, bus)
    )

    return bus;
  }
}
