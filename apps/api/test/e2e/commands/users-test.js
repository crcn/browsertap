import expect from "expect.js";
import mesh from "common/mesh";
import sift from "sift";
import co from "co";
import runOp from "common/bus/utils/promise";
import User from "api/data/models/user";
import SignupForm from "common/data/forms/signup";
import LoginForm from "common/data/forms/login";
import ForgotPasswordForm from "common/data/forms/forgot-password";
import ResetPasswordForm from "common/data/forms/reset-password";
import Token from "api/data/models/token";

describe(__filename + "#", function() {

  var bus;
  var fixtures = {
    user1: {
      emailAddress: "a@b.com",
      password: "password",
      repeatPassword: "password"
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
      var session = yield form.submit();
      expect(session.user.emailAddress).to.be(fixtures.user1.emailAddress);
      expect(session.user.password).to.be(void 0);
      expect(session.user.keys).to.be(void 0);
      expect(session._id).not.to.be(void 0);
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

    it("returns a 404 if resetting a password on an email that does not exist", co.wrap(function*() {
      var form = new ForgotPasswordForm(Object.assign({ bus: bus }, { emailAddress: "not-exists@b.com"  }));
      var err;
      try {
        yield form.submit();
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(404);
    }));

    it("successfuly sends a password reset email", co.wrap(function*() {
      yield new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
      var form = new ForgotPasswordForm(Object.assign({ bus: bus }, { emailAddress: fixtures.user1.emailAddress }));
      yield form.submit();
      var message = apiApp.emailer.outbox.messages.pop();
      expect(message.subject.valueOf()).to.be("Password reset");
    }));

    it("cannot reset a password it the passwords do not match", co.wrap(function*() {
      var err;
      try {
        var form = new ResetPasswordForm(Object.assign({ bus: bus }, {
          token: { _id: "123456789123456789123456" },
          password: "password1",
          repeatPassword: "password2"
        }));
      } catch(e) {
        err = e;
      }
      expect(err.message).to.be("repeatPassword.invalid");
    }));

    it("cannot reset a password if the token does not exist", co.wrap(function*() {
      var err;

      var form = new ResetPasswordForm(Object.assign({ bus: bus }, {
        token: { _id: "123456789123456789123456" },
        password: "password1",
        repeatPassword: "password1"
      }));

      var err;
      try {
        yield form.submit();
      } catch(e) {
        err = e;
      }

      expect(err.message).to.be("token does not exist");
    }));

    it("new user has an organization", co.wrap(function*() {
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      yield form.submit();
      var user = yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() });
      var organizations = yield user.getOrganizations();
      expect(organizations.length).to.be(1);
      expect(organizations[0].access[0].user._id.valueOf()).to.be(user._id.valueOf());
    }));

    describe("with a token", function() {

      var tokenId;

      beforeEach(co.wrap(function*() {
        yield new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
        var form = new ForgotPasswordForm(Object.assign({ bus: bus }, { emailAddress: fixtures.user1.emailAddress }));
        yield form.submit();
        var message = apiApp.emailer.outbox.messages.pop();
        tokenId = message.body.match(/reset-password\/(.*)/)[1];
      }));

      it("can reset the password", co.wrap(function*() {
        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        yield form.submit();
      }));

      it("cannot re-use a token after it's been used", co.wrap(function*() {
        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        yield form.submit();

        var err;

        try {
          yield form.submit();
        } catch(e) {
          err = e;
        }
        expect(err.statusCode).to.be(404);
      }));

      it("can login with the new password after it's been reset", co.wrap(function*() {
        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        yield form.submit();

        var lform = new LoginForm({
          bus: bus,
          emailAddress: fixtures.user1.emailAddress,
          password: form.password
        });

        var session = yield lform.submit();
        expect(session._id).not.to.be(void 0);
        expect(session.user.emailAddress).to.be("a@b.com");
      }));

      it("cannot reset a password if the token has expired", co.wrap(function*() {
        var token = yield Token.findOne(bus, { _id: tokenId });
        token.expiresAt = new Date(0);
        yield token.update();

        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        var err;
        try {
          yield form.submit();
        } catch(e) {
          err = e;
        }

        expect(err.statusCode).to.be(406);
      }));

      // xit("cannot register a new user if the passwords do not match");
    });
  

    describe("with an account", function() {

      beforeEach(co.wrap(function*() {
        yield new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
      }));

      it("cannot change the email to something else if the email already exists");
      it("can change the password");
      it("can set the first & last name of the user");
      it("can set the locale of the user");
    });
  });
});
