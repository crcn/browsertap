import CommandBus from "common/mesh/bus/command";
import BrowserWindow from "browser-window";
import IPCBus from "desktop-client/bus/drivers/ipc";
import { AttachDefaultsBus } from "mesh";

export default function(app) {

  return new CommandBus({
    execute: openWindow
  });

  function *openWindow(operation) {

    app.logger.info("open window", operation);

    // Create the browser window.
    var win = new (app.classes.browserWindowClass || BrowserWindow)({
      width  : operation.width,
      height : operation.height,
      frame  : false
    });

    // and load the index.html of the app.
    win.loadUrl("file://" + __dirname + "/window.html#" + encodeURIComponent(JSON.stringify({
      componentName : operation.componentName || "main",
      title         : operation.title,
      props         : operation.props
    })));

    async function _spyToIPC(bus) {
      var spy = bus.execute({ name: "spy" });
      var ipc = new IPCBus(require("ipc"), win.webContents, new AttachDefaultsBus({ remote: true }, bus));
      var chunk;
      while(chunk = await spy.read()) {
        if (chunk.value.operation.remote) continue;
        ipc.execute(chunk.value.operation);
      }
    }

    _spyToIPC(app.bus);
  }
}
