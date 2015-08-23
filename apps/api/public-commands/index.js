var mesh         = require("mesh");
var sift         = require("sift");
var createRouter = require("./utils/create-router");

/**
 */

module.exports = function(app) {
  var bus = app.bus;

  bus = createRouter([

    sift({ collection: "users" }),
    require("./users")(bus)
  ]);

  app.publicBus = bus;
};
