import { CommandsBus, NoResponse } from "common/mesh";
import { BufferedResponse } from "mesh";
import CommandBus from "common/mesh/bus/command";

export default {
  create: function(app, bus) {
    return CommandsBus.create({

      /**
      */

      initialize: CommandBus.create({
        execute: async function() {
          await app.bus.execute({ action: "syncMachines" }).read();
          await app.bus.execute({ action: "syncWindows"  }).read();
          // await app.bus.execute({ action: "insert", collection: "virtWindows", data: { width: 500, height: 400, title: "something" } });
        }
      }),

      /**
      * for testing
      */

      ping: CommandBus.create({
        execute: async function() {
          return "pong!";
        }
      }),

      /**
      */

      syncMachines: require("./sync-machines")(app),

      /**
      */

      syncWindows: require("./sync-windows")(app),

      /**
      */

      openWindow: require("./open-window")(app)
    }, bus);
  }
}
