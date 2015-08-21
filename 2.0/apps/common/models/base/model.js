var extend       = require("lodash/object/extend");
var EventEmitter = require("events");

var __getters = {};

/**
 */

function BaseModel(properties) {
  EventEmitter.call(this);
  if (properties) extend(this, properties);
}

/**
 */

extend(BaseModel.prototype, EventEmitter.prototype, {

  /**
   * sets properties on the model
   */

  setProperties: function(properties) {

    var oldProps   = {};
    var newProps   = {};
    var hasChanged = false;

    for (var key in properties) {
      if (this[key] !== properties[key]) {
        hasChanged = true;
        oldProps[key] = this[key];
        newProps[key] = this[key] = properties[key];
      }
    }

    if (hasChanged) this.emit("change", { properties: newProps }, { properties: oldProps });
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
