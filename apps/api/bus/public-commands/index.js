import createRouter       from "api/bus/drivers/create-router";
import sift               from "sift";
import SignupForm         from "api/data/forms/signup";
import LoginForm          from "api/data/forms/login";
import ForgotPasswordForm from "api/data/forms/forgot-password";
import ResetPasswordForm  from "api/data/forms/reset-password";
import EmailForm          from "api/data/forms/email";
import User               from "api/data/models/user";
import Token              from "api/data/models/token";
import PasswordKey        from "api/data/models/password-key";
import httperr            from "httperr";
import mu                 from "mustache";
import fs                 from "fs";


export default function(app, bus) {

  function *getLoggedInUser(operation) {
    if (!operation.token) throw new httperr.Unauthorized("token does not exist");
    var token = yield Token.findOne(bus, operation.token);
    var user  = yield User.findOne({ 
      emailAddress: token.key
    });
    if (!user) throw new httperr.Unauthorized("user does not exist");
    return user;
  }

  return createRouter(
    require("./account")(app, bus)
  , bus);
};

