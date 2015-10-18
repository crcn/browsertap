import SpyBus           from "./spy";
import { Response, NoopBus }  from "mesh";
import expect           from "expect.js";
import sift             from "sift";

describe(__filename + "#", function() {
  it("can spy on a bus that does not emit anything", async function() {
    var bus = NoopBus();
    bus     = SpyBus.create(bus);

    async function runSpy() {
      var sp = bus.execute({ action: "spy" });
      expect((await sp.read()).value.response).to.be.an(Response);
    }

    var p = runSpy();

    bus.execute({ action: "doSomething" });

    return p;
  });

  it("can add a filter to a spy", async function() {
    var bus1 = NoopBus.create();
    var bus  = SpyBus.create(bus1);

    async function run() {
      var sp = bus.execute({ action: "spy", filter: sift({ action: "op2" }) });
      expect((await sp.read()).value.operation.action).to.be("op2");
    }

    var ret = run();

    bus.execute({ action: "op1" });
    bus.execute({ action: "op2" });

    return ret;
  });
});
