import loggly from 'loggly';
import { NoopBus, EmptyResponse } from 'mesh';

export default {
  create: function(app) {

    var config = app.get('config.loggly');

    if (!config) return NoopBus.create();

    var client = loggly.createClient(config);

    return {
      execute: function(operation) {

        if (/warn|error/.test(operation.type)) {
          client.log(operation);
        }

        return EmptyResponse.create();
      }
    }
  }
};
