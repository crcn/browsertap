import sift from "sift";
import { AcceptBus, AsyncResponse } from "mesh";
import co from "co";

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

  var busClass = dbs[type];

  var bus = new AcceptBus(
    sift({ name: /insert|update|remove|load/ }),
    new busClass(app),
    bus
  )

  this.execute = bus.execute.bind(bus);
};
