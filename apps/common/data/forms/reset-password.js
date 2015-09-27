import mixinSchema from "common/data/schema/mixin";
import Schema      from "common/data/schema/schema";

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
    bus: {
      required : true,
      hidden   : true,
      type     : require("common/data/types/bus")
    }, 
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
class ResetPasswordForm {

  /**
   */

  *submit() {
    return yield this.bus.execute({ 
      name: "resetPassword", 
      data: this 
    }).read();
  }
};

/**
*/

export default ResetPasswordForm;
