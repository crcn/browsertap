import ValueType from "./value";

/**
 */

class Locale extends ValueType {

  /**
   */

  validate(value) {
    return /\w{2}-\w{2}/.test(value);
  }
}

/**
 */

export default Locale;