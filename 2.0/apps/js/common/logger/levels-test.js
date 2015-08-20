var LogLevels = require("./levels");
var expect    = require("expect.js");

describe(__filename + "#", function() {

  it("ALL has all levels", function() {
    expect(LogLevels.ALL & LogLevels.NOTICE).not.to.be(0);
    expect(LogLevels.ALL & LogLevels.VERBOSE).not.to.be(0);
    expect(LogLevels.ALL & LogLevels.WARN).not.to.be(0);
    expect(LogLevels.ALL & LogLevels.ERROR).not.to.be(0);
  });

  it("PRODUCTION only has production level logs", function() {
    expect(LogLevels.PRODUCTION & LogLevels.NOTICE).to.be(0);
    expect(LogLevels.PRODUCTION & LogLevels.VERBOSE).to.be(0);
    expect(LogLevels.PRODUCTION & LogLevels.WARN).not.to.be(0);
    expect(LogLevels.PRODUCTION & LogLevels.ERROR).not.to.be(0);
  });
});
