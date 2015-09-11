var glob      = require("glob");
var mu        = require("mustache");
var camelCase = require("lodash/string/camelCase");
var path      = require("path");
var fs        = require("fs");


var tpls = {};

glob.sync(__dirname + "/*.mu").map(function(filename) {
  var name = camelCase(path.basename(filename).split(".").shift());
  var src = fs.readFileSync(filename, "utf8");

  tpls[name] = function(context) {
    return mu.render(src, context);
  }
});

export default tpls;