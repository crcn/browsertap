import Schema      from 'common/data/schema/schema';
import Reference   from 'common/data/types/reference';
import Form        from './base';

/**
 */

var confirmAccountSchema = new Schema({
  fields: {
    token: {
      required : true,
      hidden   : true,
      type     : Reference
    }
  }
});

/**
 */

class ConfirmAccountForm extends Form {
  constructor(properties) {
    super('confirmAccount', confirmAccountSchema, properties);
  }
};

/**
*/

export default ConfirmAccountForm;
