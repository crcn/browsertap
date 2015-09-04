import Model from "common/models/base/model"
import Schema from "common/models/schemas/schema"
import persistMixin from "common/models/mixins/persist"
import validateMixin from "common/models/mixins/validate"

/**
 */

var schema = new Schema({

  /**
   */

  emailAddress: { 
    req: true, 
    validate: require("common/utils/validate/email")
  }
});

/**
 */

@persistMixin("users")
@validateMixin(schema)
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

  *insert() {
    if (yield this.existsWithEmailAddress()) {
      throw new Error("user already exists");
    }
  }

  /**
   */

  *existsWithEmailAddress() {
    return Promise.resolve(!!(yield this.fetch("load", { emailAddress: this.emailAddress })));
  }
}

/**
 */

export default User;