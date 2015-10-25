import ValueType from './value';

/**
 */

class ObjectId extends ValueType {

  /**
   */

  validate(value) {
    return /^\w{24}$/i.test(value);
  }

  /** 
   */

  coerce(value) {
    return String(value == void 0 ? createObjectId() : value);
  }

}

/**
 */

export default ObjectId;