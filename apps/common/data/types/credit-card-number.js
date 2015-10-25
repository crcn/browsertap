import ValueType from './value';
import cc        from 'credit-card';

/**
 */

class CreditCardNumber extends ValueType {
  validate(value) { 
    return cc.determineCardType(value) != void 0;
  }
  get type() {
    return cc.determineCardType(this.value);
  }
}

/**
 */

export default CreditCardNumber;