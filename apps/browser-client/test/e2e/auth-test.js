import expect from 'expect.js';
import TestUtils from 'react-addons-test-utils';
import testUtils from 'browser-client/test/utils';
import { timeout } from 'common/test/utils';

describe(__filename + '#', function() {

  var browserApp;
  var apiApp;

  beforeEach(async function() {
    browserApp = await testUtils.createFakeApp();
    apiApp = browserApp.apiApp;
  });

  it('can redirect to the login page', async function() {
    browserApp.router.redirect('login');
    await timeout(0);
    expect(browserApp.element.querySelector('.login-form')).not.to.be(null);
  });


  it('can redirect to the signup page', async function() {
    browserApp.router.redirect('signup');
    await timeout(0);
    expect(browserApp.element.querySelector('.signup-form')).not.to.be(null);
  });

  it('can redirect to the forgot password page', async function() {
    browserApp.router.redirect('forgotPassword');
    await timeout(0);
    expect(browserApp.element.querySelector('.forgot-password-form')).not.to.be(null);
  });

  async function signup() {
    browserApp.router.redirect('signup');
    await timeout(0);
    var emailAddressInput = browserApp.element.querySelector('*[name="emailAddress"]');
    var passwordInput     = browserApp.element.querySelector('*[name="password"]');
    emailAddressInput.value = 'a@b.com';
    passwordInput.value     = 'password';
    TestUtils.Simulate.change(emailAddressInput);
    TestUtils.Simulate.change(passwordInput);
    TestUtils.Simulate.submit(browserApp.element.querySelector('form'));
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
    await timeout(0);
    expect(browserApp.element.innerHTML).to.contain('alert-success');
  });

  it('redirects to the login page if on the home page and not authorized', async function() {
    browserApp.router.redirect('logout');
    await timeout(5);
    expect(browserApp.element.innerHTML).to.contain('login-form');
  });

  it('can reset a forgotten password and login with it', async function() {
    browserApp.router.redirect('logout');
    await timeout(0);
    browserApp.router.redirect('forgotPassword');
    await timeout(0);
    browserApp.testUtils.setInputValue('*[name="emailAddress"]', browserApp.test.fixtures.unverifiedUser.emailAddress);
    TestUtils.Simulate.submit(browserApp.element.querySelector('form'));

    await timeout(2);
    var message = apiApp.emailer.outbox.messages.pop();
    browserApp.router.redirect(message.body.valueOf().match(/(\/reset-password\/.*)/)[1]);
    await timeout(0);
    browserApp.testUtils.setInputValue('*[name="password"]', 'password99');
    browserApp.testUtils.setInputValue('*[name="repeatPassword"]', 'password99');
    TestUtils.Simulate.submit(browserApp.element.querySelector('form'));
    await timeout(2);
    expect(browserApp.router.location.toString()).to.contain('showMessage=authResetPassword.loginWithNewPassword');
    expect(browserApp.element.innerHTML).to.contain('alert-info');
  });
});
