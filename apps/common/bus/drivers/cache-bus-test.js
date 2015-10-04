import cacheBus from "./cache-bus";
import { noop, NoResponse } from "common/mesh";
import co from "co";
import memory from "./memory";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("can be created", co.wrap(function*() {
    cacheBus();
  }));

  it("on load, takes loaded data from a remote bus and persists it to a local bus", co.wrap(function*() {

    var bus1 = memory();
    var bus2 = memory({
      items: [{ id: 1 }, { id: 2 }]
    });

    var bus3 = cacheBus(bus1, bus2);

    yield bus3({ name: "load", collection: "items", multi: true });
    expect((yield bus1({ name: "load", collection: "items", multi: true }).readAll()).length).to.be(2);
  }));
});
