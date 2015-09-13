import forms from "common/data/forms";
import co    from "co";

module.exports = function(app) {
  var router = app.router;

  var auth = co.wrap(function*(location, next) {

    try { 
      location.setProperties({
        user: location.user || (yield forms.getSessionUser(app.bus))
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
    router.redirect("home");
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
