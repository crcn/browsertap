import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";
import httperr       from "httperr";

/**
 */

var tokenSchema = new Schema({
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

    expiresAt: { 
      default: function() {
        return new Date(Date.now() + 3600 * 24); // 24 hours
      },
      type: Date
    },

    /**
     * secret keys including password
     */

    key: {
      type: String,
      required: true
    },

    /**
     */

    max: {
      type: Number,
      default: 1,
    },

    /**
     */

    useCount: {
      type: Number,
      default: 0
    }
  }
});

/**
 */

@persistMixin("tokens")
@mixinSchema(tokenSchema)
class Token extends Model {
  get expired() {
    return this.expiresAt.getTime() < Date.now();
  }
}

/**
 */

export default Token;