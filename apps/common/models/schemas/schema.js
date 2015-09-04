import sift from "sift";
import get from "common/utils/get-property";

/**
 */

class PropertyValidator {

  /**
   */

  constructor(property, options) {
    this.property = property;

    this.options = options;

    this.required = options.required;
    var validate = options.validate;

    if (typeof validate === "object") {
      validate = sift(validate);
    }

    if (!validate) {
      validate = function() {
        return true;
      };
    }

    this._validate = validate;
  }

  /**
   */

  validate(value) {

    if (value == void 0) {
      if (this.options.req) return Promise.reject(new Error("not defined"));
    } else if (!this._validate(value)) {
      return Promise.reject(new Error("invalid"));
    }

    return Promise.resolve(true);
  }

  /**
   */

  serialize(value) { return value; }

  /**
   */

  deserialize(value) { return value; }
};

class Schema {

  /**
   */

  constructor(properties) {
    if (!properties) properties = {};

    this.__validators = [];

    for (let key in properties) {
      this.__validators.push(new PropertyValidator(key, properties[key]));
    }
  }

  /**
   */

  validate(propsFilter, data) {

    if (arguments.length === 1) {
      data        = propsFilter;
      propsFilter = void 0;
    }

    var validators = this.getValidators(propsFilter);

    return Promise.all(validators.map(function(validator) {
      return validator.validate(get(data, validator.property));
    })).then(function() {
      return Promise.resolve(true);
    });
  }

  /**
   */

  serialize(data) {
    var validators = this.getValidators();
    var newData = {};
    for (let i = validators.length; i--;) {
      var validator = validators[i];
      var value     = get(data, validator.property);
      if (value == void 0) continue;
      newData[validator.property] = validator.serialize(value);
    }
    return newData;
  }

  /**
   */

  deserialize(data) {
    var validators = this.getValidators();
    var newData = {};
    for (let i = validators.length; i--;) {
      var validator = validators[i];
      var value     = get(data, validator.property);
      if (value == void 0) continue;
      newData[validator.property] = validator.deserialize(value);
    }
    return newData;
  }

  /**
   * pluck properties
   */

  pluck(propsFilter, data) {
    var keys = this.getValidators(propsFilter).map(function(validator) {
      return validator.property;
    });
    var newData = {};
    for (let i = keys.length; i--;) {
      var key = keys[i];
      var value = data[key];
      if (value != void 0) newData[key] = value;
    }
    return newData;
  }

  /**
   */

  getValidators(filter) {
    if (filter) {
      if (typeof filter !== "function") {
        filter = sift(filter);
      }
      return this.__validators.filter(filter);
    } else {
      return this.__validators;
    }
  }
}

/**
 */

export default Schema;
