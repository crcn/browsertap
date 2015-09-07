import ValueType from "./value";

/**
 */

class EmailAddress extends ValueType {
  validate(value) {
    return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value);
  }
}

/**
 */

export default EmailAddress;