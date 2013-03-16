var RegionSync = require("./regionSync");

exports.require = ["ectwo"];
exports.plugin = function(ectwo, loader) {

  if(!loader.params("runEC2")) {
    return console.log("running in test mode, not synchronizing images.");
  }

  var defaultRegion = loader.params("masterRegion");

  var sync = new RegionSync({ masterRegionName: defaultRegion }, ectwo);
  sync.start();
}