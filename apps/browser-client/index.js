var Application = require("./application");
var getConfig   = require("common/get-config");

/**
 */

var app = global.app = new Application({
  element: document.getElementById("application"),
  config: getConfig({
    socket: {
      client: "http://0.0.0.0:8080"
    }
  })
});

/**
 */

app.initialize(function() {
  app.logger.info("initialized");
});
