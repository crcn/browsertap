import _command      from "common/bus/drivers/command";
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

      var spy   = app.bus({
        name: "spy",
        filter: sift({ name: /insert|remove|update/, collection: "virt-windows" })
      });

      var chunk;
      while(chunk = yield spy.read()) {
        switch(chunk.operation.name) {
          case "insert": insert(chunk.operation.data)
        }
      }
    }

    co(run);

    for (var i = 10; i--;)
    yield app.bus({ name: "insert", collection: "virt-windows", data: {
      width: 500,
      height: 500,
      x: i * 100,
      y: 100
    }});
  }

  var _windows = {

  };

  function remove() {
    
  }

  function insert(virtWindow) {

    app.logger.info("open virtual window ", virtWindow);

    // Create the browser window.
    var win = new BrowserWindow({
      width: virtWindow.width,
      height: virtWindow.height
    });

    win.setPosition(virtWindow.x, virtWindow.y);

    // and load the index.html of the app.
    win.loadUrl('file://' + __dirname + '/virt-window.html');

    // Emitted when the window is closed.
    win.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null;
    });
  }
}
