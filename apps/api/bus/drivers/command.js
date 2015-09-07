import mesh from "mesh";

/**
 */

export default function(commands, bus) {
  if (!bus) bus = mesh.noop;
  return function(operation) {
    var handler = commands[operation.name];
    return (handler || bus)(operation);
  };
};
