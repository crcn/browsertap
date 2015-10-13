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

var resetPaswordSchema = new Schema({
  fields: {
    token: {
      required : true,
      hidden   : true,
      type     : Token
    },
    password:  {
      required : true,
      type     : require("common/data/types/password")
    },
    repeatPassword:  {
      required : true,
      type     : require("common/data/types/password"),
      validate : function(value, data) {
        return value.valueOf() === data.password.valueOf();
      }
    }
  }
});

/**
 */

@mixinSchema(resetPaswordSchema)
@mixinForm("resetPassword")
class ResetPasswordForm { };

/**
*/

export default ResetPasswordForm;
