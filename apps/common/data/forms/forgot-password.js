import mixinSchema from 'common/data/schema/mixin';
import Schema      from 'common/data/schema/schema';
import mixinForm   from './mixins/form';

/**
 */

var forgotPasswordSchema = new Schema({
  fields: {
    emailAddress:  {
      required : true,
      type     : require('common/data/types/email-address')
    }
  }
});

/**
 */

@mixinSchema(forgotPasswordSchema)
@mixinForm('forgotPassword')
class ForgotPasswordForm { };

/**
*/

export default ForgotPasswordForm;
