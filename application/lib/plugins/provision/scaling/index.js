var Scaler = require("./scaler"),
sift = require("sift");

exports.require = ["core", "ectwo"];
exports.plugin = function(core, ectwo, loader) {
  var cols = core.collections,
  scalers = [];


  core.desktopImages.watch({ os: { $ne: undefined }}, {
    change: function(desktopImage) {
      tryWatchingImage(desktopImage);
    }
  });


  function tryWatchingImage(desktopImage) {

    if(sift({ os: desktopImage.get("os") }, scalers).length) return;

    scalers.push(new Scaler({ os: desktop.get("os"), flavor: loader.params("desktopFlavor")}, core.collections));
  }
}