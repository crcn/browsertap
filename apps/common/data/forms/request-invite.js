import Schema      from 'common/data/schema/schema';
import Invitee     from 'common/data/models/invitee';
import Form        from './base';

/**
 */

var requestInviteFormSchema = new Schema({
  fields: {
    inviterShortcode: {
      hidden : true,
      type: String
    },
    name:  {
      required : true,
      type     : String
    },
    emailAddress:  {
      required : true,
      type     : require('common/data/types/email-address')
    }
  }
});

/**
 */

class RequestInviteForm extends Form {
  constructor(properties) {
    super('requestInvite', requestInviteFormSchema, properties, Invitee);
  }
};

/**
*/

export default RequestInviteForm;
