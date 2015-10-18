import BusWriter from "./bus-writer";
import { WrapBus } from "mesh";
import expect from "expect.js";

describe(__filename + "#", function() {
  it("executes operations whenever written to", async function() {
    var ops = [];
    var w = new BusWriter(WrapBus.create(function(op) {
      ops.push(op);
    }));

    await w.write({ action: "insert" });
    await w.write({ action: "remove" });
    expect(ops.length).to.be(2);
    expect(ops[0].action).to.be("insert");
  });
});
