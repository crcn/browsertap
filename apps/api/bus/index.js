import { noop } from "common/mesh"
import internalCommands from "./internal-commands";
import publicCommands from "./public-commands";
import db from "./db";

module.exports = function(app, bus) {
  if (!bus || true) bus = noop;
  bus = db(app, bus);
  bus = internalCommands(app, bus);
  bus = publicCommands(app, bus);
  return bus;
};
