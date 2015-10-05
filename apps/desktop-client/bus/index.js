import commands from "./commands";
import createMemoryBus from "common/bus/drivers/memory";
import createCacheBus from "common/bus/drivers/cache-bus";
import { noop, spy } from "common/mesh";
import createUpsertBus from "common/bus/drivers/upsert";

export default function(app, bus) {
  if (!bus) bus = noop;

  // where the stuff is stored
  bus = createMemoryBus();
  bus = createUpsertBus(bus)
  bus = commands(app, bus);
  bus = spy(bus);
  bus = createUpsertBus(bus);

  return bus;
}
