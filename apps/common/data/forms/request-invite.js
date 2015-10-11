import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";
import Invitee     from "common/data/models/invitee";

/**
 */

var requestInviteFormSchema = new Schema({
  fields: {
    inviterShortcode: {
      hidden : true,
      type: String
    },
    name:  {
      required : true,
      type     : String
    },
    emailAddress:  {
      required : true,
      type     : require("common/data/types/email-address")
    }
  }
});

/**
 */

@mixinSchema(requestInviteFormSchema)
class RequestInviteForm {

  /**
   */

  *submit() {
    return new Invitee(Object.assign({ bus: this.bus }, (yield this.bus.execute({
      name: "requestInvite",
      data: this
    }).read()).value));
  }
};


/**
*/

export default RequestInviteForm;
