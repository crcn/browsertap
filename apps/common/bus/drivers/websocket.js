import mesh from "common/mesh";
import co from "co";
import { EventEmitter } from "events";

export default function(options, bus) {
  if (!bus) bus = mesh.noop;

  if (!process.browser) return mesh.noop;

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
      return bus(op);
    }

    if (op.data == void 0) {
      resp.end();
      delete _openResponses[op.resp];
    } else {
      resp.write(op.data);
    }
  }

  function send(operation) {
    ws.send(JSON.stringify(operation));
  }

  var _id = 0;

  return function(operation) {
    var resp = new mesh.AsyncResponse();
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
