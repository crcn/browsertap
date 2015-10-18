import CacheBus from "./cache";
import { NoopBus, EmptyResponse } from "mesh";
import MemoryBus from "./memory";
import expect from "expect.js";
import readAll from "common/mesh/read-all";

describe(__filename + "#", function() {

  it("can be created", async function() {
    CacheBus.create();
  });

  it("on load, takes loaded data from a remote bus and persists it to a local bus", async function() {

    var bus1 = MemoryBus.create();
    var bus2 = MemoryBus.create({
      items: [{ id: 1 }, { id: 2 }]
    });

    var bus3 = CacheBus.create(bus1, bus2);

    await bus3.execute({ name: "load", collection: "items", multi: true }).read();
    expect((await readAll(bus1.execute({ name: "load", collection: "items", multi: true }))).length).to.be(2);
  });
});
