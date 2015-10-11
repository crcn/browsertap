import CommandBus from "common/mesh/bus/command";
import sift from "sift";
import WebSocketBus from "common/mesh/bus/websocket";
import co from "co";

export default function(app) {

  return new CommandBus({
    execute: _execute
  });

  function *_execute(operation) {
    app.logger.info("synchronizing machines");

    var spy = app.bus.execute({
      name: "spy",
      filter: sift({ name: /insert|remove|update/, collection: "servers" })
    });

    async function run() {
      var value;
      while({value} = await spy.read()) {
        if (!value) break;
        switch(value.operation.name) {
          case "insert": await _insert(value.operation.data)
        }
      }
    };

    run();

  }

  var _connections = {

  };

  async function _insert(machine) {

    var host = "ws://" + machine.host + ":" + machine.port;

    app.logger.info("connect machine %s", host);

    var bus = _connections = new WebSocketBus({
      app: app,
      host: host
    }, app.bus);

    // TODO - VirtWindow.all(bus)
    var response = bus.execute({ name: "load", collection: "virtWindows", multi: true });
    var chunk;
    while(chunk = await response.read()) {
      if (chunk.done) break;
      await app.bus.execute({ name: "insert", collection: "virtWindows", data: chunk }).read();
    }
  }
};
