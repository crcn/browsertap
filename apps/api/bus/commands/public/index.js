var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("api/bus/utils/create-router");
var httperr      = require("httperr");

/**
 */

module.exports = function(bus) {
  return createRouter([
    sift({ collection: "users" }),
    require("./users")(bus)
  ]);
};
