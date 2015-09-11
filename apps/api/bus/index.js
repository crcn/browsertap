import { noop, catchError } from "common/mesh"
import internalCommands from "./internal-commands";
import publicCommands from "./public-commands";
import db from "./db";
import log from "common/bus/log";

module.exports = function(app, bus) {
  if (!bus) bus = noop;
  bus = db(app, bus);
  bus = internalCommands(app, bus);
  bus = publicCommands(app, bus);
  bus = log(app, bus); // TODO - change this to log operations

  bus = catchError(bus, function(err) {
    app.logger.error(err);
  });

  return bus;
};
