/*

1. watch for any new instances to be added - synchronize them to a new collection.
2. fetch information about each instance
3. put instance in a ready state (synchronize collections)


*/


/*

var ifact = new InstanceFactory();
ifact.getInstance({
  
});

*/

var Collections = require("./collections");

exports.require = ["ectwo"];
exports.plugin = function(ectwo, loader) {

  var cols = new Collections({
    defaultRegion: loader.params("defaultRegion"),
    desktopFlavor: loader.params("desktopFlavor") || "c1.medium"
  }, ectwo);


  return {
    collections: cols
  }
}


