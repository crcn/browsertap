var Application = require("./index");
var expect      = require("expect.js");

describe(__filename + "#", function() {
  it("can be created", function() {
    new Application();
  });
});
