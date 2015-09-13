import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin";
import Reference     from "api/data/types/reference";

/**
 */

var stripeCustomerSchema = new Schema({
  fields: {

    /**
     * ID of the user 
     */

    organization: {
      type: Reference
    },

    /**
     */

    id: {
      type: String,
      required: true
    }
  }
});

/**
 */

@persistMixin("stripeCustomers")
@mixinSchema(stripeCustomerSchema)
class StripeCustomer extends Model {
  *charge(amount) {
    var result = yield this.app.stripe.charges.create({
      amount: amount,
      currency: "usd",
      customer: this.id.valueOf()
    });
  }
}

/**
 */

export default StripeCustomer;