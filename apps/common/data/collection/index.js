import { EventEmitter } from "events";

/**
 */

class Collection extends EventEmitter {

  /**
   */

  constructor(properties) {
    super();
    if (properties) Object.assign(this, properties);
    if (!this.source) this.source = [];
    this.length = this.source.length;
  }

  /**
   */

  at(index) {
    return this.source[index];
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
    var removed = this.source.slice(start, start + removeCount);
    this.source.splice(start, removeCount, ...newItems);
    this.length = this.source.length; // reset length

    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
    var changes = [];

    changes.push({
      type: "splice",
      object: this,
      index: start,
      removed: removed,
      addedCount: newItems.length
    });

    this.emit("change", changes);

    return this;
  }
}

/**
 * get methods
 */

[
  "map",
  "forEach",
  "reduce",
  "join",
  "slice",
  "sort",
  "concat",
  "indexOf",
  "lastIndexOf",
  "revers"
].forEach(function(methodName) {
  Collection.prototype[methodName] = function(...args) {
    return this.source[methodName].apply(this.source, args);
  }
});

/**
 */

export default Collection;
