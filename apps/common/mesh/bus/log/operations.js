import sift from "sift";

export default {
  create: function(app, bus) {
    return {
      execute: function(operation) {
        if (operation.name !== "log") {
          app.logger.verbose("bus ", {
            name: operation.name,
            query: operation.query
          });
        }
        return bus.execute(operation);
      }
    }
  }
};
