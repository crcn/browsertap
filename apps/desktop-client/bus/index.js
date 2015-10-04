import commands from "./commands";
import createMemoryBus from "common/bus/drivers/memory";
import createCacheBus from "common/bus/drivers/cache-bus";
import { noop, spy } from "common/mesh";

export default function(app, bus) {
  if (!bus) bus = noop;

  // where the stuff is stored
  bus = createMemoryBus();
  bus = commands(app, bus);
  bus = spy(bus);

  return bus;
}
