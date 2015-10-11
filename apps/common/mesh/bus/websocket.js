import { NoopBus, AsyncResponse } from "mesh";
import co from "co";
import { EventEmitter } from "events";
import ws from "websocket";

var WebSocket = ws.w3cwebsocket;

export default function(options, bus) {
  if (!bus) bus = mesh.noop;

  var ws = new WebSocket(options.host, 'dumb-increment-protocol');

  var _openResponses = {};
  var _waitingOps    = [];
  var _isOpen        = false;

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

  var _id = 0;

  this.execute = function(operation) {
    var resp = new AsyncResponse();
    operation.id = resp._id = _id++;

    _openResponses[resp._id] = resp;

    if (_isOpen) {
      send(operation);
    } else {
      _waitingOps.push(operation);
    }
    return resp;
  }
}