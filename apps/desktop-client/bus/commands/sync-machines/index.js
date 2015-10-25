import CommandBus from "common/mesh/bus/command";
import sift from "sift";
import WebSocketBus from "common/mesh/bus/websocket";
import syncDbCollection from "common/mesh/utils/sync-collection";
import { AcceptBus, AttachDefaultsBus } from "mesh";

class Machine {
  dispose() {

  }
}

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

    app.bus.execute({ action: "tail"})
    .pipeTo(new Writable(

    ));
    */
    // app.bus.execute({ action: "tail" }).pipeTo(new Writable(new CollectionSink(new Collection())))
    // app.bus.execute({ action: "tail" }).pipeTo()

    // app.bus.execute({ action: "tail" }).pipeTo(BusWriter.create(CollectionBus.create))

    /*
    var machines = ModelCollection.create({ createModel: (data) {
      var bus =
      return {
        update: function(properties) {

        },
        dispose: function() {

        }
      }
    } });

    app.bus
    .execute({ action: "tail" })
    .pipeTo(BusWriter.create(CollectionBus.create(machines)))

    */

    syncDbCollection(
      app.bus,
      "servers",
      {
        insert: _insert
      }
    )

    /*

    */
  }

  var _connections = {

  };

  async function _insert(machine) {

    // TODO
    // var m = new Machine({
    //   bus: WebSocketBus.create
    // })

    var host = "ws://" + machine.host + ":" + machine.port;

    app.logger.info("connect machine %s", host);

    var bus = _connections = WebSocketBus.create({
      app: app,
      host: host
    }, AttachDefaultsBus.create({ machine: { _id: machine._id } }, app.bus));

    // add the remove bus.
    // TODO - this needs to be removed
    app.remoteBusses.push(AcceptBus.create(sift({
      "target.owner._id": machine._id
    }), bus));

    // TODO - VirtWindow.all(bus)
    var response = bus.execute({ action: "load", collection: "virtWindows", multi: true });
    var chunk;
    while(chunk = await response.read()) {
      if (chunk.done) break;
      if (chunk.value.minimized) continue;
      // TODO = yield new VirtWindow(chunk.value).insert();
      chunk.value.owner = { _id: machine._id };
      await app.bus.execute({ action: "insert", collection: "virtWindows", data: chunk.value }).read();
      // break;
    }
  }
};
