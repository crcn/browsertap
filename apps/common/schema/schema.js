import httperr from "httperr"

/**
 */

class Field {
  constructor(properties) {
    if (typeof properties === "function") {
      this.typeClass = properties;
    } else {
      Object.assign(this, properties);
    }
  }
}

/**
 */

class Schema {

  /**
   */

  constructor(options) {

    if (!options) options = {};

    var fields  = options.fields || {};
    var _fields = {};

    for (var key in fields) {
      _fields[key] = new Field(fields[key]);
    }

    this.fields = _fields;
  }

  /**
   */

  coerce(data) {
    var coercedData = {};

    for (var property in this.fields) {

      var field  = this.fields[property];
      var value  = data[property];

      if (value == void 0) continue;

      try {
        coercedData[property] = new field.typeClass(value);
      } catch(e) {

        // re-throw with a more especific error message. This is coded as well so that it can be
        // internationalized. 
        if (e.statusCode === 400) {
          throw new httperr.BadRequest(property + "." + e.message);
        }

        throw e;
      }
    }

    return coercedData;
  }
}

/**
 */

export default Schema;