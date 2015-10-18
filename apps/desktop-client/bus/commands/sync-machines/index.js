import CommandBus from "common/mesh/bus/command";
import sift from "sift";
import WebSocketBus from "common/mesh/bus/websocket";
import syncDbCollection from "common/mesh/utils/sync-db-collection";
import { AcceptBus, AttachDefaultsBus } from "mesh";


export default function(app) {

  return CommandBus.create({
    execute: _execute
  });

  function _execute(operation) {
    app.logger.info("synchronizing machines");

    /*

    var bus = RoundRobinBus.create([
      WrapBus.create((operation) => fetch(operation)),
      WrapBus.create((operation) => fetch(operation))
    ]);

    bus.execute({

  })

    app.bus.execute({ name: "tail"})
    .pipeTo(new Writable(

    ));
    */
    // app.bus.execute({ name: "tail" }).pipeTo(new Writable(new CollectionSink(new Collection())))
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

    var bus = _connections = WebSocketBus.create({
      app: app,
      host: host
    }, AttachDefaultsBus.create({ machine: { _id: machine._id } }, app.bus));

    // add the remove bus.
    // TODO - this needs to be removed
    app.remoteBusses.push(AcceptBus.create(sift({
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
