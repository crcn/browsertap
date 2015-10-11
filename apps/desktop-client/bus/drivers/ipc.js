import { AsyncResponse, NoopBus } from "mesh";
import co from "co";


export default function(connection, bus) {

  if (!bus) bus = noop;

  var _openResponses = {};
  var _i = 0;

  connection.on("operation", co.wrap(function*(operation) {
    var resp = bus.execute(operation);
    var chunk;
    while(chunk = yield resp.read()) {
      console.log("RESP", connection.send);
      connection.send("chunk", operation.id, chunk);
    }
    ipc.send("end", operation.id);
  }));

  connection.on("chunk", function(id, chunk) {
    console.log("CHUNK", chunk);
    _openResponses[id].write(chunk);
  });

  connection.on("end", function(id, chunk) {
    console.log("END");
    _openResponses[id].end();
    delete _openResponses[id];
  });

  return function(operation) {
    var resp = new AsyncResponse();
    _openResponses[operation.id = (++_i)] = resp;
    connection.send("operation", operation);
    return resp;
  }
}
