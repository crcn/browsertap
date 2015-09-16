import forms   from "common/data/forms";
import co      from "co";
import Invitee from "common/data/models/invitee";

module.exports = function(app) {
  var router = app.router;

  var auth = co.wrap(function*(location, next) {

    try { 

      // stuff already exists
      if (location.user)  {
        return next();
      }
 
      var user         = (yield forms.getSessionUser(app.bus));
      var organization = (yield user.getOrganizations())[0]; 

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
  });

  router.addRoute("home", "/", auth, co.wrap(function*(location) {
    location.setProperties({
      state: {
        mainPage: "home", 
        authPage: "signup"
      }
    });
  }));

  router.addRoute("app", "/app", auth, function(location) {
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

  router.addRoute("invite", "/invite/:shortcode", co.wrap(function*(location) {

    var data = Object.assign({ bus: app.bus }, yield app.bus({ 
      name: "getInviteeFromShortCode", 
      shortcode: location.params.shortcode 
    }));
 
    location.setProperties({ 
      state: {
        inviter  : new Invitee(data),
        mainPage : "auth",
        shortcode: location.params.shortcode,
        authPage : "invited"
      }
    });
  }));

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

  router.addRoute("logout", "/logout", co.wrap(function*(location) {
    yield forms.logout(app.bus);
    router.redirect("login");
  }));

  router.addRoute("confirm", "/confirm/:token._id", co.wrap(function*(location) {

    var err;

    try {
      yield forms.confirmAccount(app.bus, location.params.token);
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
  }));
};
