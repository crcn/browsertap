import Model         from 'common/data/models/base/model'
import Schema        from 'common/data/schema/schema';
import persistMixin  from 'common/data/models/mixins/persist'
import mixinSchema   from 'common/data/schema/mixin';
import httperr       from 'httperr';
import Reference     from 'common/data/types/reference';

/**
 */

var usageSchema = new Schema({
  fields: {

    /**
     * ID of the user
     */

    _id: {
      type: require('common/data/types/object-id')
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

@persistMixin('usages')
@mixinSchema(usageSchema)
class Usage extends Model {
  async reset() {
    this.minutes = 0;
    return await this.update();
  }
  async addMinutes(amount) {
    this.minutes += amount;
    return await this.update();
  }
}

/**
 */

export default Usage;
