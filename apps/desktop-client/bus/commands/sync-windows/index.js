import CommandBus    from "common/mesh/bus/command";
import sift          from "sift";
import BrowserWindow from "browser-window";
import syncDbCollection from "common/mesh/utils/sync-db-collection";

export default function(app) {

  return CommandBus.create({
    execute: execute
  });

  // TODO - change to async
  function execute(operation) {

    app.logger.info("synchronizing virtual windows");

    // TODO - use more abstract sync
    syncDbCollection(
      app.bus,
      "virtWindows", {
        insert: insert
      }
    );
  }

  var _windows = {

  };

  function remove() {

  }

  function insert(virtWindow) {

    // TODO - app.bus.execute({ action: "openWindow", model: virtWindow });

    // TODO - this filter should not be here. Should be where windows are synced
    if (virtWindow.height < 60 || virtWindow.width < 60 || virtWindow.title === "" || /manager/i.test(virtWindow.title)) {
      return app.logger.notice("ignoring window ", virtWindow);
    }

    app.bus.execute({
      action: "openWindow",
      width: virtWindow.width,
      height: virtWindow.height,
      title: virtWindow.title,
      componentName: "virt-window",
      props: {
        virtualWindow: virtWindow
      }
    });
  }
}
