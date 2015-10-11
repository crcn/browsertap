import SpyBus           from "./spy";
import { Response, NoopBus }  from "mesh";
import co               from "co";
import expect           from "expect.js";
import sift             from "sift";

describe(__filename + "#", function() {
  it("can spy on a bus that does not emit anything", co.wrap(function*(cb) {
    var bus = NoopBus();
    bus     = new SpyBus(bus);

    function *runSpy() {
      var sp = bus.execute({ name: "spy" });
      expect((yield sp.read()).value.response).to.be.an(Response);
    }

    var p = co(runSpy);

    bus.execute({ name: "doSomething" });

    return p;
  }));

  it("can add a filter to a spy", co.wrap(function*(cb) {
    var bus1 = new NoopBus();
    var bus  = new SpyBus(bus1);

    var ret = co(function*() {
      var sp = bus.execute({ name: "spy", filter: sift({ name: "op2" }) });
      expect((yield sp.read()).value.operation.name).to.be("op2");
    });

    bus.execute({ name: "op1" });
    bus.execute({ name: "op2" });

    return ret;
  }));
});
