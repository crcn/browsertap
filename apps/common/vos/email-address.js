import ValueObject from "./base";

/**
 */

class EmailAddress extends ValueObject {
  validate(value) {
    return //.test(value);
  }
};
