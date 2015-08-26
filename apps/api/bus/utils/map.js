var mesh = require("mesh");

/**
 */

module.exports = function(bus, map) {
  return mesh.map(bus, function(operation, data, stream) {
    stream.end(map(data));
  });
};
