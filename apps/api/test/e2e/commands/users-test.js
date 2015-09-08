var expect     = require("expect.js");
var mesh       = require("common/mesh");
var sift       = require("sift");
var co         = require("co");
var runOp      = require("common/bus/utils/promise");
var User       = require("api/data/models/user");
var SignupForm = require("api/data/forms/signup");
var LoginForm  = require("api/data/forms/login");

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
      expect(user.keys).to.be(void 0);
      expect(user._id).not.to.be(void 0);
    }));

    it("cannot register a user if the email address already exists", co.wrap(function*() {
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      yield form.submit();

      var err;
      try {
        yield form.submit();
      } catch(e) {
        err = e;
      }

      expect(err.statusCode).to.be(409);
    }));

    it("can login a user", co.wrap(function*() {
      yield new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
      var form = new LoginForm(Object.assign({ bus: bus }, fixtures.user1));
      var user = yield form.submit();
    }));

    it("cannot login a user with a bad password", co.wrap(function*() {
      yield new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
      var form = new LoginForm(Object.assign({ bus: bus }, { emailAddress: "a@b.com", password: "passssssword" }));
      var err;
      try {
        yield form.submit();
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(401);
    }));

    it("returns an error if an email address does not exist while logging in", co.wrap(function*() {
      var form = new LoginForm(Object.assign({ bus: bus }, { emailAddress: "a@b.com", password: "passssssword" }));
      var err;
      try {
        yield form.submit();
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(404);
    }));
  });
});
