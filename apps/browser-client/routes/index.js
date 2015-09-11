import ConfirmForm from "common/data/forms/confirm-account";
import co          from "co";

module.exports = function(app) {
  var router = app.router;

  router.addRoute("home", "/", function(location) {
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

  router.addRoute("confirm", "/confirm/:token._id", co.wrap(function*(location) {
    var form = new ConfirmForm({ token: location.params.token })
    yield form.submit();
  }));
};
