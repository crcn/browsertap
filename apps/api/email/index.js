
var mailers = {
  mock    : require("./mock"),
  mailgun : require("./mailgun")
};

module.exports = function(app) {
  app.email = mailers.mock(app);
}