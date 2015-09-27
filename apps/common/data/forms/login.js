import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";

/**
 */

var loginFormSchema = new Schema({
  fields: {
    bus: {
      required : true,
      hidden   : true,
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
 */

@mixinSchema(loginFormSchema)
class LoginForm {

  /**
   */

  *submit() {
    return yield this.bus.execute({ 
      name: "login", 
      data: this 
    }).read();
  }
};


/**
*/

export default LoginForm;
