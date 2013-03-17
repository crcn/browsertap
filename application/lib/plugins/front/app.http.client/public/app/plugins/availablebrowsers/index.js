outcome = require("outcome");

exports.name = "availablebrowsers";
exports.require = ["commands"];
exports.plugin = function(commands, loader) {


  $.ajax({
    url: [loader.params("host"), "/browsers.json"].join(""),
    dataType: "json",
    success: outcome.vine().success(function(browsers) {
      commands.emit("browsers", browsers);
    }),
    error: function() {
      console.log(arguments);
    }
  });

}