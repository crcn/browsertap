import sift from "sift";

module.exports = function(app, bus) {
  this.execute = function(operation) {
    if (operation.name !== "log") {
      app.logger.verbose("bus ", {
        name: operation.name,
        query: operation.query
      });
    }
    return bus.execute(operation);
  }
};
