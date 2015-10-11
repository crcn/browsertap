import { AcceptBus, FallbackBus, AsyncResponse } from "mesh";
import sift from "sift";
import co from "co";

export default function(localBus, remoteBus) {

  var bus = new AcceptBus(sift({ name: "load" }), new FallbackBus([
    localBus,
    {
      execute: function(operation) {
        return new AsyncResponse(co.wrap(function*(writable) {
          try {
            var resp = remoteBus.execute(operation);
            var value;
            var done;
            while({value, done} = yield resp.read()) {
              if (done) break;
              writable.write(value);
              yield localBus.execute({ name: "insert", collection: operation.collection, data: value }).read();
            }
            writable.end();
          } catch(e) {
            writable.error(e);
          }
        }));
      }
    }
  ]), remoteBus);

  this.execute = bus.execute.bind(bus);
}
