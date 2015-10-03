import createRouter       from "api/bus/drivers/create-router";
import sift               from "sift";
import mesh               from "common/mesh";
import SignupForm         from "common/data/forms/signup";
import LoginForm          from "common/data/forms/login";
import ForgotPasswordForm from "common/data/forms/forgot-password";
import ConfirmAccountForm from "common/data/forms/confirm-account";
import ResetPasswordForm  from "common/data/forms/reset-password";
import EmailForm          from "api/data/forms/email";
import User               from "common/data/models/user";
import Token              from "api/data/models/token";
import Invitee            from "common/data/models/invitee";
import PasswordKey        from "common/data/models/password-key";
import httperr            from "httperr";
import mu                 from "mustache";
import fs                 from "fs";
import templates          from "./templates";
import _command           from "common/bus/drivers/command";

export default function(app, bus) {

  var browserHost = app.get("config.hosts.browser");

  return {

    /**
     */

    register: _command({
      execute: function*(operation) {


        if (app.config.beta) {
          throw new httperr.Unauthorized("cannotRegisterInBeta");
        }

        // form here for validation
        var form = new SignupForm(Object.assign({ bus: bus }, operation.data));

        if (yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() })) {
          throw new httperr.Conflict("emailAddressExists");
        }

        // create the new user object
        var user = new User({
          bus          : bus,
          emailAddress : form.emailAddress,

          // add the one password key
          keys: [
            new PasswordKey({ secret: form.password.hash() })
          ]
        });

        // register the user
        yield user.insert();

        var token = new Token({
          bus: bus,
          key: user.emailAddress
        });

        yield token.insert();

        // TODO - i18n translate this shit
        var emailForm = new EmailForm({
          bus     : bus,
          to      : user.emailAddress,
          subject : "Confirm account",
          body    : templates.confirmAccount({
            link  : browserHost + "#/confirm/" + token._id
          })
        });

        yield emailForm.submit();

        // also create an organization for the user
        var org = yield user.createOrganization();

        // login to create the session and other things
        var loginForm = new LoginForm({
          bus          : mesh.attach({ session: operation.session }, app.bus),
          emailAddress : form.emailAddress,
          password     : form.password
        });

        return yield loginForm.submit();
      }
    }),

    /**
     * logs the user in
     */

    login: _command({
      execute: function*(operation) {

        var form = new LoginForm(Object.assign({ bus: bus }, operation.data));
        var user = yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() });

        if (!user) {
          throw new httperr.NotFound("emailAddressNotFound");
        }

        var hasMatch = !!user.keys.filter(function(key) {
          if (key.secret && key.secret.verify(form.password)) return true;
        }).length;

        if (!hasMatch) throw new httperr.Unauthorized("passwordIncorrect")

        operation.session.userId = user._id;

        return user.toPublic();
      }
    }),

    /**
     * logs the user in
     */

    logout: _command({
      execute: function*(operation) {
        operation.session.userId = void 0;
      }
    }),

    /**
     */

    forgotPassword: _command({
      execute: function*(operation) {
        var form = new ForgotPasswordForm(Object.assign({ bus: bus }, operation.data));
        var user = yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() });
        if (!user) throw new httperr.NotFound("emailAddressNotFound");

        var token = new Token({
          bus: bus,
          key: user.emailAddress
        });

        yield token.insert();

        // TODO - i18n translate this shit
        var emailForm = new EmailForm({
          bus: bus,
          to: user.emailAddress,
          subject: "Password reset",
          body: mu.render(fs.readFileSync(__dirname + "/templates/reset-password-email.mu", "utf8"), {
            link: browserHost + "/#/reset-password/" + token._id
          })
        });

        yield emailForm.submit();
      }
    }),

    /**
     */

    getSessionUser: _command({
      auth: true,
      execute: function*(operation) {
        return operation.user.toPublic();
      }
    }),

    /**
     */

    confirmAccount: _command({
      execute: function*(operation) {
        var form  = new ConfirmAccountForm(Object.assign({ bus: bus }, operation.data));
        var token = yield Token.findOne(bus, { _id: String(form.token._id) });
        if (!token) throw new httperr.NotFound("tokenDoesNotExist");

        // fetch the email stored in the token
        var user = yield User.findOne(bus, { emailAddress: String(token.key) });
        if (!user) throw new httperr.NotFound("emailAddressNotFound");

        user.confirmed = true;

        yield user.update();
        yield token.remove();
      }
    }),

    /**
     */

    resetPassword: _command({
      execute: function*(operation) {
        var form = new ResetPasswordForm(Object.assign({ bus: bus }, operation.data));

        // find the token from the form
        var token = yield Token.findOne(bus, { _id: String(form.token._id) });
        if (!token) throw new httperr.NotFound("tokenDoesNotExist");

        if (token.expired) throw new httperr.NotAcceptable("tokenHasExpired");

        // fetch the email stored in the token
        var user = yield User.findOne(bus, { emailAddress: String(token.key) });
        if (!user) throw new httperr.NotFound("emailAddressNotFound");

        // reset the password here
        user.keys.forEach(function(key) {
          if (key.secret) {
            key.secret = form.password.hash();
          }
        });

        // remove the token so that it cannot be re-used
        yield token.remove();

        // update the user
        yield user.update();
      }
    }),

    /**
     */

    updateUser: _command({
      auth: true,
      execute: function*(operation) {
        // TODO
      }
    })
  };
};
