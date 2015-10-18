import TailableBus from "./tailable";
import { NoopBus, Response } from "mesh";
import expect from "expect.js";
import { timeout } from "common/test/utils";

describe(__filename + "#", function() {
  it("can tail a bus for operations", async function() {
    var bus  = NoopBus.create();
    bus      = TailableBus.create(bus);
    var tailCount = 0;
    bus.execute({ action: "tail" }).read().then(function(chunk) {
      expect(chunk.value.action).to.be("op1");
      tailCount++;
    });
    await bus.execute({ action: "op1" }).read();
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

    bus = TailableBus.create(bus);
    bus.execute({ action: "tail" }).read().then(function() {
      tailCount++;
    });
    var response = bus.execute({ action: "op" });
    await response.read();
    expect(tailCount).to.be(0);
    expect(i).to.be(0);
    await response.read(); // end called immediately after
    expect(tailCount).to.be(1);
  });

  it("can end a tail", async function() {
    var bus = NoopBus.create()
    bus     = TailableBus.create(bus);
    var tailCount = 0;

    async function readTails(readable) {
      var value;
      var done;
      while(({value, done} = await readable.read()) && !done) {
        tailCount++;
      }
    }

    var tail = bus.execute({ action: "tail" });
    readTails(tail);
    expect(bus._tails.length).to.be(1);

    await bus.execute({ action: "op" }).read();
    await timeout(0);
    expect(tailCount).to.be(1);
    await bus.execute({ action: "op2" }).read();
    await timeout(0);
    expect(tailCount).to.be(2);
    await tail.cancel();
    await timeout(0);
    expect(bus._tails.length).to.be(0);
  });

  it("can filter operations from getting tailed", async function() {
    var bus = NoopBus.create();
    bus     = TailableBus.create(bus);
    var tailCount = 0;

    async function readTails(readable) {
      var value;
      var done;
      while(({value, done} = await readable.read()) && !done) {
        tailCount++;
      }
    }

    readTails(bus.execute({ action: "tail", filter: { action: /op1|op2/ } }));

    await bus.execute({ action: "op1" }).read();
    await bus.execute({ action: "op2" }).read();
    await bus.execute({ action: "op3" }).read();
    await bus.execute({ action: "op4" }).read();
    expect(tailCount).to.be(2);
  });
});
