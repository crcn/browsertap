var expect = require("expect.js");
var mesh   = require("common/mesh");
var sift   = require("sift");
var co     = require("co");
var runOp  = require("common/bus/utils/promise");
var User   = require("api/data/models/user");
var SignupForm = require("api/data/forms/signup");

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

    it("cannot register a new user if a password is not present", co.wrap(function*() {
      var err;

      try {
        yield bus({
          name: "register",
          data: { emailAddress: "a@b.com" }
        });
      } catch(e) {
        err = e;
      }

      expect(err.statusCode).to.be(400);
    }));

    it("can register a new user if the password is present", co.wrap(function*() {
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      var user = yield form.submit();
      expect(user.emailAddress).to.be(fixtures.user1.emailAddress);
      expect(user.password).to.be(void 0);
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
