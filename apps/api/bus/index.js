var mesh     = require("mesh");
var commands = require("./commands");
var db       = require("./db");
var email    = require("./email");

module.exports = function(app, bus) {
  if (!bus) bus = mesh.noop;
  bus = db(app, bus);
  bus = email(app, bus);
  bus = commands(app, bus);
  return bus;
};
