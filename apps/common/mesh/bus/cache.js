import { AcceptBus, FallbackBus, AsyncResponse } from "mesh";
import sift from "sift";

export default function(localBus, remoteBus) {

  var bus = new AcceptBus(sift({ name: "load" }), new FallbackBus([
    localBus,
    {
      execute: function(operation) {
        return new AsyncResponse(async function(writable) {
          try {
            var resp = remoteBus.execute(operation);
            var value;
            var done;
            while({value, done} = await resp.read()) {
              if (done) break;
              writable.write(value);
              await localBus.execute({ name: "insert", collection: operation.collection, data: value }).read();
            }
            writable.end();
          } catch(e) {
            writable.error(e);
          }
        });
      }
    }
  ]), remoteBus);

  this.execute = bus.execute.bind(bus);
}
