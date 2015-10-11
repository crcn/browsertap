import MemoryBus from "./memory";
import co        from "co";
import expect    from "expect.js";
import readAll   from "common/mesh/read-all";

describe(__filename + "#", function() {
  it("can be created", function() {
    new MemoryBus();
  });

  it("throws an error if the collection is not defined", co.wrap(function*() {
    var e;
    try {
      var bus = new MemoryBus();
      yield bus.execute({ name: "insert" }).read();
    } catch(err) { e = err; }
    expect(e.message).to.contain("must not be undefined");
  }));

  it("noops if the operation is not supported by the bus", co.wrap(function*() {
    var bus = new MemoryBus();
    yield bus.execute({ name: "doesNotExist" }).read();
  }));

  it("can insert & load data from the mem bus", co.wrap(function*() {
    var bus = new MemoryBus();
    var {value} = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(value.id).to.be(1);
    var {value} = yield bus.execute({ name: "load", collection: "items", query: { id: 1 }}).read();
    expect(value.id).to.be(1);
  }));

  it("will only load one item if multi=false", co.wrap(function*() {
    var bus = new MemoryBus();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var data = yield readAll(bus.execute({ name: "load", collection: "items", query: { id: 1 }}));
    expect(data.length).to.be(1);
  }));

  it("will multiple items if multi=true", co.wrap(function*() {
    var bus = new MemoryBus();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var data = yield readAll(bus.execute({ name: "load", collection: "items", multi: true, query: { id: 1 }}));
    expect(data.length).to.be(3);
  }));

  it("can update data in a collection", co.wrap(function*() {
    var bus = new MemoryBus();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var updatedData = yield bus.execute({ name: "update", collection: "items", data: { id: 1, name: "blarg" }, query: { id: 1 }}).read();
    expect(updatedData.value.name).to.be("blarg");
    expect(data.value.name).to.be(void 0);
  }));

  it("can remove an item from the collection", co.wrap(function*() {
    var bus = new MemoryBus();
    var data = yield bus.execute({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var data = yield readAll(bus.execute({ name: "load", collection: "items", query: { id: 1 }}));
    expect(data.length).to.be(1);
    yield readAll(bus.execute({ name: "remove", collection: "items", query: { id: 1 }}));
    var data = yield readAll(bus.execute({ name: "load", collection: "items", query: { id: 1 }}));
    expect(data.length).to.be(0);
  }));
});
