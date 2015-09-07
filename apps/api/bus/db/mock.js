var memory = require("mesh-memory");
var mesh   = require("mesh");
var sift   = require("sift");

module.exports = function(app) {
  app.logger.info("init mock db");
  var bus = memory();
  var _i = 0;
  bus = mesh.accept(sift({ name: "insert" }), function(operation) {
    operation.data = Object.assign({ _id: ++_i }, operation.data);
    return this(operation);
  }.bind(bus), bus);
  return bus;
};
