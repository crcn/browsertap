import CommandBus from "common/mesh/bus/command";
import sift from "sift";
import WebSocketBus from "common/mesh/bus/websocket";
import syncDbCollection from "common/mesh/utils/sync-db-collection";
import { AcceptBus, AttachDefaultsBus } from "mesh";


export default function(app) {

  return new CommandBus({
    execute: _execute
  });

  function _execute(operation) {
    app.logger.info("synchronizing machines");

    syncDbCollection(
      app.bus,
      "servers",
      {
        insert: _insert
      }
    )
  }

  var _connections = {

  };

  async function _insert(machine) {

    var host = "ws://" + machine.host + ":" + machine.port;

    app.logger.info("connect machine %s", host);

    var bus = _connections = new WebSocketBus({
      app: app,
      host: host
    }, new AttachDefaultsBus({ machine: { _id: machine._id } }, app.bus));

    // add the remove bus.
    // TODO - this needs to be removed
    app.remoteBusses.push(new AcceptBus(sift({
      "target.machine._id": machine._id
    }), bus));

    // TODO - VirtWindow.all(bus)
    var response = bus.execute({ name: "load", collection: "virtWindows", multi: true });
    var chunk;
    while(chunk = await response.read()) {
      if (chunk.done) break;
      if (chunk.value.minimized) continue;
      // TODO = yield new VirtWindow(chunk.value).insert();
      chunk.value.machine = { _id: machine._id };
      await app.bus.execute({ name: "insert", collection: "virtWindows", data: chunk.value }).read();
      // break;
    }
  }
};
