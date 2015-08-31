var extend = require("lodash/object/extend");
var sift   = require("sift");
var get    = require("common/utils/get-property");

/**
 */
function PropertyValidator(property, options) {

  this.property = property;

  extend(this, options);

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

  this.validate = validate;
}

/**
 */

extend(PropertyValidator.prototype, {
  getError: function(value) {

    if (value == void 0) {
      if (this.required) return new Error("not defined");
      return;
    }

    if (!this.validate(value)) {
      return new Error("invalid");
    }
  },
  serialize: function(value) { return value; }
});

/**
 */

function Schema(properties) {
  if (!properties) properties = {};

  this.__validators = [];

  for (var key in properties) {
    this.__validators.push(new PropertyValidator(key, properties[key]));
  }
}

/**
 */

extend(Schema.prototype, {

  /**
   */

  getError: function(propsFilter, data) {

    if (arguments.length === 1) {
      data        = propsFilter;
      propsFilter = void 0;
    }

    var validators = this.getValidators(propsFilter);

    var error;
    for (var i = 0, n = validators.length; i < n; i++) {
      var validator = validators[i];
      if ((error = validator.getError(get(data, validator.property)))) return error;
    }
    return error;
  },

  /**
   */

  serialize: function(data) {
    var validators = this.getValidators();
    var newData = {};
    for (var i = validators.length; i--;) {
      var validator = validators[i];
      var value     = get(data, validator.property);
      if (value == void 0) continue;
      newData[validator.property] = validator.serialize(value);
    }
    return newData;
  },

  /**
   */

  validate: function() {
    return !this.getError.apply(this, arguments);
  },

  /**
   * pluck properties
   */

  pluck: function(propsFilter, data) {
    var keys = this.getValidators(propsFilter).map(function(validator) {
      return validator.property;
    });
    var newData = {};
    for (var i = keys.length; i--;) {
      var key = keys[i];
      var value = data[key];
      if (value != void 0) newData[key] = value;
    }
    return newData;
  },

  /**
   */

  getValidators: function(filter) {
    if (filter) {
      if (typeof filter !== "function") {
        filter = sift(filter);
      }
      return this.__validators.filter(filter);
    } else {
      return this.__validators;
    }
  }
});

/**
 */

module.exports = Schema;
