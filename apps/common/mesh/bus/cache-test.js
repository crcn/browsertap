import CacheBus from "./cache";
import { NoopBus, EmptyResponse } from "mesh";
import co from "co";
import MemoryBus from "./memory";
import expect from "expect.js";
import readAll from "common/mesh/read-all";

describe(__filename + "#", function() {

  it("can be created", co.wrap(function*() {
    new CacheBus();
  }));

  it("on load, takes loaded data from a remote bus and persists it to a local bus", co.wrap(function*() {

    var bus1 = new MemoryBus();
    var bus2 = new MemoryBus({
      items: [{ id: 1 }, { id: 2 }]
    });

    var bus3 = new CacheBus(bus1, bus2);

    yield bus3.execute({ name: "load", collection: "items", multi: true }).read();
    expect((yield readAll(bus1.execute({ name: "load", collection: "items", multi: true }))).length).to.be(2);
  }));
});
