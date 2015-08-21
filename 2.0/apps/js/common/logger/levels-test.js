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

  it("DEVELOPMENT only has development level logs", function() {
    expect(LogLevels.DEVELOPMENT & LogLevels.NOTICE).not.to.be(0);
    expect(LogLevels.DEVELOPMENT & LogLevels.VERBOSE).not.to.be(0);
    expect(LogLevels.DEVELOPMENT & LogLevels.WARN).not.to.be(0);
    expect(LogLevels.DEVELOPMENT & LogLevels.ERROR).not.to.be(0);
  });

  it("STAGING only has staging level logs", function() {
    expect(LogLevels.STAGING & LogLevels.NOTICE).not.to.be(0);
    expect(LogLevels.STAGING & LogLevels.VERBOSE).to.be(0);
    expect(LogLevels.STAGING & LogLevels.WARN).not.to.be(0);
    expect(LogLevels.STAGING & LogLevels.ERROR).not.to.be(0);
  });

  it("can convert a string to a proper log level", function() {
    expect(LogLevels.fromString("NOTICE")).to.be(LogLevels.NOTICE);
    expect(LogLevels.fromString("NOTICE|warn")).to.be(LogLevels.NOTICE | LogLevels.WARN);
    expect(LogLevels.fromString("ALL")).to.be(LogLevels.ALL);
    expect(LogLevels.fromString("FDSFSDF")).to.be(LogLevels.NONE);
  });
});
