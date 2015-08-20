var sprintf = require("sprintf").sprintf;
var colors  = require("colors");

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
      var msg = operation.type[colors.notice || "grey"] + ": " + sprintf.apply(void 0, operation.args);

      if (/warn|error/.test(operation.type)) {
        console.error(msg);
      } else {
        console.log(msg);
      }
    }
  };
};
