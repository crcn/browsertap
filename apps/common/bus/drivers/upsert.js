import { accept, AsyncResponse } from "common/mesh";
import sift from "sift";
import co from "co";

export default function(bus) {
  return accept(sift({ name: "upsert" }), function(operation) {
    var resp = new AsyncResponse();
    co(function*() {

      var found = yield bus({
        name: "load",
        collection: operation.collection,
        query: operation.query
      }).read();

      resp.end(yield bus({
        name: found ? "update" : "insert",
        collection: operation.collection,
        query: operation.query,
        data: operation.data
      }).read());
    });
    return resp;
  }, bus);
}
