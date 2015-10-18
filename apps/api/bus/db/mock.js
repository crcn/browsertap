import MemoryDbBus from "common/mesh/bus/memory";
import { AcceptBus } from "mesh";
import sift from "sift";

export default {
  create: function(app) {
    app.logger.info("init mock db");
    var membus = MemoryDbBus.create();
    var _i = 0;

    var bus = AcceptBus.create(
      sift({ name: "insert" }),
      {
        execute: function(operation) {
          operation.data = Object.assign({ _id: createId() }, operation.data);
          return membus.execute(operation);
        }
      }, membus
    );

    return bus;
  }
};

function createId() {
  var buffer = [];
  for (var i = 24; i--;) {
    buffer.push(Math.round(Math.random() * 9));
  }
  return buffer.join("");
}
