var extend     = require("xtend/mutable");

var __getters = {};

/**
 */

function BaseModel(properties) {
  if (properties) extend(this, properties);
}

/**
 */

extend(BaseModel.prototype, {

  /**
   * sets properties on the model
   */

  setProperties: function(properties) {
    for (var key in properties) {
      this[key] = properties[key];
    }
  },

  /**
   * GET properties on the model without busting
   */

  get: function(keypath) {
    if (__getters[keypath]) return __getters[keypath](this);
    __getters[keypath] = new Function("self", "try { return self." + keypath + "} catch(e) { }");
    return this.get(keypath);
  }
});

/**
 */

module.exports = BaseModel;
