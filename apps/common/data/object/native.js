
class DataObject {

  /**
   */

  constructor(properties) {
    if (properties) Object.assign(this, properties);
  }

  /**
   * sets properties on the data object and triggeres a change
   */

  setProperties(properties) {
    Object.assign(this, properties);
  }

  /**
   */

  _addChange(change) {
    Object.getNotifier(this).performChange(change.type, function() {
      return change;
    });
  }

  /**
   */

  watch(changeWatcher) {
    Object.observe(this, changeWatcher);
    return {
      dispose: () => {
        var i = this._watchers.indexOf(changeWatcher);
        if (!!~i) this._watchers.splice(i, 1);
      }
    }
  }
}

/**
 */

export default DataObject;
