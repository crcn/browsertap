import mesh from "mesh";
import sift from "sift";

module.exports = function(app, bus) {
  return function(operation) {
    if (operation.name !== "log") {
      app.logger.verbose("bus ", operation);
    }
    return bus(operation);
  };
};
