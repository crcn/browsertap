var buppet = require("buppet")();


buppet.open({ name: "chrome", url: "http://google.com" version: "18" }, function(err, browser) {

});

buppet.on("popup", function() {

});