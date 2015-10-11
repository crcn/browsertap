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

    asyncDbCollection(
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
      return app.logger.warn("ignoring window ", virtWindow);
    }

    app.bus.execute({
      name: "openWindow",
      width: virtWindow.width,
      height: virtWindow.height,
      title: virtWindow.title
    });

    // // Create the browser window.
    // var win = new BrowserWindow({
    //   width: virtWindow.width,
    //   height: virtWindow.height
    // });
    //
    // win.setPosition(virtWindow.x, virtWindow.y);
    //
    // // and load the index.html of the app.
    // win.loadUrl('file://' + __dirname + '/virt-window.html');
    //
    // // Emitted when the window is closed.
    // win.on('closed', function() {
    //   // Dereference the window object, usually you would store windows
    //   // in an array if your app supports multi windows, this is the time
    //   // when you should delete the corresponding element.
    //   win = null;
    // });
  }
}
