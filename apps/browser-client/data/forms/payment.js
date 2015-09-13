import mixinSchema      from "common/data/schema/mixin";
import Schema           from "common/data/schema/schema";
import CreditCardNumber from "common/data/types/credit-card-number";
import CVC              from "common/data/types/cvc";
import httperr          from "httperr" ;

/**
 */

var paymenyFormSchema = new Schema({
  fields: {
    bus: {
      required : true,
      hidden   : true,
      type     : require("common/data/types/bus")
    },
    organization: {
      required: true,
      type: require("api/data/types/reference")
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

@mixinSchema(paymenyFormSchema)
class PaymentForm {

  /**
   */ 

  *submit() { 

    // TODO - move this to command
    var result = yield new Promise(function(resolve, reject) {
      Stripe.card.createToken({
        number: this.cardNumber.valueOf(),
        cvc: 333,
        exp_month: 10,
        exp_year: 16
      }, function(status, result) {
        console.log(arguments);
        if (status !== 200) return reject(new httperr[status]("errors.unableToPay"));
        resolve(result);
      });
    }.bind(this));

    return yield this.bus.execute({
      name: "addStripeCustomer",
      data: result
    });
  }
};

/**
*/

export default PaymentForm;
