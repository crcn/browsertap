var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("api/bus/common/create-router");

/**
 */

module.exports = function(bus) {
  return createRouter([
    sift({ collection: "users" }),
    require("./users")(bus)
  ]);
};
