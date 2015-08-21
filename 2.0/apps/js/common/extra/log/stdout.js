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

      var args = operation.args.map(function(arg) {
        if (typeof arg !== "object") return arg;
        return JSON.stringify(arg);
      }).concat();

      var msg = args.shift();
      msg     = msg.replace(/%./g, args.shift.bind(args));

      msg = [msg].concat(args).join(" ");

      msg = padRight(operation.type, 8, " ")[colors[operation.type] || "grey"] + ": " + msg;

      if (/warn|error/.test(operation.type)) {
        console.error(msg);
      } else {
        console.log(msg);
      }
    }
  };
};
