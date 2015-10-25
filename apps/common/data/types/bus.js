import ValueType from './value';

/**
 */

class Bus extends ValueType {

  /**
   */

  validate(value) {
    return value && !!value.execute;
  }

  /**
   */

  execute(operation) {
    return this.value.execute(operation);
  }
}

/**
 */

export default Bus;
