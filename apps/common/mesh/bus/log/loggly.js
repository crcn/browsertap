import loggly from "loggly";
import { NoopBus, EmptyResponse } from "mesh";

module.exports = function(app) {

  var config = app.get("config.loggly");

  if (!config) return new NoopBus();

  var client = loggly.createClient(config);

  this.execute = function(operation) {

    if (/warn|error/.test(operation.type)) {
      client.log(operation);
    }

    return new EmptyResponse();
  };
};
