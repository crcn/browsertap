var loggerPlugin = require("./index");
var mesh         = require("mesh");
var expect       = require("expect.js");
var LogLevels    = require("common/logger/levels");
var BaseModel    = require("common/data/models/base/model");

describe(__filename + "#", function() {

  it("attaches .logger property to the model", function() {
    var model = new BaseModel();
    loggerPlugin(model);
  });

  it("gets config properties from the model", function() {

    var model = new BaseModel({
      config: {
        log: {
          level: LogLevels.VERBOSE
        }
      }
    });

    loggerPlugin(model);

    expect(model.logger.level).to.be(LogLevels.VERBOSE);
  });

  it("re-routes all logs back to the application bus", function() {

    var ops = [];

    var model = new BaseModel({
      bus: ops.push.bind(ops),
      config: {
        log: {
          level: LogLevels.ALL
        }
      }
    });

    loggerPlugin(model);

    model.logger.notice("hello world");
    expect(ops.length).to.be(1);
  });
});
