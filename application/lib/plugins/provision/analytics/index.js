/*


var desktop = analytics.collection("desktopImage"),
item = desktop.item({ os: { name: "XX", version: "XX" }});

var startupTimer = item.timer("startup"),
usageTimer       = item.timer("usage"),
creationTimer    = item.timer("creation"),


*/

Analaytics = require("analytics");

exports.require = ["plugin-mongodb"];
exports.plugin = function() {
  var analytics = new Analytics();
  return analytics;
}