import Schema        from 'common/data/schema/schema';
import mixinSchema   from 'common/data/schema/mixin';

/**
 */


@mixinSchema(new Schema({
  fields: {
    _id: {
      required: true,
      type: require('common/data/types/object-id')
    }
  }
}))
class Reference { };

/**
 */

module.exports = Reference;
