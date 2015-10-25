import httperr from 'httperr';
/**
 */

class ValueType {

  /**
   */

  constructor(value) {

    value = this.coerce(value);

    // just like strongly typed stuff. The value in the constructor should not
    // be 'castable' to this type
    if (!this.validate(value)) {

      // use same HTTP status codes since they're already spelled out. 
      throw new httperr.BadRequest('invalid');
    }

    this._value = value;
  }

  /**
   */

  get value() {
    return this._value;
  }

  /**
   * converts value from the constructor into the proper data
   * format. This is seen natively in stuff like String(value.toString())
   * and Date objects.
   */

  coerce(value) {
    return value != void 0 ? value.valueOf() : void 0;
  }

  /**
   */

  validate(value) {
    return true;
  }

  /**
   */

  equals(b) {
    return this.valueOf() === b.valueOf();
  }

  /**
   */

  valueOf() {
    return this._value;
  }

  /**
   */

  toString() {
    return this._value;
  }

  /**
   */

  toJSON() {
    return this._value;
  }
}

/**
 */

export default ValueType;
