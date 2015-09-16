var expect   = require("expect.js");
var React    = require("react/addons");
var Invitee  = require("api/data/models/invitee");
var e2eUtils = require("./utils");
var co       = require("co");

describe(__filename + "#", function() {

  beforeEach(function() {
    browserApp.config.beta = true;  
  });

  it("displays the request invite form instead of the signup form if the app is in beta", function() {
    browserApp.router.redirect("signup");
    expect(browserApp.element.innerHTML).to.contain("request-invite-form");
  });

  it("can register for beta", function(next) {
    browserApp.router.redirect("signup");
    e2eUtils.setInputValue("*[name='name']", "bob marley");
    e2eUtils.setInputValue("*[name='emailAddress']", "a@b.com");
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector("form"));

    setTimeout(function() {
      expect(browserApp.element.innerHTML).to.contain("request-invite-complete");
      next();
    }, 0);
  });

  it("can use the invite link to sign up a new user", function(next) {
    browserApp.router.redirect("signup");
    e2eUtils.setInputValue("*[name='name']", "bob marley jr");
    e2eUtils.setInputValue("*[name='emailAddress']", "a@b.com");
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector("form"));

    setTimeout(function() {
      var value = browserApp.element.querySelector("input").value.match(/(\/invite\/.*)/)[1];
      var shortcode = value.match(/invite\/(.*)/)[1];
      browserApp.router.redirect(value);

      setTimeout(function() {
        expect(browserApp.element.innerHTML).to.contain("bob marley jr")
        browserApp.router.redirect(browserApp.element.querySelector("a").href.match(/#(.*)/)[1]);


        e2eUtils.setInputValue("*[name='name']", "bill marley");
        e2eUtils.setInputValue("*[name='emailAddress']", "c@d.com");
        React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector("form"));

        setTimeout(co.wrap(function*() {
          var inviter = yield Invitee.findOne(browserApp.bus, { shortcode: shortcode });
          expect(Number(inviter.inviteCount)).to.be(1);
          expect(yield Invitee.findOne(browserApp.bus, { "inviter._id": String(inviter._id) })).not.to.be(void 0);
          next();
        }), 1);

      }, 1);
    }, 1);
  });

  it("can still register a user if the inviter is not found");
});