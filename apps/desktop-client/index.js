require("babel/register")({
  optional: ["es7.classProperties", "es7.decorators"]
});

var Application = require("./application");
var getConfig   = require("./get-config");

/**
 */

var app = global.app = new Application({
  config: getConfig({})
});

/**
 */

app.initialize(function() {
  app.logger.info("initialized");
});
