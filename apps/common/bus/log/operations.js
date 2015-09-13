import mesh from "common/mesh";
import sift from "sift";

module.exports = function(app, bus) {
  return function(operation) {
    if (operation.name !== "log") {
      app.logger.verbose("bus ", {
        name: operation.name,
        query: operation.query
      });
    }
    return bus(operation);
  };
};
