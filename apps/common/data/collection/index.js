import DataObject from '../object';

/**
 */

class Collection extends DataObject {

  /**
   */

  constructor(properties) {
    super(properties);
    if (!this.target) this.target = [];
    this.length = this.target.length;
  }

  /**
   */

  setProperties(properties) {
    super.setProperties(properties);
    if (properties.target) {
      this.length = this.target.length;
    }
  }

  /**
   */

  at(index) {
    return this.target[index];
  }

  /**
   */

  push(...items) {
    return this.splice(this.length, 0, ...items);
  }

  /**
   */

  unshift(...items) {
    return this.splice(0, 0, ...items);
  }

  /**
   */

  shift() {
    return this.splice(0, 1);
  }

  /**
   */

  pop() {
    return this.splice(this.length - 1, 1);
  }

  /**
   */

  splice(start, removeCount, ...newItems) {
    var removed = this.target.slice(start, start + removeCount);
    this.target.splice(start, removeCount, ...newItems);

    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe

    this._addChange({
      type       : 'splice',
      object: this,
      index      : start,
      removed    : removed,
      addedCount : newItems.length
    });

    this.length = this.target.length; // reset length

    return this;
  }
}

/**
 * get methods
 */

[
  'map',
  'forEach',
  'reduce',
  'filter',
  'find',
  'join',
  'slice',
  'sort',
  'concat',
  'indexOf',
  'lastIndexOf',
  'revers'
].forEach(function(methodName) {
  Collection.prototype[methodName] = function(...args) {
    return this.target[methodName].apply(this.target, args);
  }
});

/**
 */

export default Collection;
