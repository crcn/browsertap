import { EventEmitter }   from "events";
import { RejectBus }       from "mesh";
import SpyBus               from "common/mesh/bus/spy";
import WebsocketBus from "common/mesh/bus/websocket";
import MemoryBus    from "common/mesh/bus/memory";
import CacheBus     from "common/mesh/bus/cache-bus";
import co                 from "co";
import sift               from "sift";

// TODO: test me!!
export default function(options) {

  // TODO - add TTL on memory bus
  var memoryBus = new MemoryBus();

  var bus = memoryBus;

  var remoteBus = new RejectBus(sift({ remote: true }), new WebsocketBus({
    host: options.host
  }, function(operation) {
    operation.remote = true;

    // feed operation back into the bus so that spies get the update. Also note that this
    // operation will get rejected by the WS bus
    return bus.execute(operation);
  }.bind(this)), memoryBus);

  // pass load operations over to the memory bus.
  // TODO: move this into its own adapter
  bus = new CacheBus(memoryBus, remoteBus);
  bus = new SpyBus(bus);

  this.execute = bus.execute.bind(bus);
}
