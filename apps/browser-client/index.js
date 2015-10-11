// require("intl");
require("babel/polyfill");
var Application = require("./application");
var getConfig   = require("./get-config");

/**
 */

var app = global.app = new Application({
  element: document.getElementById("application"),
  config: getConfig({})
});

/**
 */ 

app.initialize(function() {
  app.logger.info("initialized");
});
