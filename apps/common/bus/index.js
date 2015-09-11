import mesh from "common/mesh";
import intercept from "./drivers/intercept";

module.exports = function(app, bus) {

  if (!bus) bus = mesh.noop;

  // bus     = intercept(bus);


  return bus;
};
