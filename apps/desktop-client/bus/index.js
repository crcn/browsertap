import InternalCommandsBus from "./commands";
import MemoryBus from "common/mesh/bus/memory";
import CacheBus from "common/mesh/bus/cache-bus";
import { NoopBus } from "mesh";
import SpyBus from "common/mesh/bus/spy";
import UpsertBus from "common/mesh/bus/upsert";

export default function(app, bus) {
  if (!bus) bus = new NoopBus();

  // where the stuff is stored
  bus = new MemoryBus();
  bus = new InternalCommandsBus(app, bus);
  bus = new SpyBus(bus);
  bus = new UpsertBus(bus);

  this.execute = bus.execute.bind(bus);
}
