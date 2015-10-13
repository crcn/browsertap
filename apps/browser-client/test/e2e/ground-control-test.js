var expect       = require("expect.js");
var React        = require("react/addons");
var testUtils = require("browser-client/test/utils");

describe(__filename + "#", function() {

  var browserApp;

  beforeEach(async function() {
    browserApp = await testUtils.createFakeApp();
  });

  afterEach(function() {

  });

  beforeEach(async function() {
    await browserApp.testUtils.login(browserApp.test.fixtures.unverifiedUser);
  });

  xit("can redirect to the login page", function() {

  });
});
