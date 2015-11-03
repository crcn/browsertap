import Model         from 'common/data/models/model'
import DataObject    from 'common/data/object';
import Schema        from 'common/data/schema/schema';
import Reference     from 'common/data/types/reference';
import Usage         from 'common/data/models/usage';

/**
 */

var accessSchema = new Schema({
  fields: {
    user: {
      required: true,
      type: Reference
    },
    level: {
      default: 'admin',
      required: true,
      type: String
    }
  }
});

class Access {
  constructor(properties) {
    Object.assign(this, accessSchema.coerce(properties));
  }
}

/**
 */

var organizationSchema = new Schema({
  fields: {

    /**
     * ID of the user
     */

    _id: {
      type: require('common/data/types/object-id')
    },

    /**
     */

    name: {
      required: false,
      type: String
    },

    /**
     */

    access: [{
      type: Access
    }]
  }
});

/**
 */

class Organization extends Model {

  static collectionName = 'organizations';
  static schema = organizationSchema;

  /**
   */

   // TODO - simplify
  async getUsage() {
    return new Usage(Object.assign({ bus: this.bus }, await this.bus.execute({
      action: 'getUsage',
      organization: this
    })));
  }

  /**
   * returns the billing info such as plan, number of hours used, etc
   */

  *getBillingInfo() {
    // TODO
  }

  /**
   * returns the current plan for the organization
   */

  *getPlan() {

  }

  /**
   * gets the current running desktops
   */

  *getDesktops() {

  }

  /**
   */

  *startDesktop() {

  }
}

/**
 */

export default Organization;
