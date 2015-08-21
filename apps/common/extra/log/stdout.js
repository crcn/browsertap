var padRight = require("lodash/string/padRight");
var chalk    = require("chalk");

module.exports = function(app) {

  var colors = {
    notice   : "blue",
    warn     : "yellow",
    error    : "red",
    verbose  : "grey",
    info     : "cyan"
  };

  var snippets = {
    ":break": function() {
      return "------------------------------------------------";
    }
  };

  return {
    log: function(operation, next) {

      // TODO - calc log info here such as log(":break");

      var args = operation.args.map(function(arg) {
        if (typeof arg !== "object") return arg;
        return JSON.stringify(arg);
      }).concat();

      var msg = args.shift();

      msg     = typeof msg === "string" ? msg.replace(/%./g, args.shift.bind(args)) : "";

      msg = [msg].concat(args).join(" ");

      if (snippets[msg]) {
        msg = snippets[msg]();
      }

      var color = colors[operation.type];

      var label = process.pid + ": ";

      if (color) {
        label = chalk[color](label);
      }

      msg =  label + msg;

      if (/warn|error/.test(operation.type)) {
        console.error(msg);
      } else {
        console.log(msg);
      }
    }
  };
};
