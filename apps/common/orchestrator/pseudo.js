var localImage = new VirtualMachineImage("http://ievms.com/ie7.vbox", {
  applications: [
    { name: "ie", verson: "7" }
  ]
});

var vb = new VirtualBoxOrchestrator([localImage])
var bt = new BrowserTapOrchestrator();
var aw = new AWSOrchestrator({
  getImages: function() {
    return new Promise()
  }
});
var go = new GroupOrchestrator(vb, bt, aw);

// list this to the user
var apps  = flatten(yield go.images.all().map(function(image) {
  return image.tags.filter(function(tag) {
    return tag.name === "application";
  }).map(function(tag) {
    return tag.value;
  });
})); // [ie@7, chrome@34]

// there should always be a running server with browsertap if it's an option.
var server = yield go.servers.find({ idle: true, "tags": { name: "application", value: "ie@7" }});

if (!server) {
  if (!confirm("ie@7 is not running. Would you like to spawn an instance?")) {
    var images = yield go.images.find({ "tags": { name: "application", value: "ie@7" }}).sort(closest);
  }
}