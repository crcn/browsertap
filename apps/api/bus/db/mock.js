import MemoryDbBus from "common/mesh/bus/memory";
import { AcceptBus } from "mesh";
import sift from "sift";

module.exports = function(app) {
  app.logger.info("init mock db");
  var membus = new MemoryDbBus();
  var _i = 0;

  var bus = new AcceptBus(
    sift({ name: "insert" }),
    {
      execute: function(operation) {
        operation.data = Object.assign({ _id: createId() }, operation.data);
        return membus.execute(operation);
      }
    }, membus
  );

  this.execute = bus.execute.bind(bus);
};

function createId() {
  var buffer = [];
  for (var i = 24; i--;) {
    buffer.push(Math.round(Math.random() * 9));
  }
  return buffer.join("");
}
