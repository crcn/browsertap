var events       = require("events");
var EventEmitter = events.EventEmitter;
var co           = require("co");

// TODO - do this
export class BaseResponse {
  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject  = reject;
    });
  }

  then(resolve, reject) {
    return this._promise.then(resolve, reject);
  }
}

/**
 */

export class BufferedResponse extends BaseResponse {

  /**
   */

  constructor(chunk) {
    super();
    this.chunk = chunk;
    this._resolve();
  }

  /**
   */

  read() {
    var p = Promise.resolve(this.chunk);
    this.chunk = void 0;
    return p;
  }

  /**
   */

  readAll() {
    return new Promise(function(resolve, reject) {
      this.read().then(function(chunk) {
        resolve(chunk == void 0 ? [] : [chunk]);
      }, reject);
    }.bind(this));
  }
}

/**
 */

export class NoResponse extends BaseResponse {
  constructor() {
    super();
    this._resolve();
  }
  read() {
    return Promise.resolve(void 0);
  }
  readAll() {
    return Promise.resolve([]);
  }
}

/**
 */

export class AsyncResponse extends BaseResponse {

  /**
   */

  constructor() {
    super();
    this._chunks = [];
    this._em     = new EventEmitter();
  }

  /**
   */

  read() {

    if (this._chunks.length) {
      var chunk = this._chunks.shift();
      if (chunk instanceof Error) return Promise.reject(chunk);
      return Promise.resolve(chunk);
    }

    return new Promise((resolve, reject) => {
      this._em.once("data", () => {
        this.read().then(resolve, reject);
      });
    });
  }

  /**
   */

  readAll() {
    return co(function*() {
      var chunks = [];
      var chunk;
      while(chunk = yield this.read()) chunks.push(chunk);
      return chunks;
    }.bind(this));
  }

  /**
   */

  write(chunk) {
    this._chunks.push(chunk);
    this._em.emit("data", chunk);
  }

  /**
   */

  error(chunk) {
    this.end(chunk);
    this._reject(chunk);
  }

  /**
   */

  end(chunk) {
    this.write(chunk);

    // end
    if (chunk != void 0) {
      this.write(void 0);
    }

    this.ended = true;
    this._resolve();
  }
}
