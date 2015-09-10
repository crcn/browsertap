import loggly from "loggly";
import mesh from "common/mesh";

module.exports = function(app) {

  var config = app.get("config.loggly");

  if (!config) return mesh.noop;

  var client = loggly.createClient(config);

  return function(operation) {

    if (/warn|error/.test(operation.type)) {
      client.log(operation);
    }

    return Promise.resolve();
  };
};
