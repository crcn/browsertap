import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";


/**
 */


@mixinSchema(new Schema({
  fields: {
    _id: {
      required: true,
      type: require("common/data/types/object-id")
    }
  }
}))
class User {

}

/**
 */

@mixinSchema(new Schema({
  fields: {
    user: {
      required: true,
      type: User
    },
    level: {
      default: "admin",
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
     * required for executing DB commands
     */

    bus: {
      required: true,
      type: require("common/data/types/bus")
    },

    /**
     * ID of the user 
     */

    _id: {
      type: require("common/data/types/object-id")
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

@persistMixin("organizations")
@mixinSchema(organizationSchema)
class Organization extends Model {

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
}

/**
 */

export default Organization;