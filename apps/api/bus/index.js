var mongo = require("./mongodb");
var mesh  = require("mesh");

module.exports = function(app) {
  app.bus = mesh.noop;
};
