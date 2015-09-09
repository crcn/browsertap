import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import User          from "api/data/models/user"
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";
import httperr       from "httperr";


@mixinSchema(new Schema({
  fields: {
    _id: {
      required : true,
      type     : require("common/data/types/object-id")
    },
    emailAddress: {
      required : false,
      type     : require("common/data/types/email-address")
    }
  }
}))
class User2 {

}

/**
 */

var sessionSchema = new Schema({
  fields: {

    /**
     * required for executing DB commands
     */

    bus: {
      required: true,
      type: require("common/data/types/bus")
    },

    /**
     * ID of the user 
     */

    _id: {
      type: require("common/data/types/object-id")
    },

    /**
     */

    user: {
      required: true,
      type: User2
    }
  }
});

/**
 */

@persistMixin("sessions")
@mixinSchema(sessionSchema)
class Session extends Model {
  
}

/**
 */

export default Session;