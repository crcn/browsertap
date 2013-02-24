/*


var desktop = analytics.collection("desktopImage"),
item = desktop.item({ os: { name: "XX", version: "XX" }});

var startupTimer = item.timer("startup"),
usageTimer       = it¡¡em.timer("usage"),
creationTimer    = item.timer("creation"),


*/

Analytics = require("./analytics");

exports.require = ["plugin-mongodb"];
exports.plugin = function() {
  var analytics = new Analytics();
  return analytics;
}