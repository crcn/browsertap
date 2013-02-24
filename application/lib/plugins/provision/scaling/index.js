var Scaler = require("./scaler"),
sift = require("sift");

exports.require = ["core", "ectwo"];
exports.plugin = function(core, ectwo, loader) {

  if(!loader.params("runEC2")) {
    return console.log("running in test mode, not scaling servers.");
  }

  var cols = core.collections,
  scalers = [];


  core.desktopImages.watch({ os: { $ne: undefined }}, {
    change: function(desktopImage) {
      tryWatchingImage(desktopImage);
    }
  });

  // TODO - need to take into account the regions as well

  function tryWatchingImage(desktopImage) {

    var search = { os: desktopImage.get("os"),  region: desktopImage.get("region") };

    if(sift(search, scalers).length) return;

    scalers.push(new Scaler({ os: desktop.get("os"), ectwo: ectwo, flavor: loader.params("desktopFlavor") }, core.collections));
  }
}