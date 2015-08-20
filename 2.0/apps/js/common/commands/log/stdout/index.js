var sprintf  = require("sprintf").sprintf;
var colors   = require("colors");
var padRight = require("lodash/string/padRight");

module.exports = function(app) {

  var colors = {
    notice   : "blue",
    warn     : "yellow",
    error    : "red",
    verbose  : "grey",
    info     : "magenta"
  };

  return {
    log: function(operation, next) {
      var msg = padRight(operation.type, 8, " ")[colors[operation.type] || "grey"] + ": " + sprintf.apply(void 0, operation.args);

      if (/warn|error/.test(operation.type)) {
        console.error(msg);
      } else {
        console.log(msg);
      }
    }
  };
};
