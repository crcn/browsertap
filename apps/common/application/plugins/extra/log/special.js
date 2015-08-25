module.exports = function(app) {
  var oldBus = app.bus;
  app.bus = function(operation) {
    if (!operation.special) return oldBus(operation);
    app.logger.notice(":break");
    return oldBus(operation).on("end", app.logger.notice.bind(app.logger, ":break"));
  };
};
