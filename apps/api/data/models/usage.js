import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";
import httperr       from "httperr";
import Reference     from "api/data/types/reference";

/**
 */

var usageSchema = new Schema({
  fields: {

    /**
     * ID of the user 
     */

    _id: {
      type: require("common/data/types/object-id")
    },

    /**
     * ID of the user 
     */

    organization: {
      type: Reference
    },

    /**
     */

    minutes: { 
      default: 0,
      type: Number
    }
  }
});

/**
 */

@persistMixin("usages")
@mixinSchema(usageSchema)
class Usage extends Model {
  *reset() {
    this.minutes = 0;
    return yield this.update();
  }
  *addMinutes(amount) {
    this.minutes += amount;
    return yield.this.update();
  }
}

/**
 */

export default Usage;