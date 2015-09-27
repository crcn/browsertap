import { AsyncResponse } from "./_responses"

export default function(bus) {
  var spies = [];
  return function(operation) {
    var ret;
    if (operation.name === "spy") {
      ret = new AsyncResponse();
      ret.once("end", function() {
        spies.splice(spies.indexOf(ret), 1);
      });
      spies.push(ret);
    } else {
      ret = bus(operation);
      spies.forEach(function(spy) {
        spy.write(ret);
      });
    }
    return ret;
  }
}