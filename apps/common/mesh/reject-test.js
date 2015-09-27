import reject from "./reject"
import co from "co"
import expect from "expect.js"
import { BufferedResponse } from "./_responses";

describe(__filename + "#", function() {
  it("can accept or reject an operation", co.wrap(function*() {

    var bus = reject(
      function(operation) {
        return operation.reject === true;
      },
      function(operation) {
        return new BufferedResponse("accepted");
      },
      function(operation) {
        return new BufferedResponse("rejected");
      }
    );

    expect(yield bus({ reject: true }).read()).to.be("rejected");
    expect(yield bus({ reject: false }).read()).to.be("accepted");
  }));
});
