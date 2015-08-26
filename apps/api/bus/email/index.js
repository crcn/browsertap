var mesh    = require("mesh");
var sift    = require("sift");
var mailgun = require("mailgun");

var adapters = {
  mock    : require("./mock"),
  mailgun : require("./mailgun")
};

module.exports = function(app, bus) {

  var type = app.get("config.email.type");

  app.logger.info("init email client: %s", type);

  var client = adapters[type](app.get("config.email"));

  return mesh.accept(
    sift({ name: "email" }),
    mesh.wrap(function(operation, next) {

    }),
    bus
  );
};
