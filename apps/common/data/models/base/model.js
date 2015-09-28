import {EventEmitter} from "events";
import mesh from "mesh";


var __getters = {};

/**
 */

class BaseModel extends EventEmitter {

  /**
   */

  constructor(properties) {
    super();
    if (properties) Object.assign(this, properties);
  }

  /**
   * sets properties on the model
   */

  setProperties(properties) {

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

    if (hasChanged) {
      this.emit("change", { properties: newProps }, { properties: oldProps });
    }
  }

  /**
   * GET properties on the model without busting
   */

  get(keypath) {
    if (__getters[keypath]) return __getters[keypath](this);
    __getters[keypath] = new Function("self", "try { return self." + keypath + "} catch(e) { }");
    return this.get(keypath);
  }

  /**
   */

  _createMixins() {
    return {}
  }
}

/**
 */

export default BaseModel;
