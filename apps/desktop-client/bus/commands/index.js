import { commands, noop, NoResponse } from "common/mesh";
import co from "co";
import CommandBus  from "common/mesh/bus/command";

export default function(app, bus) {
  return commands({

    /**
     */

    initialize: new CommandBus({
      execute: function*() {
        yield app.bus.execute({ name: "syncMachines" });
        yield app.bus.execute({ name: "syncWindows"  });
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
};
