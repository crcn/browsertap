// var createSocketBus = require('common/mesh/bus/log/socketio');
// var io              = require('socket.io-client');
// var mesh            = require('mesh');
var mesh = require('mesh');
var Response = mesh.Response;
var NoopBus = mesh.NoopBus;
var sa   = require('superagent');
var httperr = require('httperr');

export default {
  create: function (app, bus) {

    var host    = app.get('config.hosts.api');
    // var channel = app.get('config.socket.channel');

    // app.logger.info('socket.io channel: %s', channel);
    app.logger.info('api host: %s', host);

    // var client = io(host);
    // var bus    = void 0;
    // bus        = createSocketBus(channel, client, bus);

    if (!bus) bus = NoopBus.create();
    if (!process.browser) return bus;

    return {
      execute: function(operation) {
        return Response.create(function(writable) {
          var r = sa.post('/o').send(operation).end(function(err, response) {
            var body = response.body;
            if (!body) return writable.close();

            if (body.error) {
              var err = httperr[body.error.statusCode](body.error.message);
              return writable.abort(err);
            }

            writable.write(body);
            writable.close();
          });
        });
      }
    };
  }
};
