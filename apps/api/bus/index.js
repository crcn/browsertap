var mesh            = require("mesh");
// var createSocketBus = require("./socket");

module.exports = function(app, bus) {
  if (!bus) bus = mesh.noop;
  // bus = createSocketBus(app, bus);
  return bus;
}