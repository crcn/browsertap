import { AsyncResponse } from "./_responses";
import co  from "co";

export default function(...busses) {
  return function(operation) {

    var ret = new AsyncResponse();

    var i = 0;
    function *next() {
      try {
        var bus       = busses[i];
        var resp      = bus(operation);
        var chunk;
        var hasData = false;

        while (chunk = yield resp.read()) {
          hasData = true;
          ret.write(chunk);
        }

        if (!hasData) {
          i++;
          co(next);
        } else {
          ret.end();
        }
      } catch(e) {
        ret.error(e);
      }
    }

    co(next);

    return ret;
  };
}
