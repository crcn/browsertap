import CommandBus    from 'common/mesh/bus/command';
import sift          from 'sift';
import BrowserWindow from 'browser-window';
import syncDbCollection from 'common/mesh/utils/sync-db-collection';
import DataObject from 'common/data/object';
import FilterThrough from 'common/mesh/stream/filter-through';
import ModelCollection from 'common/data/models/collection';
import BusWriter from 'common/mesh/stream/bus-writer';
import CollectionBus from 'common/mesh/bus/collection';

class VirtWindow extends DataObject {
  constructor(properties, app) {
    super(properties);
    console.log('init window');
    this.app = app;
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
    function execute(operation) {

      app.logger.info('synchronizing virtual windows');

      app.bus.execute({
        action: 'tail'
      })
      .pipeTo(FilterThrough.create(sift({
        collection: 'virtWindows'
      })))
      .pipeTo(
        BusWriter.create(
          CollectionBus.create(
            ModelCollection.create({
              createModel: (properties) => VirtWindow.create(properties, app)
            }).getSourceCollection()
          )
        )
      )
    }

    function insert(virtWindow) {

      // TODO - app.bus.execute({ action: 'openWindow', model: virtWindow });

      // TODO - this filter should not be here. Should be where windows are synced
      if (virtWindow.height < 60 || virtWindow.width < 60 || virtWindow.title === '' || /manager/i.test(virtWindow.title)) {
        return app.logger.notice('ignoring window ', virtWindow);
      }

      // app.classes.create('native:window');

      app.bus.execute({
        action: 'openWindow',
        width: virtWindow.width,
        height: virtWindow.height,
        title: virtWindow.title,
        componentName: 'virt-window',
        props: {
          virtualWindow: virtWindow
        }
      });
    }
  }
}
