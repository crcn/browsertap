import Account from "./account"
import expect from "expect.js"
import mesh from "mesh"
import co from "co"

describe(__filename + "#", function() {

  it("properly validates the model email and fails", co.wrap(function*() {
    var account = new Account();
    var err;
    try {
      yield account.validate();
    } catch(e) {
      err = e;
    }
    expect(err.message).to.be("not defined");
  }));

  it("properly validates the wrong email address and fails", co.wrap(function*() {

    var account = new Account({ emailAddress: "abcd" });
    var err;
    try {
      yield account.validate();
    } catch(e) {
      err = e;
    }

    expect(err.message).to.be("invalid");
  }));
});
