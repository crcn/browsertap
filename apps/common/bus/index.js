var mesh      = require("mesh");
var intercept = require("./utils/intercept");
var log       = require("./log");

module.exports = function(app, bus) {

  if (!bus) bus = mesh.noop;

  bus     = log(app, bus);
  bus     = intercept(bus);

  return bus;
};
