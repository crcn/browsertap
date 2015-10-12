import { AsyncResponse, NoopBus } from "mesh";


export default function(input, output, bus) {

  if (!bus) bus = new NoopBus();

  var _openResponses = {};
  var _i = 0;

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
    _openResponses[id].write(chunkValue);
  }));

  input.on("end", createListener(function(id, chunk) {
    _openResponses[id].end();
    delete _openResponses[id];
  }));

  this.execute = function(operation) {
    var resp = new AsyncResponse();
    _openResponses[operation.id = (++_i)] = resp;
    output.send("operation", operation);
    return resp;
  }
}
