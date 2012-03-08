(function() {
  var Controller, app;

  Controller = require("./controller");

  exports.create = function(config) {
    return new Controller().config(config);
  };

  app = exports.create({
    directory: "~/Desktop/browsers"
  }).listen(8088);

  app.on("browserProxy", function(proxy) {
    proxy.on("locationChange", function(location) {
      return console.log(location.href);
    });
    return proxy.on("focus", function() {
      return console.log(proxy.location.href);
    });
  });

}).call(this);
