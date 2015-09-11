import createRouter       from "api/bus/drivers/create-router";
import sift               from "sift";
import SignupForm         from "common/data/forms/signup";
import LoginForm          from "common/data/forms/login";
import ForgotPasswordForm from "common/data/forms/forgot-password";
import ResetPasswordForm  from "common/data/forms/reset-password";
import EmailForm          from "api/data/forms/email";
import User               from "api/data/models/user";
import Token              from "api/data/models/token";
import PasswordKey        from "api/data/models/password-key";
import Session            from "api/data/models/session";
import httperr            from "httperr";
import mu                 from "mustache";
import fs                 from "fs";


export default function(app, bus) {

  function *getLoggedInUser(operation) {
    if (!operation.token) throw new httperr.Unauthorized("tokenDoesNotExist");
    var token = yield Token.findOne(bus, operation.token);
    var user  = yield User.findOne({ 
      emailAddress: token.key
    });
    if (!user) throw new httperr.Unauthorized("userDoesNotExist");
    return user;
  }


  var browserHost = app.get("config.hosts.browser");

  return [

    /**
     */

    sift({ name: "register" }),
    function*(operation) {

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

      // also create an organization for the user
      var org = yield user.createOrganization();

      // login to create the session and other things 
      var loginForm = new LoginForm({
        bus: app.bus,
        emailAddress: form.emailAddress,
        password: form.password
      });

      return yield loginForm.submit();
    },

    /**
     * logs the user in
     */

    sift({ name: "login" }),
    function*(operation) {
      var form = new LoginForm(Object.assign({ bus: bus }, operation.data));
      var user = yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() });

      if (!user) {
        throw new httperr.NotFound("emailAddressNotFound");
      }

      var hasMatch = !!user.keys.filter(function(key) {
        if (key.secret && key.secret.verify(form.password)) return true;
      }).length;

      if (!hasMatch) throw new httperr.Unauthorized("passwordIncorrect")

      // TODO - add more security stuff here based on operation
      var session = new Session({ bus: bus, user: user });

      return (yield session.insert()).toPublic();
    },

    /**
     */

    sift({ name: "forgotPassword" }),
    function*(operation) {
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
    },

    /**
     */

    sift({ name: "resetPassword" }),
    function*(operation) {
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
    },

    // /**
    //  */

    sift({ name: "updateUser" }),
    function*(operation) {
      // TODO
    }
  ];
};
