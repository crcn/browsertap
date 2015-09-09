import memory from "mesh-memory";
import mesh from "mesh";
import sift from "sift";

module.exports = function(app) {
  app.logger.info("init mock db");
  var bus = memory();
  var _i = 0;
  bus = mesh.accept(sift({ name: "insert" }), function(operation) {
    operation.data = Object.assign({ _id: createId() }, operation.data);
    return this(operation);
  }.bind(bus), bus);
  return bus;
};


function createId() {
  var buffer = [];
  for (var i = 24; i--;) {
    buffer.push(Math.round(Math.random() * 9));
  }
  return buffer.join("");
}