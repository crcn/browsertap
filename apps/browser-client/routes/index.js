import forms   from "common/data/forms";
import Invitee from "common/data/models/invitee";

module.exports = function(app) {
  var router = app.router;

  async function auth(location, next) {

    try {

      // stuff already exists
      if (location.user)  {
        return next();
      }

      var user         = (await forms.getSessionUser(app.bus));
      var organization = (await user.getOrganizations())[0];

      location.setProperties({
        user         : user,
        organization : organization
      });
      next();
    } catch(e) {
      return router.redirect("login", {
        error: e
      });
    }
  };

  router.addRoute("home", "/", auth, function(location) {
    location.setProperties({
      state: {
        mainPage: "home",
        authPage: "signup"
      }
    });
  });

  router.addRoute("app", "/app", function(location) {
    location.setProperties({
      state: {
        mainPage: "app",
      }
    });
  });

  router.addRoute("signup", "/signup", function(location) {
    location.setProperties({
      state: {
        mainPage: "auth",
        authPage: "signup"
      }
    });
  });

  router.addRoute("requestInviteComplete", "/request-invite-complete", function(location) {
    location.setProperties({
      state: {
        mainPage: "auth",
        authPage: "requestInviteComplete"
      }
    });
  });

  router.addRoute("invite", "/invite/:shortcode", async function(location) {

    var data = Object.assign({ bus: app.bus }, (await app.bus.execute({
      action: "getInviteeFromShortCode",
      shortcode: location.params.shortcode
    }).read()).value);

    location.setProperties({
      state: {
        inviter  : new Invitee(data),
        mainPage : "auth",
        shortcode: location.params.shortcode,
        authPage : "invited"
      }
    });
  });

  router.addRoute("forgotPassword", "/forgot", function(location) {
    location.setProperties({
      state: {
        mainPage: "auth",
        authPage: "forgotPassword"
      }
    });
  });

  router.addRoute("resetPassword", "/reset-password/:token._id", function(location) {
    location.setProperties({
      state: {
        token: location.params.token,
        mainPage: "auth",
        authPage: "resetPassword"
      }
    });
  });

  router.addRoute("login", "/login", function(location) {
    location.setProperties({
      state: {
        mainPage: "auth",
        authPage: "login"
      }
    });
  });

  router.addRoute("logout", "/logout", async function(location) {
    await forms.logout(app.bus);
    router.redirect("login");
  });

  router.addRoute("confirm", "/confirm/:token._id", async function(location) {

    var err;

    try {
      await forms.confirmAccount(app.bus, location.params.token);
    } catch(e) {
      err = e;
    }

    location.setProperties({
      state: {
        mainPage: "auth",
        error   : err,
        authPage: "confirmed"
      }
    });
  });
};
