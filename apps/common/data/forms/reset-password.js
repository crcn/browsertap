import mixinSchema from 'common/data/schema/mixin';
import Schema      from 'common/data/schema/schema';
import mixinForm   from './mixins/form';
import Reference   from 'common/data/types/reference';

/**
 */

var resetPaswordSchema = new Schema({
  fields: {
    token: {
      required : true,
      hidden   : true,
      type     : Reference
    },
    password:  {
      required : true,
      type     : require('common/data/types/password')
    },
    repeatPassword:  {
      required : true,
      type     : require('common/data/types/password'),
      validate : function(value, data) {
        return value.valueOf() === data.password.valueOf();
      }
    }
  }
});

/**
 */

@mixinSchema(resetPaswordSchema)
@mixinForm('resetPassword')
class ResetPasswordForm { };

/**
*/

export default ResetPasswordForm;
