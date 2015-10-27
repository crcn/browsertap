import Schema      from 'common/data/schema/schema';
import Form        from './base';

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

class LoginForm extends Form {
  constructor(properties) {
    super('login', loginFormSchema, properties);
  }
}


/**
*/

export default LoginForm;
