import TailableBus from "./tailable";
import { NoopBus, AsyncResponse } from "mesh";
import expect from "expect.js";

describe(__filename + "#", function() {
  it("can tail a bus for operations", async function() {
    var bus  = new NoopBus();
    bus      = new TailableBus(bus);
    var tailCount = 0;
    bus.execute({ name: "tail" }).read().then(function(chunk) {
      expect(chunk.value.name).to.be("op1");
      tailCount++;
    });
    await bus.execute({ name: "op1" });
    expect(tailCount).to.be(1);
  });

  it("only tails operations after execution", async function() {
    var i = 0;
    var tailCount = 0;
    var bus = {
      execute: function(operation) {
        return new AsyncResponse(async function(writable) {
          await writable.write("a");
          await writable.write("b");
          i++;
          await writable.end();
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

    await bus.execute({ name: "op" });
    expect(tailCount).to.be(1);
    await bus.execute({ name: "op2" });
    expect(tailCount).to.be(2);
    await tail.end();
    expect(bus._tails.length).to.be(0);
    // await bus.execute({ name: "op3" });
    // expect(tailCount).to.be(2);
    // await bus.execute({ name: "op4" });
    // expect(tailCount).to.be(2);

  });
});
