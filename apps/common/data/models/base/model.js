import {EventEmitter} from 'events';


/**
 * TODO: move persistence stuff over to here. BaseModel should extend DataTransferObject, or similar
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
      this.emit('change', { properties: newProps }, { properties: oldProps });
    }
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
