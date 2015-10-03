import { AsyncResponse } from "./_responses"

export default function(bus) {
  var spies = [];
  return function(operation) {
    var ret;
    if (operation.name === "spy") {
      ret = new AsyncResponse();
      ret.then(function() {
        spies.splice(spies.indexOf(ret), 1);
      });
      spies.push(ret);
    } else {
      ret = bus(operation);
      ret.operation = operation;
      spies.forEach(function(spy) {
        spy.write({
          operation: operation,
          response: ret
        });
      });
    }
    return ret;
  }
}
