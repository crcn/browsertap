import spy              from "./spy";
import yields           from "./yields";
import co               from "co";
import { BaseResponse } from "./_responses";
import expect           from "expect.js";

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
});
