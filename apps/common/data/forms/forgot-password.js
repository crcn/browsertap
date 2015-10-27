import Schema      from 'common/data/schema/schema';
import Form        from './base';

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

class ForgotPasswordForm extends Form  {
  constructor(properties) {
    super('forgotPassword', forgotPasswordSchema, properties);
  }
};

/**
*/

export default ForgotPasswordForm;
