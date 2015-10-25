import mixinSchema from 'common/data/schema/mixin';
import Schema      from 'common/data/schema/schema';
import mixinForm   from './mixins/form';

/**
 */

var loginFormSchema = new Schema({
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

@mixinSchema(loginFormSchema)
@mixinForm('login')
class LoginForm { }


/**
*/

export default LoginForm;
