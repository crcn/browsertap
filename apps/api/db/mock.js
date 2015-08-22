var memory = require("mesh-memory");
var mesh   = require("mesh");
var sift   = require("sift");

module.exports = function(app) {
  app.logger.info("init mock db");
  var bus = memory();
  return bus;
};
