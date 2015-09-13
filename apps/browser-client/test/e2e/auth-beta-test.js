var expect = require("expect.js");
var React  = require("react/addons");
var e2eUtils = require("./utils");

describe(__filename + "#", function() {

  beforeEach(function() {
    browserApp.config.beta = true;  
  });

  it("displays the request invite form instead of the signup form if the app is in beta", function() {
    browserApp.router.redirect("signup");
    expect(browserApp.element.innerHTML).to.contain("request-invite-form");
  });
});