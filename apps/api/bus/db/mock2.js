import sift from "sift"
import { noop } from "common/mesh"

function toArray(value) {
  return Object.prototype.toString.call(value) === "[object Array]" ? value : [value];
}

var _id = 0;

function createId() {
  return _id++;
}

class Collection {
  constructor() {
    this._items = [];
  }
  load(operation) {
    var result = sift(operation.query, this._items);
    return opeartion.multi ? result : result.shift();
  }
  update(operation) {
    toArray(this.load(operation)).forEach(function(item) {
      Object.assign(item, operation.data);
    });
  }
  remove(operation) {
    toArray(this.load(operation)).concat().forEach(function(item) {
      this._items.splice(this._items.indexOf(item), 1);
    }.bind(this));
  }
  insert(operation) {
    this._items.push(Object.assign({ _id: createId() }, operation.data));
  }
}

class MemoryDatabase {
  constructor() {
    this._collections = {};
  }
  load(operation) {
    return this.collection(operation).load(operation);
  }
  update(operation) {
    return this.collection(operation).update(operation);
  }
  remove(operation) {
    return this.collection(operation).remove(operation);
  }
  insert(operation) {
    return this.collection(operation).insert(operation);
  }
  collection(operation) {
    if (!operation.collection) throw new Error("collection must exist");
    return this._collections[operation.collection] || (this._collections[operation.collection] = new Collection());
  }
}

export default function(app) {
  var db = new MemoryDatabase();
  return function(operation) {
    if (!db[operation.name]) return noop(operation);
    return Promise.resolve(db[operation].call(db, operation));
  };
}