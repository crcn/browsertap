var Application = require("./application");

var app = new Application({
  log: {
    level: require("common/logger/levels").ALL
  }
});

app.logger.info("Hello World");
app.logger.verbose("Hello World");
app.logger.error("Hello World");
