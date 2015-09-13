import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";

/**
 */

var inviteeMixin = new Schema({
  fields: {

    /**
     * required for executing DB commands
     */

    bus: {
      required: true,
      type: require("common/data/types/bus")
    },

    /**
     */

    _id: { 
      type: require("common/data/types/object-id")
    },

    /**
     */

    emailAddress: { 
      required: true, 
      unique: true, // TODO
      type: require("common/data/types/email-address")
    }
  }
});

/**
 */

@persistMixin("invitees")
@mixinSchema(inviteeMixin)
class Invitee extends Model {

}

/**
 */

export default Invitee;