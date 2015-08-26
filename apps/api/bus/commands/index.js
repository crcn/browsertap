var mesh           = require("mesh");
var sift           = require("sift");
var publicCommands = require("./public");

/**
 */

module.exports = function(app, bus) {
  return mesh.accept(
    sift({ public: true }),
    publicCommands(bus),
    bus
  );
};
