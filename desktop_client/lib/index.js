var plugin = require("plugin");

plugin().
params({
  http: {
    port: 8080
  }
}).
paths(__dirname + "/../node_modules").
require("plugin-express").
require(__dirname + "/plugins").
load();