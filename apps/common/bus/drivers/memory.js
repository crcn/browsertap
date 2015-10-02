class MemoryCollection {
  *execute(operation) {
    console.log("op");
  }
}

class MemoryDatabase {

  constructor() {
    this._collections = {};
  }

  collection(name) {
    if (name == void 0) {
      throw new Error("collection name must not be undefined");
    }
  }
}

export default function() {
    var db = new MemoryDatabase();
    return function(operation) {
      return db.collection(operation.name).execute(operation);
    }
};
