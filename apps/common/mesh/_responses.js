var events       = require("events");
var EventEmitter = events.EventEmitter;
var co           = require("co");

/**
 */

export class BufferedResponse {

  /**
   */

  constructor(chunk) {
    this.chunk = chunk;
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

export class NoResponse {
  read() {

  }
  readAll() {
    return Promise.resolve([]);
  }
}

/**
 */

export class AsyncResponse extends EventEmitter {

  /**
   */

  constructor() {
    super();
    this._chunks = [];
  }

  /**
   */

  read() {
    if (this._chunks.length) {
      var chunk = this._chunks.shift();
      if (chunk instanceof Error) return Promise.reject(chunk);
      return Promise.resolve(chunk);
    }
    return new Promise(function(resolve, reject) {
      this.once("data", function() {
        this.read().then(resolve, reject);
      }.bind(this));
    }.bind(this));
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
    this.emit("data", chunk);
  }

  /**
   */

  error(chunk) {
    this.end(chunk);
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
  }
}

/**
 */

export class PromiseResponse extends EventEmitter {
  constructor(run) {
    super();
    this._run = run;
  }
  read() {
    var run = this._run;
    this._run = void 0;
    return run();
  }
}
