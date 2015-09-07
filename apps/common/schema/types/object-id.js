import ValueType from "./value";

/**
 */

class ObjectId extends ValueType {
  validate(value) {
    return /^\w{24}$/i.test(value);
  }
}

/**
 */

export default ObjectId;