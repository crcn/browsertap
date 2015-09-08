import createRouter from "api/bus/drivers/create-router";
import sift         from "sift";
import SignupForm   from "api/data/forms/signup";
import LoginForm    from "api/data/forms/login";
import User         from "api/data/models/user";
import PasswordKey  from "api/data/models/password-key";
import httperr      from "httperr";

export default function(bus) {

  return createRouter([

    /**
     */

    sift({ name: "register" }),
    function*(operation) {

      // form here for validation
      var form = new SignupForm(Object.assign({ bus: bus }, operation.data));

      if (yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() })) {
        throw new httperr.Conflict("emailAddress.exists");
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

      return (yield user.insert()).toPublic();
    },

    /**
     */

    sift({ name: "login" }),
    function*(operation) {
      var form = new LoginForm(Object.assign({ bus: bus }, operation.data));
      var user = yield User.findOne(bus, { emailAddress: form.emailAddress.valueOf() });

      if (!user) throw new httperr.NotFound("email address not found");

      var hasMatch = !!user.keys.filter(function(key) {
        if (key.secret && key.secret.verify(form.password)) return true;
      }).length;

      if (!hasMatch) throw new httperr.Unauthorized("password incorrect")

      return user.toPublic();
    }
  ]);
};

