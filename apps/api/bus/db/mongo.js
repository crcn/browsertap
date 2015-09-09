import mongo from "mesh-mongodb";
import mesh from "mesh";
import sift from "sift";

module.exports = function(app) {

  var host = app.get("config.db.host");
  app.logger.info("init mongo db: %s", host);

  var bus = mongo(host);

  return bus;
};
