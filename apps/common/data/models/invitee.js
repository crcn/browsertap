import Model         from 'common/data/models/model'
import Schema        from 'common/data/schema/schema';

/**
 */

var inviteeSchema = new Schema({
  fields: {

    /**
     */

    shortcode: {
      type: String
    },

    /**
     */

    inviter: {
      type: require('common/data/types/reference')
    },

    /**
     */

    inviteCount: {
      type: Number,
      default: 0
    },

    /**
     */

    _id: {
      type: require('common/data/types/object-id')
    },

    /**
     */

    name:  {
      required : true,
      type     : String
    },

    /**
     */

    emailAddress: {
      required: false,
      unique: true, // TODO
      type: require('common/data/types/email-address')
    }
  }
});

/**
 */

class Invitee extends Model {
  static collectionName = 'invitees';
  static schema = inviteeSchema;
}

/**
 */

export default Invitee;
