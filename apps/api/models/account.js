import Model from "common/models/base/model"
import Schema from "common/models/schemas/schema"
import persistMixin from "common/models/mixins/persist"

/**
 */

var schema = new Schema({

});

/**
 */

@persistMixin
class Account extends Model {

}

/**
 */

export default Account;