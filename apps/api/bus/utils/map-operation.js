var mesh = require("mesh");
var get  = require("common/utils/get-property");
var set  = require("common/utils/set-property");

/**
 */

module.exports = function(keypath, map, bus) {
  if (!bus) bus = mesh.noop;
  return function(operation, data, stream) {
    var v = get(operation, keypath);
    set(operation, keypath, map(v));
    return bus(operation);
  };
};
