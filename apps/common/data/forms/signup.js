import mixinSchema from 'common/data/schema/mixin';
import Schema      from 'common/data/schema/schema';
import mixinForm   from './mixins/form';

/**
 */

var signupFormSchema = new Schema({
  fields: {
    emailAddress:  {
      required : true,
      type     : require('common/data/types/email-address')
    },
    password: {
      required : true,
      type     : require('common/data/types/password')
    }
  }
});

/**
 */

@mixinSchema(signupFormSchema)
@mixinForm('register')
class SignupForm { };

/**
*/

export default SignupForm;
