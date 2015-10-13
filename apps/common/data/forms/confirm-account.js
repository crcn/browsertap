import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";
import mixinForm   from "./mixins/form";
import Reference   from "common/data/types/reference";

/**
 */

var confirmAccountSchema = new Schema({
  fields: {
    token: {
      required : true,
      hidden   : true,
      type     : Reference
    }
  }
});

/**
 */

@mixinSchema(confirmAccountSchema)
@mixinForm("confirmAccount")
class ConfirmAccountSchema { };

/**
*/

export default ConfirmAccountSchema;
