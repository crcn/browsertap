var Application = require("./application");
var getConfig   = require("common/get-config");

var app = new Application({
  config: getConfig({})
});

app.initialize(function() {
  console.log("initialize");
});