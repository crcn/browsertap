import mesh from "mesh";
import {Stream} from "obj-stream";
import sift from "sift";

// TODO - implement max, and once: Boolean
module.exports = function(bus) {
  var interceptors = [];

  return function(operation) {
    var ret;

    if (operation.name === "intercept") {
      ret = new Stream();

      ret.operation = operation;
      ret.test      = sift(operation.query || function() { return true; });
      ret.count     = 0;
      ret.max       = ret.operation.max || Infinity;

      interceptors.push(ret);

      // TODO - remote interceptor on end
      ret.once("end", function() {
        interceptors.splice(interceptors.indexOf(ret), 1);
      });
    } else {
      var use = [];

      for (var i = interceptors.length; i--;) {
        var interceptor = interceptors[i];
        if (interceptor.test(operation)) {
          use.push(interceptor.operation.bus);
          if (++interceptor.count >= interceptor.max) {
            interceptor.end();
          }
        }
      }

      use.push(bus);

      var ibus = use.length > 1 ? mesh.sequence(use) : use[0];
      ret = ibus(operation);
    }

    return ret;
  };
};
