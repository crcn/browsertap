var logStdout = require("./log/stdout");
var commands  = require("common/bus/commands");
var extend    = require("xtend/mutable");

module.exports = function(app) {
  app.bus = commands(extend(
    logStdout(app)
  ), app.bus);
};
