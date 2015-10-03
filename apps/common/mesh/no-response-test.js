import { NoResponse } from "./_responses";

describe(__filename + "#", function() {
  it("can call then", function(next) {
    var nr = new NoResponse();
    nr.then(next);
  });
});
