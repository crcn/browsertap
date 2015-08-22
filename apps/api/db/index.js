var dbs = {
  mock  : require("./mock"),
  mongo : require("./mongo")
};

module.exports = function(app) {
  return {
    initialize: function(operation, next) {

      var type = app.get("config.db.type");
      app.logger.info("init db: %s", type);

      if (!dbs[type]) {
        throw new Error("db transport " + type + " does not exist");
      }

      dbs[type](app);
      next();
    }
  };
};
