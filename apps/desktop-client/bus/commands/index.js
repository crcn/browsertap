import { commands, noop, NoResponse } from "common/mesh";

export default function(app, bus) {
  return commands({

    /**
     */

    initialize: function() {
      syncMachines(app);
      return new NoResponse();
    }
  }, noop);
};

/**
 */

function syncMachines(app) {
  app.logger.info("synchronizing machines");
  // TODO - support mdns, and aws
}
