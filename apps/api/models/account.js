import Model from "common/models/base/model"
import Schema from "common/models/schemas/schema"
import persistMixin from "common/models/mixins/persist"
import validateMixin from "common/models/mixins/validate"

/**
 */

var schema = new Schema({

});

/**
 */

@persistMixin
@validateMixin(schema)
class Account extends Model {

}

/**
 */

export default Account;