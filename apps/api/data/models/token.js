import Model         from 'common/data/models/model'
import Schema        from 'common/data/schema/schema';
import httperr       from 'httperr';

/**
 */

var tokenSchema = new Schema({
  fields: {

    /**
     * ID of the user
     */

    _id: {
      type: require('common/data/types/object-id')
    },

    /**
     */

    expiresAt: {
      default: function() {
        return new Date(Date.now() + 3600 * 24 * 1000); // 24 hours
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

class Token extends Model {
  static collectionName = 'tokens';
  static schema = tokenSchema;
  get expired() {
    return this.expiresAt.getTime() < Date.now();
  }
}

/**
 */

export default Token;
