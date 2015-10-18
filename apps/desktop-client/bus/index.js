import InternalCommandsBus from "./commands";
import MemoryBus from "common/mesh/bus/memory";
import CacheBus from "common/mesh/bus/cache";
import { NoopBus, FallbackBus } from "mesh";
import SpyBus from "common/mesh/bus/spy";
import UpsertBus from "common/mesh/bus/upsert";
import IPCBus from "./drivers/ipc";

export default {
  create: function(app, bus) {
    if (!bus) bus = NoopBus.create();

    app.remoteBusses = [];

    // where the stuff is stored
    bus = MemoryBus.create();
    bus = InternalCommandsBus.create(app, bus);
    bus = FallbackBus.create([FallbackBus.create(app.remoteBusses), bus]);
    bus = SpyBus.create(bus);
    bus = UpsertBus.create(bus);

    return bus;
  }
}
