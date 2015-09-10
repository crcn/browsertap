import mesh from "common/mesh";
import intercept from "./drivers/intercept";
import log from "./log";

module.exports = function(app, bus) {

  if (!bus) bus = mesh.noop;

  bus     = log(app, bus);

  // bus     = intercept(bus);


  return bus;
};
