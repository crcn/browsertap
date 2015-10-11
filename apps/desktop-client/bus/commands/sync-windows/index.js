import _command      from "common/mesh/bus/command";
import co            from "co";
import sift          from "sift";
import BrowserWindow from "browser-window";

export default function(app) {

  return _command({
    execute: execute
  });

  function *execute(operation) {

    app.logger.info("synchronizing virtual windows");

    function *run() {

      var spy   = app.bus.execute({
        name: "spy",
        filter: sift({ name: /insert|remove|update/, collection: "virtWindows" })
      });

      var chunk;
      while(chunk = yield spy.read()) {
        switch(chunk.operation.name) {
          case "insert": insert(chunk.operation.data)
        }
      }
    }

    co(run);
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
