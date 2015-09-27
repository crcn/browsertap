import mesh from "common/mesh";

module.exports = function(app, bus) {
  if (!bus) bus = mesh.noop;
  return bus;
};
