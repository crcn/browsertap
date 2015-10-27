import Schema    from 'common/data/schema/schema';
import Reference from 'common/data/types/reference';
import Form      from './base';

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

class ResetPasswordForm extends Form {
  constructor(properties) {
    super('resetPassword', resetPaswordSchema, properties);
  }
};

/**
*/

export default ResetPasswordForm;
