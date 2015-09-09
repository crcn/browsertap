import ValueType from "./value";

/**
 */

class EmailAddress extends ValueType {
  validate(value) {
    return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
  }
}

/**
 */

export default EmailAddress;