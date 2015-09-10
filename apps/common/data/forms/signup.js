import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";

/**
 */

var signupFormSchema = new Schema({
  fields: {
    bus: {
      required : true,
      type     : require("common/data/types/bus")
    },
    emailAddress:  {
      required : true,
      type     : require("common/data/types/email-address")
    },
    password: {
      required : true,
      type     : require("common/data/types/password")
    }
  }
});

/**

var form = new SignupForm(form);

*/

@mixinSchema(signupFormSchema)
class SignupForm {

  /**
   */

  *submit() {
    return yield this.bus.execute({ 
      name: "register", 
      data: this 
    });
  }
};


/**
*/

export default SignupForm;
