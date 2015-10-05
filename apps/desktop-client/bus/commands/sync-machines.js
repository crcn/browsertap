import _command from "common/bus/drivers/command";
import sift from "sift";
import createWebSocketBus from "common/bus/drivers/websocket";
import co from "co";

export default function(app) {

  return _command({
    execute: _execute
  });

  function *_execute(operation) {
    app.logger.info("synchronizing machines");

    var spy = app.bus({
      name: "spy",
      filter: sift({ name: /insert|remove|update/, collection: "servers" })
    });

    co(function*() {
      var spied;
      while(spied = yield spy.read()) {
        switch(spied.operation.name) {
          case "insert": yield _insert(spied.operation.data)
        }
      }
    });

  }

  var _connections = {

  };

  function *_insert(machine) {

    var host = "ws://" + machine.host + ":" + machine.port;

    app.logger.info("connect machine %s", host);

    var bus = _connections = createWebSocketBus({
      host: host
    }, app.bus);

    // TODO - VirtWindow.all(bus)
    var response = bus({ name: "load", collection: "virtWindows", multi: true });
    var chunk;
    while(chunk = yield response.read()) {
      // yield app.bus({ name: "insert", collection: "virtWindows", data: chunk });
    }
  }
};
