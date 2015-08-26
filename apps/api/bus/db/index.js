var sift = require("sift");
var mesh = require("mesh");

var dbs = {
  mock  : require("./mock"),
  mongo : require("./mongo")
};

module.exports = function(app, bus) {
  var type = app.get("config.db.type");
  app.logger.info("init db: %s", type);

  if (!dbs[type]) {
    throw new Error("db transport " + type + " does not exist");
  }

  return mesh.accept(
    sift({ name: /insert|update|remove|load/ }),
    dbs[type](app),
    bus
  );
};
