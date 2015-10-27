import Schema from 'common/data/schema/schema';
import Form   from 'common/data/forms/base';

/**
 */

var forgotPasswordSchema = new Schema({
  fields: {
    to:  {
      required : true,
      type     : require('common/data/types/email-address')
    },
    subject: {
      required: true,
      type: String
    },
    body: {
      required: true,
      type: String
    }
  }
});

/**
 */

class ForgotPasswordForm extends Form {


  /**
   */

  constructor(properties) {
    super('sendEmail', forgotPasswordSchema, properties);
  }
};

/**
*/

export default ForgotPasswordForm;
