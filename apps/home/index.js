import Application from "./application";

var app = global.app = new Application({
  element: document.getElementById("application")
});

app.initialize();
