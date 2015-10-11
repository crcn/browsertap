import CommandBus    from "common/mesh/bus/command";
import co            from "co";
import sift          from "sift";
import BrowserWindow from "browser-window";
import syncDbCollection from "common/mesh/utils/sync-db-collection";

export default function(app) {

  return new CommandBus({
    execute: execute
  });

  function *execute(operation) {

    app.logger.info("synchronizing virtual windows");


    syncDbCollection(
      app.bus,
      "virtWindows",
      {
        insert: insert
      }
    );
  }

  var _windows = {

  };

  function remove() {

  }

  function insert(virtWindow) {

    // TODO - app.bus.execute({ name: "openWindow", model: virtWindow });

    app.logger.info("open virtual window ", virtWindow);

    if (virtWindow.height < 60 || virtWindow.width < 60) {
      return app.logger.notice("ignoring window ", virtWindow);
    }

    app.bus.execute({
      name: "openWindow",
      width: virtWindow.width,
      height: virtWindow.height,
      title: virtWindow.title
    });
  }
}
