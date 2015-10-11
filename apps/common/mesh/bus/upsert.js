import { AcceptBus, AsyncResponse } from "mesh";
import sift from "sift";
import co from "co";

export default function(bus) {

  var bus = new AcceptBus(sift({ name: "upsert" }), {
    execute: function(operation) {
      return new AsyncResponse(co.wrap(function*(writable) {
        var chunk = yield bus.execute({
          name: "load",
          collection: operation.collection,
          query: operation.query
        }).read();

        writable.end((yield bus.execute({
          name: !chunk.done ? "update" : "insert",
          collection: operation.collection,
          query: operation.query,
          data: operation.data
        }).read()).value);
      }));
    }
  }, bus);

  this.execute = bus.execute.bind(bus);
}
