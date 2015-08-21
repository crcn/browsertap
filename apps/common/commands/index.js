var commands  = require("common/bus/commands");

module.exports = function(app) {
  app.bus = app.commands = commands({}, app.bus);
};
