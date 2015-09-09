import loggly from "loggly";
import mesh from "mesh";

module.exports = function(app) {

  var config = app.get("config.loggly");

  if (!config) return mesh.noop;

  var client = loggly.createClient(config);

  return mesh.wrap(function(operation, next) {

    if (/warn|error/.test(operation.type)) {
      client.log(operation);
    }

    next();
  });
};
