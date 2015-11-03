import { NoResponse, commands } from 'common/mesh/bus/commands';
import _command from 'common/mesh/bus/command';
import Machine from 'common/data/models/machine';

export default function(app, mdns) {

  if (!mdns) mdns = require('mdns');

  var port       = app.config.mdns.port;
  var collection = app.config.mdns.collection || 'servers';
  var name       = app.config.mdns.advertise;
  var browse     = app.config.mdns.browse || [];

  app.logger.info('mdns port: %d', port);
  app.logger.info('mdns collection: %d', collection);

  if (name) {
    app.logger.info('mdns create advertisement: %d', name);
    var ad = mdns.createAdvertisement(mdns.tcp(name), port);
    ad.start();
  }

  browse.forEach(function(browseName) {
    app.logger.info('mdns browsing: %s', browseName);
    var browser = mdns.createBrowser(mdns.tcp(browseName));

    function _deser(service) {
      return {
        _id: service.type.name + '://' + service.name,
        type: service.type.name,
        name: service.name,
        host: service.host,
        port: service.port
      };
    }

    browser.on('serviceUp', async function(service) {
      app.logger.info('mdns service %s up', browseName);

      var m = Machine.create({
        source: _deser(service),
        bus: app.bus
      });

      await m.save();
    });

    browser.on('serviceDown', async function(service) {
      app.logger.info('mdns service %s down', browseName);

      var source = _deser(service);

      var machine = await Machine.findOne(app.bus, {
        _id: source._id
      });

      if (!machine) {
        return app.logger.warn('machine %s does not exist', source._id);
      }

      await machine.remove();
    });

    browser.start();
  });
}
