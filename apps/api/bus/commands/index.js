var mesh           = require("mesh");
var sift           = require("sift");
var publicCommands = require("./public");

/**
 */

module.exports = function(options, internalBus) {
  return mesh.accept(
    sift({ public: true }),
    publicCommands(internalBus),
    internalBus
  );
};
