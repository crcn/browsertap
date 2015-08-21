module.exports = function(app) {
  var router = app.router;
  
  router.addRoute("home", "/", function(location) {
    location.setProperties({
      state: {
        bodyPage: "home",
        title: "BrowserTap"
      }
    });
  });

  router.addRoute("404", "/404", function(location) {
    location.setProperties({
      state: {
        bodyPage: "404",
        title: "Not Found"
      }
    });
  });

  router.addRoute("contact", "/contact", function(location) {
    location.setProperties({
      state: {
        bodyPage: "contact",
        title: "Contact"
      }
    });
  });

};