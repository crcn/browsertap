import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";
import Invitee     from "api/data/models/invitee";

/**
 */

var requestInviteFormSchema = new Schema({
  fields: {
    bus: {
      required : true,
      hidden   : true,
      type     : require("common/data/types/bus")
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
    return new Invitee(Object.assign({ bus: this.bus }, yield this.bus.execute({ 
      name: "requestInvite", 
      data: this 
    })));
  }
};


/**
*/

export default RequestInviteForm;
