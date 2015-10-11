var expect       = require("expect.js");
var React        = require("react/addons");
var co           = require("co");

var testUtils = require("browser-client/test/utils");

describe(__filename + "#", function() {

  var browserApp;

  beforeEach(function(next) {
    testUtils.createFakeApp().then(function(app) {
      browserApp = app;
      next();
    }, next);
  });

  afterEach(function() {

  });

  beforeEach(co.wrap(function*() {
    yield browserApp.testUtils.login(browserApp.test.fixtures.unverifiedUser);
  }));

  xit("can redirect to the login page", function() {

  });
});
