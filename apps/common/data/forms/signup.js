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
    firstName:  {
      required : false,
      type     : String
    },
    lastName:  {
      required : false,
      type     : String
    },
    password: {
      required : true,
      type     : require("common/data/types/password")
    }
    // repeatPassword: {
    //   required : true,
    //   type     : require("common/data/types/password"),
    //   validate : function(password, data) {
    //     return String(password) === String(data.password);
    //   }
    // }
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
