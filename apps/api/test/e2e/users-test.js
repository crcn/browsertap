import expect             from "expect.js";
import { AttachDefaultsBus } from "mesh";
import sift               from "sift";
import User               from "common/data/models/user";
import SignupForm         from "common/data/forms/signup";
import LoginForm          from "common/data/forms/login";
import forms              from "common/data/forms";
import ForgotPasswordForm from "common/data/forms/forgot-password";
import ResetPasswordForm  from "common/data/forms/reset-password";
import Token              from "api/data/models/token";
import ConfirmAccountForm from "common/data/forms/confirm-account";

import testUtils         from "api/test/utils";

describe(__filename + "#", function() {

  var apiApp;

  beforeEach(async function() {
    apiApp = await testUtils.createFakeApp();
  });

  afterEach(function() {
    apiApp.dispose();
  });

  var bus;
  var session;
  var fixtures = {
    user1: {
      emailAddress: "a@b.com",
      password: "password",
      repeatPassword: "password"
    }
  };

  beforeEach(function() {
    session = apiApp.session;
    apiApp.bus = bus = AttachDefaultsBus.create({ app: apiApp, public: true }, apiApp.bus);
  });

  describe("insert# ", function() {
    it("cannot register a new user if a password is not present", async function() {
      var err;

      try {
        await bus.execute({
          action: "register",
          data: { emailAddress: "a@b.com" }
        }).read();
      } catch(e) {
        err = e;
      }

      expect(err.statusCode).to.be(400);
    });

    it("cannot register a new user if the application is in beta mode",  async function() {
      apiApp.config.beta = true;
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      var err;
      try {
        await form.submit();
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(401);
      expect(err.message).to.be("cannotRegisterInBeta");
    });

    it("can register a new user if the password is present", async function() {
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      var user = await form.submit();
      expect(user.emailAddress).to.be(fixtures.user1.emailAddress);
      expect(user.password).to.be(void 0);
      expect(user.keys).to.be(void 0);
    });

    it("cannot register a user if the email address already exists", async function() {
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      await form.submit();

      var err;
      try {
        await form.submit();
      } catch(e) {
        err = e;
      }

      expect(err.statusCode).to.be(409);
    });

    it("can confirm an account for registration", async function() {
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      await form.submit();

      var user = await User.findOne(bus, { emailAddress: fixtures.user1.emailAddress });
      expect(user.confirmed.valueOf()).to.be(false);

      var message = apiApp.emailer.outbox.messages.pop();
      expect(message.subject.valueOf()).to.contain("Confirm");

      var tokenId = message.body.match(/confirm\/(.*)/)[1];

      var confirm = new ConfirmAccountForm({
        bus: bus,
        token: { _id: tokenId }
      });

      var result = await confirm.submit();

      var user = await User.findOne(bus, { emailAddress: fixtures.user1.emailAddress });
      expect(user.confirmed.valueOf()).to.be(true);
    });

    it("cannot confirm an account if the token id is invalid", async function() {

      var tokenId = "123456789123456789123456"

      var confirm = new ConfirmAccountForm({
        bus: bus,
        token: { _id: tokenId }
      });

      var err;

      try {
        await confirm.submit();
      } catch(e) { err = e; }

      expect(err.statusCode).to.be(404);
    });

    it("can login a user", async function() {
      await new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
      var form = new LoginForm(Object.assign({ bus: bus }, fixtures.user1));
      var user = await form.submit();
      expect(session.userId.valueOf()).to.be(user._id);
    });

    it("cannot login a user with a bad password", async function() {
      await new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
      var form = new LoginForm(Object.assign({ bus: bus }, { emailAddress: "a@b.com", password: "passssssword" }));
      var err;
      try {
        await form.submit();
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(401);
    });

    it("returns an error if an email address does not exist while logging in", async function() {
      var form = new LoginForm(Object.assign({ bus: bus }, { emailAddress: "a@b.com", password: "passssssword" }));
      var err
      try {
        await form.submit();
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(404);
    });

    it("returns a 404 if resetting a password on an email that does not exist", async function() {
      var form = new ForgotPasswordForm(Object.assign({ bus: bus }, { emailAddress: "not-exists@b.com"  }));
      var err;
      try {
        await form.submit();
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(404);
    });

    it("successfuly sends a password reset email", async function() {
      await new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
      var form = new ForgotPasswordForm(Object.assign({ bus: bus }, { emailAddress: fixtures.user1.emailAddress }));
      await form.submit();
      var message = apiApp.emailer.outbox.messages.pop();
      expect(message.subject.valueOf()).to.be("Password reset");
    });

    it("cannot reset a password it the passwords do not match", async function() {
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
    });

    it("cannot reset a password if the token does not exist", async function() {
      var err;

      var form = new ResetPasswordForm(Object.assign({ bus: bus }, {
        token: { _id: "123456789123456789123456" },
        password: "password1",
        repeatPassword: "password1"
      }));

      var err;
      try {
        await form.submit();
      } catch(e) {
        err = e;
      }

      expect(err.message).to.be("tokenDoesNotExist");
    });

    it("new user has an organization", async function() {
      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      await form.submit();
      var user = await User.findOne(bus, { emailAddress: form.emailAddress.valueOf() });
      var organizations = await user.getOrganizations();
      expect(organizations.length).to.be(1);
      expect(organizations[0].access[0].user._id.valueOf()).to.be(user._id.valueOf());
    });

    // xit("cannot register a new user if the passwords do not match");

    it("cannot load a user if they're not logged in", async function() {

      var form = new SignupForm(Object.assign({ bus: bus }, fixtures.user1));
      var u = await form.submit();

      var u2 = await forms.getSessionUser(bus);
      expect(u._id.valueOf()).to.be(u2._id.valueOf());
    });

    it("cannot load a user if they're logged in", async function() {
      var err;

      try {
        await forms.getSessionUser(bus);
      } catch(e) {
        err = e;
      }
      expect(err.statusCode).to.be(401);
    });

    describe("with a token", function() {

      var tokenId;

      beforeEach(async function() {
        await new SignupForm(Object.assign({ bus: bus }, fixtures.user1)).submit();
        var form = new ForgotPasswordForm(Object.assign({ bus: bus }, { emailAddress: fixtures.user1.emailAddress }));
        await form.submit();
        var message = apiApp.emailer.outbox.messages.pop();
        tokenId = message.body.match(/reset-password\/(.*)/)[1];
      });

      it("can reset the password", async function() {
        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        await form.submit();
      });

      it("cannot re-use a token after it's been used", async function() {
        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        await form.submit();

        var err;

        try {
          await form.submit();
        } catch(e) {
          err = e;
        }
        expect(err.statusCode).to.be(404);
      });

      it("can login with the new password after it's been reset", async function() {
        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        await form.submit();

        var lform = new LoginForm({
          bus: bus,
          emailAddress: fixtures.user1.emailAddress,
          password: form.password
        });

        var user = await lform.submit();
        expect(user._id).not.to.be(void 0);
        expect(user.emailAddress).to.be("a@b.com");
      });

      it("cannot reset a password if the token has expired", async function() {
        var token = await Token.findOne(bus, { _id: tokenId });
        token.expiresAt = new Date(0);
        await token.update();

        var form = new ResetPasswordForm({
          bus: bus,
          token: { _id: tokenId },
          password: "password1",
          repeatPassword: "password1"
        });

        var err;
        try {
          await form.submit();
        } catch(e) {
          err = e;
        }

        expect(err.statusCode).to.be(406);
      });
    });
  });
});
