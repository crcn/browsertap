import httperr from "httperr"

/**
 */

class Field {

  /**
   */

  constructor(properties) {

    if (typeof properties === "function") {
      this.type = properties;
    } else {
      Object.assign(this, properties);
    }

    if (!this.type) {
      throw new Error("type must exist for schema field");
    }
  }

  /**
   */

  coerce(value) {

    // TODO - check for invalid
    if (value == void 0) {
      if (this.required) {
        throw new httperr.BadRequest("invalid");
      }
      return;
    }

    var typeClass = this.type;

    if (this.collection) {
      if (!Array.isArray(value)) {
        throw new httperr.BadRequest("invalid");
      }
      return value.map(function(value) {
        return new typeClass(value);
      });
    }

    return new typeClass(value);
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
      var fieldOptions = fields[key];
      if (Array.isArray(fieldOptions)) {
        fieldOptions = typeof fieldOptions[0] === "function" ? {
          type: fieldOptions[0]
        } : fieldOptions[0];

        fieldOptions = Object.assign({ collection: true }, fieldOptions);
      }
      _fields[key] = new Field(fieldOptions);
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

      try {
        coercedData[property] = field.coerce(value);
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