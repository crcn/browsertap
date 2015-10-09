import { AsyncResponse, NoResponse, commands } from "common/mesh/commands";
import _command from "common/bus/drivers/command";
import co from "co";

export default function(app, mdns) {

  if (!mdns) mdns = require("mdns");

  var port       = app.get("config.mdns.port");
  var collection = app.get("config.mdns.collection") || "servers";
  var name       = app.get("config.mdns.advertise");
  var browse     = app.get("config.mdns.browse") || [];

  app.logger.info("mdns port: %d", port);
  app.logger.info("mdns collection: %d", collection);

  if (name) {
    app.logger.info("mdns create advertisement: %d", name);
    var ad = mdns.createAdvertisement(mdns.tcp(name), port);
    ad.start();
  }

  browse.forEach(function(browseName) {
    app.logger.info("mdns browsing: %s", browseName);
    var browser = mdns.createBrowser(mdns.tcp(browseName));

    function _deser(service) {
      return {
        _id: service.type.name + "://" + service.name,
        type: service.type.name,
        name: service.name,
        host: service.host,
        port: service.port
      };
    }

    browser.on("serviceUp", function(service) {

      var item = _deser(service);

      co(function*() {
        app.logger.info("mdns service %s update", browseName);
        yield app.bus({
          name: "upsert",
          collection: collection,
          query: { _id: item._id },
          data: item
        });
      });

    });

    browser.on("serviceDown", function(service) {
      app.logger.info("mdns service %s down", browseName);
      app.bus({
        name: "remove",
        collection: collection,
        query: { _id: _deser(service)._id }
      });
    });

    browser.start();
  });
}