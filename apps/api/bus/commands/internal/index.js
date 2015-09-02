var sift         = require("sift");
var createRouter = require("api/bus/utils/create-router");

/**
 */

module.exports = function(bus) {
  return createRouter([
    sift({ collection: "accounts" }),
    require("./account")(bus)
  ], bus);
};
