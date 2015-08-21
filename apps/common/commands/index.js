var commands  = require("common/bus/commands");

module.exports = function(app) {
  app.bus = app.internalCommands = commands({}, app.bus);
  app.publicCommands   = commands({});
};
