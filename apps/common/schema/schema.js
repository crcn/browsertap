import httperr from "httperr"

/**
 */

class Schema {

  /**
   */

  constructor(options) {
    Object.assign(this, options);
  }

  /**
   */

  coerce(data) {
    var coercedData = {};

    for (var property in this.fields) {

      var fieldClass = this.fields[property];
      var value      = data[property];

      try {
        coercedData[property] = new fieldClass(value);
      } catch(e) {

        // re-throw with a more especific error message. This is coded as well so that it can be
        // internationalized. 
        if (e.statusCode === 400) throw new httperr.BadRequest(property + "." + e.message);
        throw e;
      }
    }

    return coercedData;
  }
}

/**
 */

export default Schema;