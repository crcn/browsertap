import command from "common/bus/drivers/command";
import BrowserWindow from "browser-window";
import createIPCBus from "desktop-client/bus/drivers/ipc";

export default function(app) {
  return command({
    execute: openWindow
  });

  function *openWindow(operation) {

    app.logger.info("open window", operation);

    // Create the browser window.
    var win = new BrowserWindow({
      width  : operation.width,
      height : operation.height,
      frame  : false
    });

    // and load the index.html of the app.
    win.loadUrl("file://" + __dirname + "/window.html#" + encodeURIComponent(JSON.stringify({
      componentName : "main",
      title         : operation.title
    })));

    win.webContents.on('did-finish-load', function() {
      var b = createIPCBus(win.webContents);
      b({ name: "ping" }).read().then(function(chunk) {
        console.log("response: ", chunk);
      });
    });

    win.openDevTools();
  }
}