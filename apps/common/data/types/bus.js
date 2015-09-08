import ValueType from "./value";

/**
 */

class Bus extends ValueType {

  /**
   */

  validate(value) {
    return typeof value === "function";
  }

  /**
   */

  *execute(operation) {
    return yield this.value(operation);
  }
}

/**
 */

export default Bus;