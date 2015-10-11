var testUtils = require("desktop-client/test/utils");

describe(__filename + "#", function() {

  var app;

  beforeEach(function(next) {
    testUtils.createFakeApp().then(function(a) {
      app = a;
      next();
    }, next);
  });

  it("automatically synchronizes windows from a machine that was added", function() {

  });
});
