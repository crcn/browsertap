import CommandBus       from 'common/mesh/bus/command';
import sift             from 'sift';
import BrowserWindow    from 'browser-window';
import syncDbCollection from 'common/mesh/utils/sync-db-collection';
import DataObject       from 'common/data/object';
import FilterThrough    from 'common/mesh/stream/filter-through';
import ModelCollection  from 'common/data/models/collection';
import BusWriter        from 'common/mesh/stream/bus-writer';
import CollectionBus    from 'common/mesh/bus/collection';
import VirtWindow       from 'desktop-client/data/models/virt-window';

class VirtWindowPopup extends DataObject {
  constructor(properties, app) {
    super(properties);
    this.app = app;
    this._window = new BrowserWindow({
      width: properties.source.width.valueOf(),
      height: properties.source.height.valueOf()
    });

    this._window.loadUrl(__dirname + '/window.html');
  }
  dispose() {
    console.log('dispose');
  }
}

export default {
  create: function(app) {

    return CommandBus.create({
      execute: execute
    });

    // TODO - change to async
    async function execute(operation) {

      app.logger.info('synchronizing virtual windows');

      var popups = new ModelCollection({
        source: await VirtWindow.find(app.bus, {
          width: { $gt: 60 },
          height: { $gt: 60 },
          title: { $ne: '' }
        }, { tail: true }),
        createModel: (properties) => VirtWindowPopup.create(properties, app)
      });
    }

  }
}
