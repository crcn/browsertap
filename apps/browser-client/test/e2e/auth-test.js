var expect = require('expect.js');
var React  = require('react/addons');
var testUtils = require('browser-client/test/utils');
var timeout = require('common/test/utils').timeout;

describe(__filename + '#', function() {

  var browserApp;
  var apiApp;

  beforeEach(async function() {
    browserApp = await testUtils.createFakeApp();
    apiApp = browserApp.apiApp;
  });

  it('can redirect to the login page', function() {
    browserApp.router.redirect('login');
    expect(browserApp.element.querySelector('.login-form')).not.to.be(null);
  });


  it('can redirect to the signup page', function() {
    browserApp.router.redirect('signup');
    expect(browserApp.element.querySelector('.signup-form')).not.to.be(null);
  });

  it('can redirect to the forgot password page', function() {
    browserApp.router.redirect('forgotPassword');
    expect(browserApp.element.querySelector('.forgot-password-form')).not.to.be(null);
  });

  async function signup() {
    browserApp.router.redirect('signup');
    var emailAddressInput = browserApp.element.querySelector('*[name="emailAddress"]');
    var passwordInput     = browserApp.element.querySelector('*[name="password"]');
    emailAddressInput.value = 'a@b.com';
    passwordInput.value     = 'password';
    React.addons.TestUtils.Simulate.change(emailAddressInput);
    React.addons.TestUtils.Simulate.change(passwordInput);
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector('form'));
  }

  it('can successfuly sign up a user', async function() {
    await signup();
    await timeout(2);
    expect(browserApp.element.querySelector('.alert-success')).not.to.be(null);
  });

  it('can confirm an account after signing up', async function() {
    signup();
    await timeout(10);
    var messages = apiApp.emailer.outbox.messages;
    var message = messages.shift();
    var route = message.body.match(/(\/confirm\/.*)/)[1];
    browserApp.router.redirect(route);
    await timeout(50);
    expect(browserApp.element.innerHTML).to.contain('alert-success');
  });

  it('redirects to the login page if on the home page and not authorized', async function() {
    browserApp.router.redirect('logout');
    await timeout(5);
    expect(browserApp.element.innerHTML).to.contain('login-form');
  });

  it('can reset a forgotten password and login with it', async function() {
    browserApp.router.redirect('logout');
    browserApp.router.redirect('forgotPassword');
    browserApp.testUtils.setInputValue('*[name="emailAddress"]', browserApp.test.fixtures.unverifiedUser.emailAddress);
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector('form'));

    await timeout(2);
    var message = apiApp.emailer.outbox.messages.pop();
    browserApp.router.redirect(message.body.valueOf().match(/(\/reset-password\/.*)/)[1]);
    browserApp.testUtils.setInputValue('*[name="password"]', 'password99');
    browserApp.testUtils.setInputValue('*[name="repeatPassword"]', 'password99');
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector('form'));
    await timeout(2);
    expect(browserApp.router.location.toString()).to.contain('showMessage=authResetPassword.loginWithNewPassword');
    expect(browserApp.element.innerHTML).to.contain('alert-info');
  });
});
