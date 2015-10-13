import SpyBus           from "./spy";
import { Response, NoopBus }  from "mesh";
import expect           from "expect.js";
import sift             from "sift";

describe(__filename + "#", function() {
  it("can spy on a bus that does not emit anything", async function() {
    var bus = NoopBus();
    bus     = new SpyBus(bus);

    async function runSpy() {
      var sp = bus.execute({ name: "spy" });
      expect((await sp.read()).value.response).to.be.an(Response);
    }

    var p = runSpy();

    bus.execute({ name: "doSomething" });

    return p;
  });

  it("can add a filter to a spy", async function() {
    var bus1 = new NoopBus();
    var bus  = new SpyBus(bus1);

    async function run() {
      var sp = bus.execute({ name: "spy", filter: sift({ name: "op2" }) });
      expect((await sp.read()).value.operation.name).to.be("op2");
    }

    var ret = run();

    bus.execute({ name: "op1" });
    bus.execute({ name: "op2" });

    return ret;
  });
});
