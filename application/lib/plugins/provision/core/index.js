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

exports.require = ["ectwo", "simplecache"];
exports.plugin = function(ectwo, cache, loader) {

  var cols = new Collections({
    defaultRegion: loader.params("defaultRegion"),
    desktopFlavor: loader.params("desktopFlavor") || "c1.medium",
    cache: cache,
    testingMode: loader.params("testingMode"),
    testingInstances: loader.params("testing.instances") || [],
    desktopPort: loader.params("desktopPort"),
    hosts: loader.params("hosts")
  }, ectwo);


  return {
    collections: cols
  }
}


