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

    co(function*() {
      var value;
      while({value} = yield spy.read()) {
        if (!value) break;
        switch(value.operation.name) {
          case "insert": yield _insert(value.operation.data)
        }
      }
    });

  }

  var _connections = {

  };

  function *_insert(machine) {

    var host = "ws://" + machine.host + ":" + machine.port;

    app.logger.info("connect machine %s", host);

    var bus = _connections = new WebSocketBus({
      host: host
    }, app.bus);

    // TODO - VirtWindow.all(bus)
    var response = bus.execute({ name: "load", collection: "virtWindows", multi: true });
    var value;
    var done;
    while({value, done} = yield response.read()) {
      if (done) break;
      yield app.bus.execute({ name: "insert", collection: "virtWindows", data: value }).read();
    }
  }
};
