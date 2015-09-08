import Signup from "./signup"
import expect from "expect.js"
import { noop } from "common/mesh"

describe(__filename + "#", function() {
  it("cannot be created without the right parameters", function() {
    var err;
    try {
      new Signup();
    } catch(e) { err = e; }
    expect(err.message).to.be("bus.invalid");
  });

  xit("can be created", function() {

    var form = new Signup({
      bus: noop,
      emailAddress: "a@b.com",
      password: "ab"
    });
  });
});