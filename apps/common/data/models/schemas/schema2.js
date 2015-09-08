import sift from "sift"
import httperr from "httperr"

/**
 * a field 
 */

class Schema {

  /**
   */

  $req = true;

  /**
   */

  constructor(properties) {

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
      isValid = this.$req !== true;
    } else if (!this._sifter(data)) {
      isValid = false;
    }

    if (!isValid) {
      var message = "invalid";
      if (this.$name) message = this.$name + ".invalid";
      return new httperr.BadRequest(message);
    }

    return isValid;
  }

  /**
   */

  _parseOptions(options) {
    var siftOptions = {};

    for (var key in options) {
      var value = options[key];


      if (/^\$(req|name)/.test(key)) {
        continue;
      } else if (key.substr(0, 1) === "$") {
        siftOptions[key] = value;
      }
    }

    this._sifter = sift(siftOptions);
  }
}

/**
 */

export default Schema;