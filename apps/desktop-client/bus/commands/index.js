import { commands, noop, NoResponse } from "common/mesh";
import co from "co";
import _command  from "common/bus/drivers/command";

export default function(app, bus) {
  return commands({

    /**
     */

    initialize: _command({
      execute: function*() {
        yield app.bus({ name: "syncMachines" });
        yield app.bus({ name: "syncWindows"  });
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
