import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";
import mixinForm   from "./mixins/form";

/**
 */

var signupFormSchema = new Schema({
  fields: {
    emailAddress:  {
      required : true,
      type     : require("common/data/types/email-address")
    },
    // firstName:  {
    //   required : false,
    //   type     : String
    // },
    // lastName:  {
    //   required : false,
    //   type     : String
    // },
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
@mixinForm("register")
class SignupForm { };

/**
*/

export default SignupForm;
