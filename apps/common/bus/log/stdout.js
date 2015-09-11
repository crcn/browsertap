import padRight from "lodash/string/padRight";
import chalk from "chalk";
import parseStack from "parse-stack";

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

  return function(operation) {

    // TODO - calc log info here such as log(":break");

    // if (operation.args[0] instanceof Array) {
    //   var error = operation.args[0].error;
    //   operation.args = [error.message, { stack: parseStack(error), platform: platformInfo }]
    // }

    var args = operation.args.map(function(arg) {
      if (typeof arg !== "object") return arg;
      if (arg instanceof Error) {
        return arg.stack;
      }
      return JSON.stringify(arg, null, 2);
      // return "\n" + prttty.render(arg, { noColor: true });

      // .replace(/".*?"/g, function(match) {
      //   return chalk.blue(match)
      // })
    }).concat();

    var msg = args.shift();

    msg     = typeof msg === "string" ? msg.replace(/%./g, args.shift.bind(args)) : "";

    msg = [msg].concat(args).join(" ");

    if (snippets[msg]) {
      msg = snippets[msg]();
    }

    var color = colors[operation.type];

    var label = ": ";

    if (color) {
      label = chalk[color](label);
    }

    msg =  label + msg;

    if (/warn|error/.test(operation.type)) {
      console.error(msg);
    } else {
      console.log(msg);
    }

    return Promise.resolve();
  };
};
