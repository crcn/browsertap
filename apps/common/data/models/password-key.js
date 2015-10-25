import Model         from 'common/data/models/base/model'
import Schema        from 'common/data/schema/schema';
import mixinSchema   from 'common/data/schema/mixin';

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

@mixinSchema(passwordSchema)
class PasswordKey extends Model {

}

export default PasswordKey;