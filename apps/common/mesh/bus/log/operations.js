import sift from "sift";

export default {
  create: function(app, bus) {
    return {
      execute: function(operation) {
        if (operation.action !== "log") {
          app.logger.verbose("bus ", {
            action: operation.action,
            query: operation.query
          });
        }
        return bus.execute(operation);
      }
    }
  }
};
