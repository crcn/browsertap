import Schema        from 'common/data/schema/schema';

/**
 */


var schema = new Schema({
  fields: {
    _id: {
      required: true,
      type: require('common/data/types/object-id')
    }
  }
});
class Reference {
  constructor(properties) {
    Object.assign(this, schema.coerce(properties));
  }
};

/**
 */

module.exports = Reference;
