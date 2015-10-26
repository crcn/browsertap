
class DataObject {

  /**
   */

  constructor(properties) {
    this._changes  = [];
    this._watchers = [];
    if (properties) Object.assign(this, properties);
  }

  /**
   * sets properties on the data object and triggeres a change
   */

  setProperties(properties) {

    var changes = [];

    for (var key in properties) {
      var newValue = properties[key];
      var oldValue = this[key];

      // note that type=delete is NOT supported
      // since it requires properties to actually be deleted. This
      // is not something we want to do since it causes uneccessary GC cycles
      if (oldValue == void 0) {
        this._addChange({
          type: 'add',
          object: this,
          name: key
        });
      } else {
        this._addChange({
          type: 'update',
          object: this,
          name: key,
          oldValue: oldValue
        });
      }
    }

    Object.assign(this, properties);
  }

  /**
   */

  _addChange(change) {
    change.object = this;
    this._changes.push(change);
    if (this._running) return;
    this._running = true;
    process.nextTick(() => {
      var changes = this._changes.concat();
      this._changes = [];
      this._running = false;
      for (var i = this._watchers.length; i--;) {
        this._watchers[i](changes);
      }
    });
  }

  /**
   */

  watch(changeWatcher) {
    this._watchers.push(changeWatcher);
    return {
      dispose: () => {
        var i = this._watchers.indexOf(changeWatcher);
        if (!!~i) this._watchers.splice(i, 1);
      }
    }
  }
}

DataObject.create = require('common/utils/class/create');

/**
 */

export default DataObject;
