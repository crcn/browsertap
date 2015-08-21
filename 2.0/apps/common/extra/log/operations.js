module.exports = function(app) {
  var oldBus = app.bus;
  app.bus = function(operation) {

    if (operation.name !== "log") {
      app.logger.verbose("bus ", operation);
    }

    return oldBus(operation);
  };
};
