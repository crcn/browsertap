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

    shortcode: {
      type: String
    },

    /**
     */

    inviter: {
      type: require("api/data/types/reference")
    },

    /**
     */

    inviteCount: {
      type: Number,
      default: 0
    },

    /**
     */

    _id: { 
      type: require("common/data/types/object-id")
    },

    /**
     */

    name:  {
      required : true,
      type     : String
    },

    /**
     */

    emailAddress: { 
      required: false, 
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

  // getShareLink() {
  //   return this.app.config.hosts.browser + "#/w/" + this.shortcode;
  // }
}

/**
 */

export default Invitee;