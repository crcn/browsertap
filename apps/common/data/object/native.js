
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
        Object.unobserve(this, changeWatcher);
      }
    }
  }
}

/**
 */

export default DataObject;
