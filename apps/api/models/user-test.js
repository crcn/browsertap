import User   from "./user"
import expect from "expect.js"
import mesh   from "mesh"
import memory from "mesh-memory"
import co     from "co"
import wp     from "common/bus/utils/promise"

describe(__filename + "#", function() {

  var fakeBus;
  var fixture = {
    emailAddress: "a@b.com"
  };

  beforeEach(function(next) {
    fakeBus = memory();
    fakeBus = mesh.limit(1, fakeBus);
    fakeBus({ name: "insert", data: fixture, collection: "users" }).on("end", next);
  })

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

  xit("properly validates the wrong email address and fails", co.wrap(function*() {

    var user = new User({ emailAddress: "abcd" });
    var err;
    try {
      yield user.validate();
    } catch(e) {
      err = e;
    }

    expect(err.message).to.be("invalid");
  }));

  it("only serializes data defined within the schema", function() {
    var user = new User({
      emailAddress: "a@b.com",
      badProp: 12345
    });

    expect(user.serialize().badProp).to.be(void 0);
  });

  it("properly deserializes data", function() {

    var user = new User({
      data: { emailAddress: "a@b.com" }
    });

    expect(user.emailAddress).to.be("a@b.com");
  });
});
