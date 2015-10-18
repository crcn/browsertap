import { AcceptBus, Response } from "mesh";
import sift from "sift";

export default {
  create: function(bus) {

    return AcceptBus.create(sift({ name: "upsert" }), {
      execute: function(operation) {
        return Response.create(async function(writable) {
          var chunk = await bus.execute({
            name: "load",
            collection: operation.collection,
            query: operation.query
          }).read();

          writable.write((await bus.execute({
            name: !chunk.done ? "update" : "insert",
            collection: operation.collection,
            query: operation.query,
            data: operation.data
          }).read()).value);

          writable.close();
        });
      }
    }, bus);
  }
}
