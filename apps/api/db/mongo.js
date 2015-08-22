var mongo = require("mesh-mongodb");
var mesh  = require("mesh");
var sift  = require("sift");

module.exports = function(app) {

  var host = app.get("config.db.host");
  app.logger.info("init mongo: %s", host);

  var bus = mongo(host);
};
