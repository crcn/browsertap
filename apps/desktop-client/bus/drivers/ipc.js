import { Response, NoopBus } from "mesh";

// TODO - should use remove operation helper - see ros.js
export default {
  create: function (input, output, bus) {

    if (!bus) bus = NoopBus.create();

    var _openResponses = {};
    var _i = 0;
    var _mid = Date.now() + "_" + Math.round(Math.random() * 99999) + "_";

    function createId() {
      return _mid + (++_i);
    }

    function createListener(callback) {
      return function(event) {
        var args = Array.prototype.slice.call(arguments);
        if (args[0].sender) args.shift();
        return callback.apply(this, args);
      }
    }

    input.on("operation", createListener(async function(operation) {
      var resp = bus.execute(operation);
      var chunk;
      while(chunk = await resp.read()) {
        if (chunk.done) break;
        output.send("chunk", operation.id, chunk.value);
      }
      output.send("end", operation.id);
    }));

    input.on("chunk", createListener(function(id, chunkValue) {
      if (_openResponses[id]) _openResponses[id].write(chunkValue);
    }));

    input.on("end", createListener(function(id, chunk) {
      if (_openResponses[id]) _openResponses[id].end();
      delete _openResponses[id];
    }));

    return {
      execute: function(operation) {
        return Response.create(function(writable) {
          _openResponses[operation.id = createId()] = writable;
          output.send("operation", operation);
        });
      }
    };
  }
}
