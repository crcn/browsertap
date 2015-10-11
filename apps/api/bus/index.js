import { WrapBus, NoopBus, CatchErrorBus } from "mesh";

import InternalCommandsBus from "./internal-commands";
import PublicCommandsBus from "./public-commands";
import DbBus from "./db";
import LogBus from "common/mesh/bus/log";

class APIBus extends WrapBus {

  /**
   */

  constructor(app, bus) {

    if (!bus) bus = new NoopBus();
    bus = new DbBus(app, bus);
    bus = new InternalCommandsBus(app, bus);
    bus = new PublicCommandsBus(app, bus);

    // var obus = bus;
    //
    // bus = {
    //   execute: function(operation) {
    //     console.log(operation);
    //     return obus.execute(operation);
    //   }
    // }
    // bus = new LogBus(app, bus);
    bus = new CatchErrorBus(bus, function(error) {
      app.logger.error(error);
      throw error;
    });

    super(bus.execute.bind(bus));
  }
}

export default APIBus;
