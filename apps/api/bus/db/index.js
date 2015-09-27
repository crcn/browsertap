import sift from "sift";
import mesh from "common/mesh";
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

  return mesh.accept(
    sift({ name: /insert|update|remove|load/ }),
    _wrapBus20(dbs[type](app)),
    bus
  );
};

function _wrapBus20(bus) {
  return function(operation) {
    var resp = new mesh.AsyncResponse();
    
    bus(operation)
    .on("data", resp.write.bind(resp))
    .on("end", resp.end.bind(resp));
    // TODO - add error here
    return resp;
  };
}
