import CommandBus from "common/mesh/bus/command";
import BrowserWindow from "browser-window";
import createIPCBus from "desktop-client/bus/drivers/ipc";

export default function(app) {

  return new CommandBus({
    execute: openWindow
  });

  function *openWindow(operation) {

    app.logger.info("open window", operation);

    // Create the browser window.
    var win = new (app.classes.browserWindowClass || BrowserWindow)({
      width  : operation.width,
      height : operation.height
    });

    // and load the index.html of the app.
    win.loadUrl("file://" + __dirname + "/window.html#" + encodeURIComponent(JSON.stringify({
      componentName : operation.componentName || "main",
      title         : operation.title
    })));

    // win.webContents.on('did-finish-load', function() {
    //
    //   win.webContents.on("pong", function() {
    //     console.log("PONG");
    //   });
    //
    //
    //   win.webContents.send("ping", "wing");
    //   // var b = createIPCBus(win.webContents);
    //   // b({ name: "ping" }).read().then(function(chunk) {
    //   //   console.log("response: ", chunk);
    //   // });
    // });
    //
    // win.openDevTools();
  }
}
