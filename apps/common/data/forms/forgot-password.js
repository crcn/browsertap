import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";

/**
 */

var forgotPasswordSchema = new Schema({
  fields: {
    emailAddress:  {
      required : true,
      type     : require("common/data/types/email-address")
    }
  }
});

/**
 */

@mixinSchema(forgotPasswordSchema)
class ForgotPasswordForm {

  /**
   */

  *submit() {
    return (yield this.bus.execute({
      name: "forgotPassword",
      data: this
    }).read()).value;
  }
};

/**
*/

export default ForgotPasswordForm;
