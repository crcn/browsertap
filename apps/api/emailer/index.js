
var mailers = {
  mock     : require("./mock"),
  mailgun  : require("./mailgun"),
  sendgrid : require("./sendgrid")
};

export default function(app) {
  var type = app.get("config.emailer.type");
  app.logger.info("init emailer: ", type);
  var emailer = mailers[type];

  app.emailer = emailer(app, app.get("config.emailer"));
};
