import sift from "sift"
import httperr from "httperr"

/**
 * a field 
 */

class Field {

  /**
   */

  _required = true;

  /**
   */

  constructor(name, properties) {
    this.name = name;

    Object.assign(this, properties || {});
    this._parseOptions(this);
  }

  /**
   */

  serialize(data) {

  }

  /**
   */

  deserialize(data) {

  }

  /**
   */

  equals(a, b) {
    // override me. Useful for comparing two values or objects together
    // where == might not be appropriate. 
  }

  /**
   */

  validate(data) {

    var isValid = true;

    if (data == void 0) {
      isValid = this._required !== true;
    } else if (!this._sifter(data)) {
      isValid = false;
    }

    return isValid ? true : new httperr.BadRequest("invalid");
  }

  /**
   */

  _parseOptions(options) {
    var siftOptions = {};

    for (var key in options) {
      var value = options[key];

      if (key === "$req") {
        this._required = value;
      } else if (key.substr(0, 1) === "$") {
        siftOptions[key] = value;
      }
    }

    this._sifter = sift(siftOptions);
  }
}

/**
 */

export default Field;