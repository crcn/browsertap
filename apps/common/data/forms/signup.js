import Schema  from 'common/data/schema/schema';
import Form   from './base';

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

class SignupForm extends Form {
  constructor(properties) {
    super('register', signupFormSchema, properties);
  }
};

/**
*/

export default SignupForm;
