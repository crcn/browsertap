import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";

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

    emailAddress: { 
      required: true, 

      // TODO - need to implement this
      unique: true,
      type: require("common/data/types/email-address")
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
   * adds a key to the account. This is typically a password, but``
   * it'll also work for other authorization strategies such as oauth
   */

  addKey(properties) {
    return (new Key(Object.assign({}, properties, { bus: this.bus }))).save();
  }

  /**
   */

  *existsWithEmailAddress() {
    return Promise.resolve(!!(yield this.fetch("load", { query: { emailAddress: this.emailAddress } })));
  }
}

/**
 */

export default User;