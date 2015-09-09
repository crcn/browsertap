import mesh from "mesh";
import get from "common/utils/get-property";
import set from "common/utils/set-property";

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
