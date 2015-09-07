var sift               = require("sift");
var createRouterBus    = require("api/bus/drivers/create-router");

/**
 */

module.exports = function(bus) {
  return createRouterBus(
    require("./authorization")(bus).concat([])
  );
};
