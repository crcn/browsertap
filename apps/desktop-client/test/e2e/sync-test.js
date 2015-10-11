var testUtils = require("desktop-client/test/utils");
var MockSlave = require("desktop-client/test/mocks/slave");

describe(__filename + "#", function() {

  var app;

  beforeEach(function(next) {
    testUtils.createFakeApp().then(function(a) {
      app = a;
      next();
    }, next);
  });

  it("automatically synchronizes windows from a machine that was added", async function(next) {
    await app.bus.execute({ name: "insert", collection: "servers", data: {
      host: "127.0.0.0",
      port: 9090
    }}).read();
    next();
  });
});
