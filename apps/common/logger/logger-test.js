var Logger    = require("./logger");
var LogLevels = require("./levels");
var expect    = require("expect.js");

describe(__filename + "#", function() {

  it("can be created", function() {
    new Logger();
  });

  it("can set the level of the logger", function() {
    expect((new Logger({ level: LogLevels.NONE })).level).to.be(LogLevels.NONE);
    expect((new Logger({ level: LogLevels.DEBUG })).level).to.be(LogLevels.DEBUG);
  });

  it("only passes appropriate logs to the bus", function() {
    var logs = [];
    var logger = new Logger({
      bus: logs.push.bind(logs),
      level: LogLevels.VERBOSE
    });

    logger.notice("hello");
    expect(logs.length).to.be(0);

    logger.error("hello");
    expect(logs.length).to.be(0);

    logger.warn("hello");
    expect(logs.length).to.be(0);

    logger.verbose("hello");
    expect(logs.length).to.be(1);
  });

  it("can dynamically set the level", function() {
    var logs = [];
    var logger = new Logger({
      bus: logs.unshift.bind(logs),
      level: LogLevels.VERBOSE
    });

    logger.verbose("hello");
    expect(logs[0].type).to.be("verbose");

    logger.level = LogLevels.WARN;

    logger.warn("hello");
    logger.verbose("hello");
    expect(logs[0].type).to.be("warn");

    logger.level = LogLevels.ERROR | LogLevels.NOTICE;

    logger.notice("hello");
    expect(logs[0].type).to.be("notice");
    logger.error("hello");
    expect(logs[0].type).to.be("error");
    logger.verbose("hello");
    expect(logs[0].type).to.be("error");
  });
});