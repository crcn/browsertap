var Application = require("./application");
var getConfig   = require("common/get-config");

var app = new Application({
  element: document.getElementById("application"),
  config: getConfig({})
});

app.initialize(function() {
  app.logger.info("initialized");
});
