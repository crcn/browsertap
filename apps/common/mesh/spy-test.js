import spy              from "./spy";
import yields           from "./yields";
import co               from "co";
import { BaseResponse } from "./_responses";
import expect           from "expect.js";
import sift             from "sift";

describe(__filename + "#", function() {
  it("can spy on a bus that does not emit anything", co.wrap(function*(cb) {
    var bus = yields();
    bus     = spy(bus);

    function *runSpy() {
      var sp = bus({ name: "spy" });
      expect((yield sp.read()).response).to.be.an(BaseResponse);
    }

    var p = co(runSpy);

    bus({ name: "doSomething" });

    return p;
  }));

  it("can add a filter to a spy", co.wrap(function*(cb) {
    var bus1 = yields();
    var bus  = spy(bus1);

    var ret = co(function*() {
      var sp = bus({ name: "spy", filter: sift({ name: "op2" }) });
      expect((yield sp.read()).operation.name).to.be("op2");
    });

    bus({ name: "op1" });
    bus({ name: "op2" });

    return ret;
  }));
});
