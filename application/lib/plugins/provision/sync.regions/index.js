var RegionSync = require("./regionSync");

exports.require = ["ectwo"];
exports.plugin = function(ectwo, loader) {

  if(!loader.params("runEC2")) {
    return console.log("running in test mode, not synchronizing images.");
  }

  console.log("not synchronizing regions")
  return;

  var defaultRegion = loader.params("masterRegion") || "us-east-1";

  var sync = new RegionSync({ masterRegionName: defaultRegion }, ectwo);
  sync.start();
}