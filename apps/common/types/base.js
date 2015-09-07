
/**
 */

class Type {

  /**
   */

  constructor(value) {
    value = this.coerce(value);

    // just like strongly typed stuff. The value in the constructor should not
    // be "castable" to this type
    if (!this.validate(value)) {
      throw new Error("invalid");
    }
  }

  /**
   * converts value from the constructor into the proper data
   * format. This is seen natively in stuff like String(value.toString())
   * and Date objects.
   */

  coerce(value) {
    return value;
  }

  /**
   */

  validate(value) {
    return true;
  }
}

export default Type;
