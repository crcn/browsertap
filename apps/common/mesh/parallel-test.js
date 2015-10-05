import parallel from "./parallel";
import co from "co";
import expect from "expect.js";
import { BufferedResponse } from "./_responses";

describe(__filename + "#", function() {
  it("combines multiple handlers into one", co.wrap(function*() {
    var data = yield parallel(
      function(operation) {
        expect(operation.name).to.be("get");
        return new BufferedResponse(1);
      },
      function(operation) {
        expect(operation.name).to.be("get");
        return new BufferedResponse(2);
      }
    )({ name: "get" }).readAll();
    expect(data.length).to.be(2);
    expect(data[0]).to.be(1);
    expect(data[1]).to.be(2);
  }));
});
