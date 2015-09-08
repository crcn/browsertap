import accept from "./accept"
import co from "co"
import expect from "expect.js"

describe(__filename + "#", function() {
  it("can accept or reject an operation", co.wrap(function*() {
    var bus = accept(
      function(operation) {
        return operation.accept === true;
      },
      function(operation) {
        return Promise.resolve("accepted");
      },
      function(operation) {
        return Promise.resolve("rejected");
      }
    );


    expect(yield bus({ accept: true })).to.be("accepted");
    expect(yield bus({ accept: false })).to.be("rejected");
  }));
});