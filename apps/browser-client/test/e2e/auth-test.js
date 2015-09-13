var expect = require("expect.js");
var React  = require("react/addons");
var e2eUtils = require("./utils");

describe(__filename + "#", function() {

  it("can redirect to the login page", function() {
    browserApp.router.redirect("login");
    expect(browserApp.element.querySelector(".login-form")).not.to.be(null);
  });

  it("can redirect to the signup page", function() {
    browserApp.router.redirect("signup");
    expect(browserApp.element.querySelector(".signup-form")).not.to.be(null);
  });

  it("can redirect to the forgot password page", function() {
    browserApp.router.redirect("forgotPassword");
    expect(browserApp.element.querySelector(".forgot-password-form")).not.to.be(null);
  });

  function signup() {
    browserApp.router.redirect("signup");
    var emailAddressInput = browserApp.element.querySelector("*[name='emailAddress']");
    var passwordInput     = browserApp.element.querySelector("*[name='password']");
    emailAddressInput.value = "a@b.com";
    passwordInput.value     = "password";
    React.addons.TestUtils.Simulate.change(emailAddressInput);
    React.addons.TestUtils.Simulate.change(passwordInput);
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector("form"));
  }

  it("can successfuly sign up a user", function(next) {

    signup();
    setTimeout(function() {
      expect(browserApp.element.querySelector(".alert-success")).not.to.be(null);
      next();
    }, 1);
  });

  it("can confirm an account after signing up", function(next) {
    signup();
    setTimeout(function() {
      var messages = apiApp.emailer.outbox.messages;
      var message = messages.shift();
      var route = message.body.match(/(\/confirm\/.*)/)[1];
      browserApp.router.redirect(route);
      setTimeout(function() {
        expect(browserApp.element.innerHTML).to.contain("alert-success");
        next();
      }, 1);
    }, 1);
  });

  it("redirects to the login page if on the home page and not authorized", function(next) {
    browserApp.router.redirect("/");
    setTimeout(function() {
      expect(browserApp.element.innerHTML).to.contain("login-form");
      next();
    }, 1)
  });

  it("can reset a forgotten password and login with it", function(next) {
    browserApp.router.redirect("logout");
    browserApp.router.redirect("forgotPassword");
    e2eUtils.setInputValue("*[name='emailAddress']", browserApp.test.fixtures.unverifiedUser.emailAddress);
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector("form"));
    setTimeout(function() {
      var message = apiApp.emailer.outbox.messages.pop();
      browserApp.router.redirect(message.body.valueOf().match(/(\/reset-password\/.*)/)[1]);
      e2eUtils.setInputValue("*[name='password']", "password99");
      e2eUtils.setInputValue("*[name='repeatPassword']", "password99");
      React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector("form"));
      setTimeout(function() {
        expect(browserApp.router.location.toString()).to.contain("showMessage=authResetPassword.loginWithNewPassword");
        expect(browserApp.element.innerHTML).to.contain("alert-info");
        next();
      }, 1);
    }, 1);
  });
});