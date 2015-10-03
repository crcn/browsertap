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

app.initialize().then(function() {
  app.logger.info("initialized");
});

require("./test.js");
