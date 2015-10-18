import TailableBus from "./tailable";
import { NoopBus, Response } from "mesh";
import expect from "expect.js";
import { timeout } from "common/test/utils";

describe(__filename + "#", function() {
  it("can tail a bus for operations", async function() {
    var bus  = new NoopBus();
    bus      = new TailableBus(bus);
    var tailCount = 0;
    bus.execute({ name: "tail" }).read().then(function(chunk) {
      expect(chunk.value.name).to.be("op1");
      tailCount++;
    });
    await bus.execute({ name: "op1" }).read();
    await timeout(0);
    expect(tailCount).to.be(1);

  });

  it("only tails operations after execution", async function() {
    var i = 0;
    var tailCount = 0;
    var bus = {
      execute: function(operation) {
        return new Response(async function(writable) {
          await writable.write("a");
          await writable.write("b");
          i++;
          await writable.close();
        });
      }
    };

    bus = new TailableBus(bus);
    bus.execute({ name: "tail" }).read().then(function() {
      tailCount++;
    });
    var response = bus.execute({ name: "op" });
    await response.read();
    expect(tailCount).to.be(0);
    expect(i).to.be(0);
    await response.read(); // end called immediately after
    expect(tailCount).to.be(1);
  });

  it("can end a tail", async function() {
    var bus = new NoopBus()
    bus     = new TailableBus(bus);
    var tailCount = 0;

    async function readTails(readable) {
      var value;
      var done;
      while(({value, done} = await readable.read()) && !done) {
        tailCount++;
      }
    }

    var tail = bus.execute({ name: "tail" });
    readTails(tail);
    expect(bus._tails.length).to.be(1);

    await bus.execute({ name: "op" }).read();
    await timeout(0);
    expect(tailCount).to.be(1);
    await bus.execute({ name: "op2" }).read();
    await timeout(0);
    expect(tailCount).to.be(2);
    await tail.cancel();
    await timeout(0);
    expect(bus._tails.length).to.be(0);
  });

  it("can filter operations from getting tailed", async function() {
    var bus = new NoopBus();
    bus     = new TailableBus(bus);
    var tailCount = 0;

    async function readTails(readable) {
      var value;
      var done;
      while(({value, done} = await readable.read()) && !done) {
        tailCount++;
      }
    }

    readTails(bus.execute({ name: "tail", filter: { name: /op1|op2/ } }));

    await bus.execute({ name: "op1" }).read();
    await bus.execute({ name: "op2" }).read();
    await bus.execute({ name: "op3" }).read();
    await bus.execute({ name: "op4" }).read();
    expect(tailCount).to.be(2);
  });
});
