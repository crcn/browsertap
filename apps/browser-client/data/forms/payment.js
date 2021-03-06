import Schema           from 'common/data/schema/schema';
import CreditCardNumber from 'common/data/types/credit-card-number';
import CVC              from 'common/data/types/cvc';
import Form             from 'common/data/forms/base';
import httperr          from 'httperr' ;

/**
 */

var paymenyFormSchema = new Schema({
  fields: {
    organization: {
      required: true,
      type: require('common/data/types/reference')
    },
    cardNumber: {
      type: CreditCardNumber
    },
    cvc: {
      type: CVC
    },
    expiration: {
      type: Date
    }
  }
});

/**
 */

class PaymentForm extends Form {

  /**
   */

  constructor(properties) {
    super(paymentFormSchema, properties);
  }

  /**
   */

  async submit() {

    // TODO - move this to command
    var result = await new Promise((resolve, reject) => {
      Stripe.card.createToken({
        number: this.cardNumber.valueOf(),
        cvc: 333,
        exp_month: 10,
        exp_year: 16
      }, function(status, result) {
        if (status !== 200) return reject(new httperr[status]('errors.unableToPay'));
        resolve(result);
      });
    });

    return await this.bus.execute({
      action: 'addStripeCustomer',
      data: {
        organization: this.organization,
        customer: result
      }
    });
  }
};

/**
*/

export default PaymentForm;
