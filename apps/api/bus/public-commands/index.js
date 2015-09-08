import createRouter from "api/bus/drivers/create-router";
import sift         from "sift";
import SignupForm   from "api/data/forms/signup";
import User         from "api/data/models/user";

export default function(bus) {

  return createRouter([

    /**
     */

    sift({ name: "register" }),
    function*(operation) {

      // form here for validation
      var form = new SignupForm(Object.assign({ bus: bus }, operation.data));

      // actually create the user
      var user = new User({
        bus: bus,
        emailAddress: form.emailAddress,

        // TODO
        keys: [
          // new PasswordKey(form.password)
        ]
      });

      return yield user.insert();
    }
  ]);
};

