import { AcceptBus, AsyncResponse } from "mesh";
import sift from "sift";

export default function(bus) {

  var bus = new AcceptBus(sift({ name: "upsert" }), {
    execute: function(operation) {
      return new AsyncResponse(async function(writable) {
        var chunk = await bus.execute({
          name: "load",
          collection: operation.collection,
          query: operation.query
        }).read();

        writable.end((await bus.execute({
          name: !chunk.done ? "update" : "insert",
          collection: operation.collection,
          query: operation.query,
          data: operation.data
        }).read()).value);
      });
    }
  }, bus);

  this.execute = bus.execute.bind(bus);
}
