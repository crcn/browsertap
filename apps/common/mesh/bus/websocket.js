import { NoopBus, AsyncResponse } from "mesh";
import { EventEmitter } from "events";
import ws from "websocket";

var WebSocket = ws.w3cwebsocket;

// TODO - should use remove operation helper - see ros.js
export default function({app, host}, bus) {
  if (!bus) bus = mesh.noop;

  var ws = new WebSocket(host, 'dumb-increment-protocol');

  var _openResponses = {};
  var _waitingOps    = [];
  var _isOpen        = false;
  ws.onerror = function(error) {
  };

  ws.onopen    = function() {
    _isOpen = true;
    _waitingOps.forEach(send);
  }

  ws.onmessage = function(message) {
    var op   = JSON.parse(message.data);
    var resp = _openResponses[op.resp];

    if (!resp) {
      app.logger.verbose("ws remote < ", op);
      return bus.execute(op);
    }

    if (op.data == void 0) {
      resp.end();
      delete _openResponses[op.resp];
    } else {
      resp.write(op.data);
    }
  }

  function send(operation) {
    app.logger.verbose("ws remote > ", operation);
    ws.send(JSON.stringify(operation));
  }

  var _i = 0;
  var _mid = Date.now() + "_" + Math.round(Math.random() * 99999) + "_";

  function createId() {
    return _mid + (++_i);
  }

  this.execute = function(operation) {
    var resp = new AsyncResponse();
    if (!operation.id) {
      operation.id = createId();
    }
    _openResponses[operation.id] = resp;

    if (_isOpen) {
      send(operation);
    } else {
      _waitingOps.push(operation);
    }
    return resp;
  }
}
