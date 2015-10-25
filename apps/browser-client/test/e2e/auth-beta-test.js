var expect   = require('expect.js');
var React    = require('react/addons');
var Invitee  = require('common/data/models/invitee');
var testUtils = require('browser-client/test/utils');
var timeout   = require('common/test/utils').timeout;

describe(__filename + '#', function() {

  var browserApp;

  beforeEach(async function() {
    browserApp = await testUtils.createFakeApp();
  });

  beforeEach(function() {
    browserApp.config.beta = true;
  });

  it('displays the request invite form instead of the signup form if the app is in beta', function() {
    browserApp.router.redirect('signup');
    expect(browserApp.element.innerHTML).to.contain('request-invite-form');
  });

  it('can register for beta', async function() {
    browserApp.router.redirect('signup');
    browserApp.testUtils.setInputValue('*[name="name"]', 'bob marley');
    browserApp.testUtils.setInputValue('*[name="emailAddress"]', 'a@b.com');

    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector('form'));

    await timeout(0);
    expect(browserApp.element.innerHTML).to.contain('request-invite-complete');
  });

  it('can use the invite link to sign up a new user', async function() {
    browserApp.router.redirect('signup');
    browserApp.testUtils.setInputValue('*[name="name"]', 'bob marley jr');
    browserApp.testUtils.setInputValue('*[name="emailAddress"]', 'a@b.com');
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector('form'));

    await timeout(5);
    var value = browserApp.element.querySelector('input').value.match(/(\/invite\/.*)/)[1];
    var shortcode = value.match(/invite\/(.*)/)[1];
    browserApp.router.redirect(value);
    await timeout(5);
    expect(browserApp.element.innerHTML).to.contain('bob marley jr')
    browserApp.router.redirect(browserApp.element.querySelector('a').href.match(/#(.*)/)[1]);


    browserApp.testUtils.setInputValue('*[name="name"]', 'bill marley');
    browserApp.testUtils.setInputValue('*[name="emailAddress"]', 'c@d.com');
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector('form'));

    await timeout(5);
    var inviter = await Invitee.findOne(browserApp.bus, { shortcode: shortcode });
    expect(Number(inviter.inviteCount)).to.be(1);
    expect(await Invitee.findOne(browserApp.bus, { 'inviter._id': String(inviter._id) })).not.to.be(void 0);

  });

  it('can still register a user if the inviter is not found');
});
