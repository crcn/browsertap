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

var confirmAccountSchema = new Schema({
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
    }
  }
});

/**
 */

@mixinSchema(confirmAccountSchema)
class ConfirmAccountSchema {

  /**
   */

  *submit() {
    return yield this.bus.execute({ 
      name: "confirmAccount", 
      data: this 
    });
  }
};

/**
*/

export default ConfirmAccountSchema;
