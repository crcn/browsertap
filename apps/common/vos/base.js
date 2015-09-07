
/**
 */

class ValueObject {

  /**
   */

  constructor(value) {

    if (!this.validate(value)) {
      throw new Error("invalid");
    }

    this.value = value;
  }

  /**
   */

  validate(value) {
    return true;
  }

  /**
   */

  toJSON() {
    return this.value;
  }
};
