var expect       = require("expect.js");
var React        = require("react/addons");
var e2eTestUtils = require("./utils");
var co           = require("co");

describe(__filename + "#", function() {

  beforeEach(co.wrap(function*() {
    yield e2eTestUtils.login(browserApp.test.fixtures.unverifiedUser);
  }));

  xit("can redirect to the login page", function() {

  });
});