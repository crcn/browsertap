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
import httperr            from "httperr";
import mu                 from "mustache";
import fs                 from "fs";
import commands           from "api/bus/drivers/commands";
  
export default function(app, bus) {
  return commands(
    Object.assign({},
      require("./account")(app, bus),
      require("./payments")(app, bus),
      require("./organizations")(app, bus)
    )
  , bus);
};
