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
};
