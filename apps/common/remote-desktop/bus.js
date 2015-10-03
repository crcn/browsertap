import { EventEmitter }   from "events";
import mesh               from "common/mesh";
import createWebsocketBus from "common/bus/drivers/websocket";
import createMemoryBus    from "common/bus/drivers/memory";
import co                 from "co";
import sift               from "sift";

// TODO: test me!!
export default function(options) {

  // TODO - add TTL on memory bus
  var memoryBus = createMemoryBus();

  var bus = memoryBus;

  var remoteBus = mesh.reject(sift({ pushed: true }), createWebsocketBus({
    host: options.host
  }, function(operation) {
    operation.pushed = true;

    // feed operation back into the bus so that spies get the update. Also note that this
    // operation will get rejected by the WS bus
    return bus(operation);
  }.bind(this)), memoryBus);

  // pass load operations over to the memory bus.
  // TODO: move this into its own adapter
  bus = createCacheBus(memoryBus, remoteBus);
  bus = mesh.spy(bus);

  return bus;
}


function createCacheBus(localBus, remoteBus) {
  return mesh.accept(sift({ name: "load" }), mesh.fallback(
    localBus,
    function(operation) {

      var ret = new mesh.AsyncResponse();

      function *run() {
        var resp = remoteBus(operation);
        var chunk;
        while(chunk = yield resp.read()) {
          ret.write(chunk);
          yield localBus({ name: "insert", collection: operation.collection, data: chunk }).read();
        }
        ret.end();
      }

      co(run);

      return ret;
    }
  ), remoteBus);
}
