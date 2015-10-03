import createMemoryBus from "./memory";
import co              from "co";
import expect          from "expect.js";

describe(__filename + "#", function() {
  it("can be created", function() {
    createMemoryBus();
  });

  it("throws an error if the collection is not defined", co.wrap(function*() {
    var e;
    try {
      yield createMemoryBus()({ name: "insert" }).read();
    } catch(err) { e = err; }
    expect(e.message).to.contain("must not be undefined");
  }));

  it("noops if the operation is not supported by the bus", co.wrap(function*() {
    var bus = createMemoryBus();
    yield createMemoryBus()({ name: "doesNotExist" }).read();
  }));

  it("can insert & load data from the mem bus", co.wrap(function*() {
    var bus = createMemoryBus();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.id).to.be(1);
    var data = yield bus({ name: "load", collection: "items", query: { id: 1 }}).read();
    expect(data.id).to.be(1);
  }));

  it("will only load one item if multi=false", co.wrap(function*() {
    var bus = createMemoryBus();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.id).to.be(1);
    var data = yield bus({ name: "load", collection: "items", query: { id: 1 }}).readAll();
    expect(data.length).to.be(1);
  }));

  it("will multiple items if multi=true", co.wrap(function*() {
    var bus = createMemoryBus();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.id).to.be(1);
    var data = yield bus({ name: "load", collection: "items", multi: true, query: { id: 1 }}).readAll();
    expect(data.length).to.be(3);
  }));

  it("can update data in a collection", co.wrap(function*() {
    var bus = createMemoryBus();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.id).to.be(1);
    var updatedData = yield bus({ name: "update", collection: "items", data: { id: 1, name: "blarg" }, query: { id: 1 }}).read();
    expect(updatedData.name).to.be("blarg");
    expect(data.name).to.be(void 0);
  }));

  it("can remove an item from the collection", co.wrap(function*() {
    var bus = createMemoryBus();
    var data = yield bus({ name: "insert", collection: "items", data: { id: 1 } }).read();
    expect(data.id).to.be(1);
    var data = yield bus({ name: "load", collection: "items", query: { id: 1 }}).readAll();
    expect(data.length).to.be(1);
    yield bus({ name: "remove", collection: "items", query: { id: 1 }}).readAll();
    var data = yield bus({ name: "load", collection: "items", query: { id: 1 }}).readAll();
    expect(data.length).to.be(0);
  }));
});
