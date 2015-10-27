import Schema        from 'common/data/schema/schema';

/**
 */

var passwordSchema = new Schema({
  fields: {
    secret: {
      required: true,
      type: require('common/data/types/password')
    }
  }
});

/**
 */

class PasswordKey {
  constructor(properties) {
    Object.assign(this, passwordSchema.coerce(properties));
  }
}

export default PasswordKey;
