import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";
import mixinForm   from "./mixins/form";

/**
 */

@mixinSchema(new Schema({
  fields: {
    _id: {
      required : true,
      type     : require("common/data/types/object-id")
    }
  }
}))
class Token {

}

var confirmAccountSchema = new Schema({
  fields: {
    token: {
      required : true,
      hidden   : true,
      type     : Token
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
