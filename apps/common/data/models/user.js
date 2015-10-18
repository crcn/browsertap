import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";
import Organization  from "common/data/models/organization";

/**
 */

var userSchema = new Schema({
  fields: {

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

  async getOrganizations() {
    return (await this.bus.execute({
      action: "getUserOrganizations"
    }).read()).value.map(function(data) {
      return new Organization(Object.assign({ bus: this.bus.value }, data));
    }.bind(this));
  }

  /**
   */

  async createOrganization() {
    var organization = new Organization({
      bus: this.bus,
      access: [{
        user: { _id: this._id },
        level: "admin"
      }]
    });
    return await organization.insert();
  }
}

/**
 */

export default User;
