import { EventEmitter }   from "events";
import mesh               from "common/mesh";
import createWebsocketBus from "common/bus/drivers/websocket";
import createMemoryBus    from "common/bus/drivers/memory";
import createCacheBus     from "common/bus/drivers/cache-bus";
import co                 from "co";
import sift               from "sift";

// TODO: test me!!
export default function(options) {

  // TODO - add TTL on memory bus
  var memoryBus = createMemoryBus();

  var bus = memoryBus;

  var remoteBus = mesh.reject(sift({ remote: true }), createWebsocketBus({
    host: options.host
  }, function(operation) {
    operation.remote = true;

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
