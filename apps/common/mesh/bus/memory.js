import { Bus, AcceptBus, AsyncResponse, EmptyResponse } from "mesh";
import sift             from "sift";

function _clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function _response(results) {

  // TODO - yield write here
  var resp = new AsyncResponse();
  results.forEach(resp.write.bind(resp));
  resp.end();
  return resp;
}

function _oneOrMany(operation, items) {
  return !operation.multi && !!items.length ? [items[0]] : items;
}

class MemoryCollection {

  constructor(db) {
    this._db    = db;
    this._items = [];
  }

  execute(operation) {
    return this[operation.name](operation);
  }

  insert(operation) {
    var item = _clone(operation.data);
    this._items.push(item);
    return _response(_clone([item]));
  }

  load(operation) {
    var items = sift(operation.query || function() {
      return true;
    }, _clone(this._items));
    return _response(_oneOrMany(operation, items));
  }

  remove(operation) {
    var items = sift(operation.query, this._items);
    items     = _oneOrMany(operation, items);
    items.forEach(function(item) {
      var i = this._items.indexOf(item);
      if (~i) this._items.splice(i, 1);
    }.bind(this));
    return _response(items);
  }

  update(operation) {

    sift(operation.query, this._items).forEach(function(item) {
      Object.assign(item, operation.data);
    });

    var items = sift(operation.query, this._items);

    return _response(items);
  }
}

class MemoryDatabase {

  constructor(initialData) {
    this._collections = {};
    if (initialData) {
      for (var collectionName in initialData) {
        this.collection(collectionName)._items = _clone(initialData[collectionName]);
      }
    }
  }

  collection(name) {
    if (name == void 0) {
      throw new Error("collection name must not be undefined");
    }

    return this._collections[name] || (this._collections[name] = new MemoryCollection(this));
  }
}

class MemoryBus extends Bus {
  constructor(initialData) {
    super();
    this._db = new MemoryDatabase(initialData);
  }
  execute(operation) {
    return /insert|load|remove|update/.test(operation.name)      ?
    this._db.collection(operation.collection).execute(operation) :
    new EmptyResponse();
  }
}

export default MemoryBus;