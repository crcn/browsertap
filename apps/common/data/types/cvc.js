import ValueType from './value';

/**
 */

class CreditCardNumber extends ValueType {
  validate(value) {
    return /^\d+$/i.test(value);
  }
}

/**
 */

export default CreditCardNumber;