import InternalCommandsBus from "./commands";
import MemoryBus from "common/mesh/bus/memory";
import CacheBus from "common/mesh/bus/cache";
import { NoopBus, FallbackBus } from "mesh";
import SpyBus from "common/mesh/bus/spy";
import UpsertBus from "common/mesh/bus/upsert";
import IPCBus from "./drivers/ipc";

export default function(app, bus) {
  if (!bus) bus = new NoopBus();

  app.remoteBusses = [];

  // where the stuff is stored
  bus = new MemoryBus();
  bus = new InternalCommandsBus(app, bus);
  bus = new FallbackBus([new FallbackBus(app.remoteBusses), bus]);
  bus = new SpyBus(bus);
  bus = new UpsertBus(bus);

  this.execute = bus.execute.bind(bus);
}
