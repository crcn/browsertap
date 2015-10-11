import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";

/**
 */

var forgotPasswordSchema = new Schema({
  fields: {
    to:  {
      required : true,
      type     : require("common/data/types/email-address")
    },
    subject: {
      required: true,
      type: String
    },
    body: {
      required: true,
      type: String
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
      name: "sendEmail",
      data: this
    }).read()).value;
  }
};

/**
*/

export default ForgotPasswordForm;
