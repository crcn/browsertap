import mongo from "mesh-mongodb";
import mesh from "mesh";
import sift from "sift";
import { ObjectId } from "mongodb"

module.exports = function(app) {

  var host = app.get("config.db.host");
  app.logger.info("init mongo db: %s", host);

  var db = mongo(host);
  var bus = function(operation) {

    // TODO - props from types should be passed here. Should
    // check if each prop is instance of ObjectId and re-case
    if (operation.query && operation.query._id) {
      operation.query._id = ObjectId(operation.query._id);
    }


    // TODO - props from types should be passed here. Should
    // check if each prop is instance of ObjectId and re-case
    if (operation.data && operation.data._id) {
      operation.data._id = ObjectId(operation.data._id);
    }

    return db(operation);
  }

  return bus;
};
