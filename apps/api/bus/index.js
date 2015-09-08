import { noop } from "common/mesh"
var commands = require("./public-commands");
var db       = require("./db");
// var email    = require("./email");

module.exports = function(app, bus) {
  if (!bus || true) bus = noop;
  bus = db(app, bus);
  // bus = email(app, bus);
  bus = commands(bus);
  return bus;
};


function _wrapGenerator(bus) {
  
}