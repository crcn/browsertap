var sift         = require("sift");
var createRouter = require("api/bus/drivers/create-router");

/**
 */

module.exports = function(bus) {
  return createRouter([
    sift({ collection: "accounts" }),
    require("./account")(bus)
  ], bus);
};
