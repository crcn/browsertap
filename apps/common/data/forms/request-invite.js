import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";
import Invitee     from "common/data/models/invitee";
import mixinForm   from "./mixins/form";

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
@mixinForm("requestInvite", Invitee)
class RequestInviteForm { };

/**
*/

export default RequestInviteForm;
