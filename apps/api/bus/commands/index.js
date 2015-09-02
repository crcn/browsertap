var mesh             = require("mesh");
var sift             = require("sift");
var publicCommands   = require("./public");
var internalCommands = require("./internal");

/**
 */

module.exports = function(app, bus) {

  bus = internalCommands(bus);
  bus = mesh.accept(
    sift({ public: true }),
    publicCommands(bus),
    bus
  );

  return bus;
};
