import { CommandsBus, NoResponse } from "common/mesh";
import CommandBus  from "common/mesh/bus/command";

export default function(app, bus) {
  bus = new CommandsBus({

    /**
     */

    initialize: new CommandBus({
      execute: async function() {
        await app.bus.execute({ name: "syncMachines" }).read();
        await app.bus.execute({ name: "syncWindows"  }).read();
        // yield app.bus.execute({ name: "openWindow", width: 500, height: 500 });
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

  this.execute = bus.execute.bind(bus);
};
