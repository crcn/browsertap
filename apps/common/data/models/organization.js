import Model         from 'common/data/models/base/model'
import Schema        from 'common/data/schema/schema';
import persistMixin  from 'common/data/models/mixins/persist'
import mixinSchema   from 'common/data/schema/mixin';
import Reference     from 'common/data/types/reference';
import Usage         from 'common/data/models/usage';

/**
 */

@mixinSchema(new Schema({
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
}))
class Access {

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

@persistMixin('organizations')
@mixinSchema(organizationSchema)
class Organization extends Model {

  /**
   */

   // TODO - simplify
  *getUsage() {
    return new Usage(Object.assign({ bus: this.bus }, yield this.bus.execute({
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
