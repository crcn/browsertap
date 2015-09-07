var expect = require("expect.js");
var mesh   = require("mesh");
var sift   = require("sift");
var co     = require("co");
var runOp  = require("common/bus/utils/promise");
var User   = require("api/models/user");

describe(__filename + "#", function() {

  var bus;
  var fixtures = {
    user1: {
      emailAddress: "a@b.com",
      password: "password"
    }
  };

  beforeEach(function() {
    bus = mesh.attach({ public: true }, global.apiApp.bus);
  });

  describe("insert# ", function() {

    xit("cannot register a new user if a password is not present", co.wrap(function*() {
      var user = new User({ bus: bus, data: { emailAddress: fixtures.user1.emailAddress }});
      var err;

      try {
        yield user.insert();
      } catch(e) {
        err = e;
      }

      expect(err).not.to.be(void 0);
    }));

    xit("can register a new user if the password is present", co.wrap(function*() {
      var user = new User({ bus: bus, data: fixtures.user1 });
      expect(user._id).to.be(void 0);
      yield user.insert();
      expect(user._id).not.to.be(void 0);
    }));

    xit("cannit register a user if the email address already exists");

    xit("cannot login a registered user if the password is not present", co.wrap(function*() {
      var u = new User({ bus: bus, data: fixtures.user1 });
      yield u.insert();

      var err;
      try {
        var user = yield User.findOne(bus, { emailAddress: u.emailAddress });;
        expect(user._id).to.be(u._id);
      } catch(e) {
        err = e;
      }

      expect(err.message.toLowerCase()).to.be("password must be present");
    }));
  });
});
