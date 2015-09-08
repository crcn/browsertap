import reject from "./reject"
import co from "co"
import expect from "expect.js"

describe(__filename + "#", function() {
  it("can accept or reject an operation", co.wrap(function*() {

    var bus = reject(
      function(operation) {
        return operation.reject === true;
      },
      function(operation) {
        return Promise.resolve("accepted");
      },
      function(operation) {
        return Promise.resolve("rejected");
      }
    );

    expect(yield bus({ reject: true })).to.be("rejected");
    expect(yield bus({ reject: false })).to.be("accepted");
  }));
});
