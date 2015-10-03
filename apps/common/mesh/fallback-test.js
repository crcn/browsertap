import fallback from "./fallback";
import yields   from "./yields";
import co       from "co";
import expect   from "expect.js";

describe(__filename + "#", function() {
  it("falls back the next busses if the previous don't emit data", co.wrap(function*() {
    var bus1 = yields();
    var bus2 = yields(void 0, [1, 2]);
    var bus3 = yields(void 0, [3, 4, 5]);
    var bus  = fallback(bus1, bus2);

    var data = yield bus().readAll();
    expect(data.length).to.be(2);
    expect(data[0]).to.be(1);
    expect(data[1]).to.be(2);
  }));
});
