import mongo from "mesh-mongodb";
import mesh from "mesh";
import sift from "sift";
import { ObjectId } from "mongodb"
import traverse from "traverse";

module.exports = function(app) {

  var host = app.get("config.db.host");
  app.logger.info("init mongo db: %s", host);

  var db = mongo(host);

  function _fixMongoids(data) {
    traverse(data).forEach(function(x) {
      if (this.key && ~this.key.indexOf("_id") && String(x).length === 24) {
        this.update(ObjectId(x));
      }
    });
  }

  var bus = function(operation) {

    _fixMongoids(operation.data);
    _fixMongoids(operation.query);

    return db(operation);
  }

  return bus;
};
