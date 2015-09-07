import Model         from "common/models/base/model"
import Schema        from "common/models/schemas/schema"
import persistMixin  from "common/models/mixins/persist"
import validateMixin from "common/models/mixins/validate"

/**
 */

var schema = new Schema({

  /**
   */

  _id: { },

  /**
   */

  emailAddress: { 
    req: true, 
    unique: true
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

  *existsWithEmailAddress() {
    return Promise.resolve(!!(yield this.fetch("load", { query: { emailAddress: this.emailAddress } })));
  }
}

/**
 */

export default User;