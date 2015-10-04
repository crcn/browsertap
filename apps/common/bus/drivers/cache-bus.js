import { accept, fallback, AsyncResponse } from "common/mesh";
import sift from "sift";
import co from "co";

export default function(localBus, remoteBus) {
  return accept(sift({ name: "load" }), fallback(
    localBus,
    function(operation) {

      var ret = new AsyncResponse();

      function *run() {
        try {
          var resp = remoteBus(operation);
          var chunk;
          while(chunk = yield resp.read()) {
            ret.write(chunk);
            yield localBus({ name: "insert", collection: operation.collection, data: chunk });
          }
          ret.end();
        } catch(e) {
          ret.error(e);
        }
      }

      co(run);

      return ret;
    }
  ), remoteBus);
}
