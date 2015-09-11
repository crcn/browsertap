import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";
import Organization  from "api/data/models/organization";

/**
 */

var userSchema = new Schema({
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

    confirmed: {
      type: Boolean,
      default: false
    },

    /**
     */

    emailAddress: { 
      required: true, 
      unique: true, // TODO
      type: require("common/data/types/email-address")
    },

    /**
     */

    locale: {
      type: require("common/data/types/locale")
    },

    /**
     */

    firstName: {
      type: String
    },

    /**
     */

    lastName: {
      type: String
    },
    
    /**
     * secret keys including password
     */

    keys: [{
      internal: true,
      type: require("./password-key")
    }]
  }
});

/**
 */

@persistMixin("users")
@mixinSchema(userSchema)
class User extends Model {

  /**
   */

  *getOrganizations() {
    return yield Organization.find(this.bus.value, {
      "access.user": {
        _id: this._id.valueOf()
      }
    });
  }

  /**
   */


  *createOrganization() {
    var organization = new Organization({
      bus: this.bus,
      access: [{
        user: { _id: this._id },
        level: "admin"
      }]
    });
    return yield organization.insert();
  }
}

/**
 */

export default User;