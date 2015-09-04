import User from "./user"
import expect from "expect.js"
import mesh from "mesh"
import co from "co"

describe(__filename + "#", function() {

  it("properly validates the model email and fails", co.wrap(function*() {
    var user = new User();
    var err;
    try {
      yield user.validate();
    } catch(e) {
      err = e;
    }
    expect(err.message).to.be("not defined");
  }));

  it("properly validates the wrong email address and fails", co.wrap(function*() {

    var user = new User({ emailAddress: "abcd" });
    var err;
    try {
      yield user.validate();
    } catch(e) {
      err = e;
    }

    expect(err.message).to.be("invalid");
  }));

  it("cannot insert a user if it exists", co.wrap(function*() {
    var user = new User({
      bus: mesh.yields(void 0, { emailAddress: "Blarg" })
    });

    var err;

    try {
      yield user.insert();
    } catch(e) { err = e; }

    expect(err.message).to.be("user already exists");
  }));
});
