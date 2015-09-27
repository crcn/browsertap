import accept from "./accept"
import co from "co"
import expect from "expect.js"
import { BufferedResponse } from "./_responses";

describe(__filename + "#", function() {
  it("can accept or reject an operation", co.wrap(function*() {
    var bus = accept(
      function(operation) {
        return operation.accept === true;
      },
      function(operation) {
        return new BufferedResponse("accepted");
      },
      function(operation) {
        return new BufferedResponse("rejected");
      }
    );


    expect(yield bus({ accept: true }).read()).to.be("accepted");
    expect(yield bus({ accept: false }).read()).to.be("rejected");
  }));
});