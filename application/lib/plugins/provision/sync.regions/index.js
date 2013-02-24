var RegionSync = require("./regionSync");

exports.require = ["ectwo"];
exports.plugin = function(ectwo, loader) {
  var defaultRegion = loader.params("masterRegion");

  var sync = new RegionSync({ masterRegionName: defaultRegion }, ectwo);
  sync.start();
}