import co from "co";
import { AsyncResponse } from "./_responses";

/**
 */

export default function(bus, onError) {

  return function(operation) {

    var resp = new AsyncResponse();
    co(function*() {
      try {
        var bresp = bus(operation);
        (yield bresp.readAll()).forEach(resp.write.bind(resp));
        resp.end();
      } catch(e) {
        onError(e);
        resp.error(e);
      }
    });
    return resp;
  }
};
