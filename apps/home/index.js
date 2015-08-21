var Application = require("./application");

var app = global.app = new Application({
  element: document.getElementById("application")
});

app.initialize();
 