import Model         from 'common/data/models/model'
import Schema        from 'common/data/schema/schema';
import Reference     from 'common/data/types/reference';

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

class StripeCustomer extends Model {
  static collectionName = 'stripeCustomers';
  constructor(properties) {
    super(stripeCustomerSchema, properties);
  }
  async charge(amount) {

    var result = await this.app.stripe.charges.create({
      amount: amount,
      currency: 'usd',
      customer: this.id.valueOf()
    });

  }
}

/**
 */

export default StripeCustomer;
